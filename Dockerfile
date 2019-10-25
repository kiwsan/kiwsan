# Dockerfile References: https://docs.docker.com/engine/reference/builder/

# Start from golang:1.13.2-alpine base image
FROM golang:alpine AS builder

# The latest alpine images don't have some tools like (`git` and `bash`).
# Adding git, bash and openssh to the image
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Add Maintainer Info
LABEL maintainer="Ekkachai Kiwsanthia <kiwsanthia@gmail.com>"

# Set the Current Working Directory inside the container
WORKDIR /io

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Copy go mod and sum files
# COPY go.mod go.sum ./

# Download all dependancies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Build the Go app
RUN go build -o /go/bin/app

FROM scratch
# Copy our static executable.
COPY --from=builder /go/bin/app /go/bin/app

# Expose port 8000 to the outside world
EXPOSE 8000

# run main.go
# CMD ["go", "run", "main.go"]
# Run the hello binary.
ENTRYPOINT ["/go/bin/app"]
