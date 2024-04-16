# Makefile to build frontend, move files, and build backend

# Variables
FRONTEND_DIR := ./frontend
FRONTEND_SRC_DIR := $(FRONTEND_DIR)/src
FRONTEND_DIST_DIR := $(FRONTEND_DIR)/dist
BACKEND_DIR := ./backend
BACKEND_WWWROOT_DIR := $(BACKEND_DIR)/wwwroot

# Targets
.PHONY: all clean

all: frontend_watch backend_run

npm_install:
	cd $(FRONTEND_DIR) && npm install

frontend_build:
	mkdir -p $(FRONTEND_DIST_DIR)
	cp -r $(FRONTEND_SRC_DIR)/* $(FRONTEND_DIST_DIR)
	cd $(FRONTEND_SRC_DIR) && npm run build

backend_run:
	cd $(BACKEND_DIR) && dotnet run &

move_files:
	mkdir -p $(BACKEND_WWWROOT_DIR)
	cp -r $(FRONTEND_DIST_DIR)/* $(BACKEND_WWWROOT_DIR)

frontend_watch:
	nodemon --watch $(FRONTEND_SRC_DIR) --exec 'make move_files && make frontend_build' -e 'html css js'

clean:
	rm -rf $(BACKEND_WWWROOT_DIR)

