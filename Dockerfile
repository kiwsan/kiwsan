# Dockerfile References: https://docs.docker.com/engine/reference/builder/

# Start from golang:1.13.2-alpine base image
FROM golang:alpine AS build

# The latest alpine images don't have some tools like (`git` and `bash`).
# Adding git, bash and openssh to the image
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Add Maintainer Info
LABEL maintainer="Ekkachai Kiwsanthia <kiwsanthia@gmail.com>"

# Set the Current Working Directory inside the container
WORKDIR /build

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependancies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -a -installsuffix cgo -o app .

# Build the Go app
#RUN go build -o main .

FROM scratch

# Expose port 8000 to the outside world
EXPOSE 8000

COPY . .

# run main.go
#CMD ["go", "run", "main.go"]

WORKDIR /
COPY --from=0 /build/app /
CMD ["/app"]