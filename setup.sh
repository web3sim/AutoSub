#!/bin/bash

# AutoSub Project Setup Script
echo "🚀 Setting up AutoSub project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! npx semver-compare $NODE_VERSION $REQUIRED_VERSION &> /dev/null; then
    print_warning "Node.js version $NODE_VERSION detected. Version 18+ is recommended."
fi

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    print_error "Yarn is not installed. Please install Yarn and try again."
    echo "Install with: npm install -g yarn"
    exit 1
fi

print_success "Node.js and Yarn are installed"

# Install dependencies
print_status "Installing dependencies..."
yarn install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_success "Dependencies installed"

# Setup environment files
print_status "Setting up environment files..."

# Copy .env.example to .env in frontend
if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    print_success "Created frontend/.env from .env.example"
else
    print_warning "frontend/.env already exists, skipping copy"
fi

# Build contracts
print_status "Building smart contracts..."
cd contracts
yarn build

if [ $? -ne 0 ]; then
    print_error "Failed to build smart contracts"
    exit 1
fi

cd ..
print_success "Smart contracts built successfully"

# Display setup completion
echo ""
echo "✅ AutoSub setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your environment:"
echo "   - Edit frontend/.env with your Massa node URL and private key"
echo "   - Set VITE_MASSA_PUBLIC_API_URL (default: https://test.massa.net/api/v2)"
echo "   - Set VITE_MASSA_PRIVATE_KEY with your wallet private key"
echo ""
echo "2. Deploy the smart contract:"
echo "   yarn deploy"
echo ""
echo "3. Start the frontend development server:"
echo "   yarn dev:frontend"
echo ""
echo "📚 Available commands:"
echo "   yarn build              - Build contracts and frontend"
echo "   yarn build:contracts    - Build smart contracts only"
echo "   yarn build:frontend     - Build frontend only"
echo "   yarn dev:frontend       - Start frontend dev server"
echo "   yarn deploy             - Deploy smart contract"
echo "   yarn clean              - Clean build artifacts"
echo "   yarn lint               - Lint frontend code"
echo ""
echo "🔗 Useful links:"
echo "   - Massa Documentation: https://docs.massa.net/"
echo "   - GitHub Repository: https://github.com/your-username/AutoSub"
echo ""
echo "Happy building! 🎉"
