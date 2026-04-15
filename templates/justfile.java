# {{PROJECT_NAME}} - {{PROJECT_DESCRIPTION}}
# Java application (Gradle)

default:
    @just --list

# === Standard Vocabulary ===

build:
    ./gradlew build

test:
    ./gradlew test

dev:
    ./gradlew bootRun

preflight:
    @echo "Running preflight checks..."
    ./gradlew check
    ./gradlew build
    @echo "Preflight complete!"

clean:
    ./gradlew clean
    rm -rf build/

# === Project Specific ===

deps:
    ./gradlew dependencies

lint:
    ./gradlew checkstyleMain checkstyleTest

fmt:
    ./gradlew spotlessApply

# Run with debug
debug:
    ./gradlew bootRun --debug-jvm

# Build fat jar
jar:
    ./gradlew bootJar
