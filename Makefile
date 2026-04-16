.PHONY: help install dev build preview check format clean

INTERNAL_REGISTRY ?= https://art.nwie.net/artifactory/api/npm/npm/
PROBE_TIMEOUT ?= 3

help:
	@echo "Available targets:"
	@echo "  install   Install site dependencies (auto-detects internal mirror)"
	@echo "  dev       Run Astro dev server"
	@echo "  build     Build the site for production"
	@echo "  preview   Preview the production build locally"
	@echo "  check     Run Astro type/content checks"
	@echo "  format    Format site sources with Prettier"
	@echo "  clean     Remove site build artifacts and node_modules"
	@echo "  help      Show this help message (default)"
	@echo ""
	@echo "Env overrides:"
	@echo "  NPM_REGISTRY       Force a registry URL (skips auto-detection)"
	@echo "  INTERNAL_REGISTRY  Internal mirror to probe (default: $(INTERNAL_REGISTRY))"
	@echo "  PROBE_TIMEOUT      Probe timeout in seconds (default: $(PROBE_TIMEOUT))"

install:
	@if [ -n "$$NPM_REGISTRY" ]; then \
		echo "Using NPM_REGISTRY override: $$NPM_REGISTRY"; \
		cd site && npm install --registry="$$NPM_REGISTRY" --replace-registry-host=always; \
	elif curl -fsS --max-time $(PROBE_TIMEOUT) -o /dev/null "$(INTERNAL_REGISTRY)"; then \
		echo "Internal mirror reachable — using $(INTERNAL_REGISTRY)"; \
		cd site && npm install --registry="$(INTERNAL_REGISTRY)" --replace-registry-host=always; \
	else \
		echo "Internal mirror unreachable — using public registry"; \
		cd site && npm install; \
	fi

dev:
	cd site && npm run dev

build:
	cd site && npm run build

preview:
	cd site && npm run preview

check:
	cd site && npm run check

format:
	cd site && npm run format

clean:
	rm -rf site/dist site/.astro site/node_modules
