#!/bin/bash

# Medical Research AI Assistant
# Complete Startup Script

echo ""
echo "=============================================="
echo " Medical Research AI Assistant"
echo " Starting Development Environment"
echo "=============================================="
echo ""

###############################################
# Check Python
###############################################

if ! command -v python &> /dev/null
then
    echo "Python is not installed."
    exit 1
fi

###############################################
# Check Node
###############################################

if ! command -v npm &> /dev/null
then
    echo "Node.js is not installed."
    exit 1
fi

###############################################
# Activate Virtual Environment
###############################################

echo "Activating Virtual Environment..."

source .venv/bin/activate

###############################################
# Check Environment File
###############################################

if [ ! -f ".env" ]; then
    echo ".env file not found."
    exit 1
fi

###############################################
# Start Backend
###############################################

echo ""
echo "Starting FastAPI Backend..."

cd backend || exit

uvicorn app:app --reload &

BACKEND_PID=$!

cd ..

sleep 5

###############################################
# Start Frontend
###############################################

echo ""
echo "Starting React Frontend..."

cd frontend || exit

npm run dev &

FRONTEND_PID=$!

cd ..

echo ""
echo "=============================================="

echo "Backend Running"

echo "PID : $BACKEND_PID"

echo ""

echo "Frontend Running"

echo "PID : $FRONTEND_PID"

echo ""

echo "=============================================="

wait