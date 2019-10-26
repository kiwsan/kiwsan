# Dockerfile References: https://docs.docker.com/engine/reference/builder/

# Start from golang:1.13.2-alpine base image
FROM golang:1.13.2-alpine AS build

# Add Maintainer Info
LABEL maintainer="Ekkachai Kiwsanthia <kiwsanthia@gmail.com>"

# The latest alpine images don't have some tools like (`git` and `bash`).
# Adding git, bash and openssh to the image
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Create appuser.
RUN adduser -D -g '' appuser

# Set the Current Working Directory inside the container
WORKDIR /build

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependancies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download
RUN go mod verify

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -a -installsuffix cgo -o app .

FROM scratch

# Expose port 8000 to the outside world
EXPOSE 8000

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

WORKDIR /

# Import the user and group files from the builder.
COPY --from=build /etc/passwd /etc/passwd

# Copy our static executable.
COPY --from=build /build/app /

# Use an unprivileged user.
USER appuser

# Run the binary.
CMD ["/app"]