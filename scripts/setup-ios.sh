#!/bin/bash

# =============================================================================
# TTS-App iOS Setup Script
# =============================================================================
# This script sets up the development environment for running the TTS-App
# on the iOS Simulator.
#
# Prerequisites:
#   - macOS
#   - Xcode 14+ installed (with Command Line Tools)
#   - Node.js 20+ installed
#   - CocoaPods installed (will attempt to install if missing)
#
# Usage:
#   ./scripts/setup-ios.sh
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MOBILE_DIR="$PROJECT_ROOT/mobile"

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                    TTS-App iOS Development Setup                            ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""

# -----------------------------------------------------------------------------
# Check Prerequisites
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check if running on macOS
if [[ "$(uname)" != "Darwin" ]]; then
    echo -e "${RED}Error: This script requires macOS to run iOS Simulator.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Running on macOS${NC}"

# Check for Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}Error: Xcode is not installed. Please install Xcode from the App Store.${NC}"
    exit 1
fi
XCODE_VERSION=$(xcodebuild -version | head -n 1)
echo -e "${GREEN}✓ $XCODE_VERSION${NC}"

# Check for Xcode Command Line Tools
if ! xcode-select -p &> /dev/null; then
    echo -e "${YELLOW}Installing Xcode Command Line Tools...${NC}"
    xcode-select --install
    echo -e "${YELLOW}Please complete the installation and run this script again.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Xcode Command Line Tools installed${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js 20+.${NC}"
    echo -e "${YELLOW}You can install it via:${NC}"
    echo -e "  - Homebrew: brew install node"
    echo -e "  - nvm: nvm install 20"
    echo -e "  - Download: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"

# Check Node.js version (must be 20+)
NODE_MAJOR_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_MAJOR_VERSION" -lt 20 ]; then
    echo -e "${RED}Error: Node.js version 20+ is required. Current version: $NODE_VERSION${NC}"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed.${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm $NPM_VERSION${NC}"

# Check for CocoaPods (install if missing)
if ! command -v pod &> /dev/null; then
    echo -e "${YELLOW}CocoaPods not found. Installing...${NC}"
    sudo gem install cocoapods
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to install CocoaPods.${NC}"
        echo -e "${YELLOW}Try installing manually: sudo gem install cocoapods${NC}"
        exit 1
    fi
fi
POD_VERSION=$(pod --version)
echo -e "${GREEN}✓ CocoaPods $POD_VERSION${NC}"

echo ""
echo -e "${YELLOW}All prerequisites satisfied!${NC}"
echo ""

# -----------------------------------------------------------------------------
# Install Dependencies
# -----------------------------------------------------------------------------

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                    Installing Dependencies                                  ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""

# Navigate to mobile directory
cd "$MOBILE_DIR"

# Install Node.js dependencies
echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Node.js dependencies installed${NC}"
else
    echo -e "${RED}Error: Failed to install Node.js dependencies${NC}"
    exit 1
fi

echo ""

# Install CocoaPods dependencies
echo -e "${YELLOW}Installing CocoaPods dependencies...${NC}"
cd ios
pod install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ CocoaPods dependencies installed${NC}"
else
    echo -e "${RED}Error: Failed to install CocoaPods dependencies${NC}"
    echo -e "${YELLOW}Try running: cd mobile/ios && pod install --repo-update${NC}"
    exit 1
fi

cd "$PROJECT_ROOT"

echo ""
echo -e "${BLUE}==============================================================================${NC}"
echo -e "${GREEN}                    Setup Complete!                                         ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""
echo -e "You can now run the iOS app using:"
echo -e "  ${YELLOW}./scripts/run-ios.sh${NC}"
echo ""
echo -e "Or manually:"
echo -e "  ${YELLOW}cd mobile && npm run ios${NC}"
echo ""
