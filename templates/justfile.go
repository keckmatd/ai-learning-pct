# {{PROJECT_NAME}} - {{PROJECT_DESCRIPTION}}
# Go application

default:
    @just --list

# === Standard Vocabulary ===

build:
    go build -o bin/ ./...

test:
    go test ./...

dev:
    go run .

preflight:
    @echo "Running preflight checks..."
    go vet ./...
    go test ./...
    go build -o bin/ ./...
    @echo "Preflight complete!"

clean:
    rm -rf bin/
    go clean -cache

# === Project Specific ===

deps:
    go mod download
    go mod tidy

lint:
    golangci-lint run

fmt:
    gofmt -w .

# Run with race detector
test-race:
    go test -race ./...

# Generate code (if applicable)
generate:
    go generate ./...
