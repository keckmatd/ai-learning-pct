.PHONY: help install dev build preview check format clean

help:
	@echo "Available targets:"
	@echo "  install   Install site dependencies (cd site && npm install)"
	@echo "  dev       Run Astro dev server"
	@echo "  build     Build the site for production"
	@echo "  preview   Preview the production build locally"
	@echo "  check     Run Astro type/content checks"
	@echo "  format    Format site sources with Prettier"
	@echo "  clean     Remove site build artifacts and node_modules"
	@echo "  help      Show this help message (default)"

install:
	cd site && npm install

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
