#!/bin/bash

echo "Installing Backend Dependencies..."

pip install -r requirements.txt

echo ""

echo "Installing Frontend Dependencies..."

cd frontend || exit

npm install

cd ..

echo ""

echo "Installation Complete."