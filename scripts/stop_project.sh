#!/bin/bash

echo "Stopping Project..."

pkill -f uvicorn

pkill -f vite

pkill -f npm

echo "Project stopped."