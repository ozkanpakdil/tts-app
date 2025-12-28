#!/bin/bash

# =============================================================================
# TTS-App Android Setup Script (Linux)
# =============================================================================
# This script sets up the development environment for running the TTS-App
# on Android (Emulator or Physical Device).
#
# Prerequisites:
#   - Linux (tested on Debian/Ubuntu)
#   - Node.js 20+ installed
#   - Java JDK 17 installed
#   - Android SDK installed and ANDROID_HOME set
#
# Usage:
#   ./scripts/setup-android.sh
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
echo -e "${BLUE}                    TTS-App Android Development Setup                        ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""

# -----------------------------------------------------------------------------
# Check Prerequisites
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check if running on Linux
if [[ "$(uname)" != "Linux" ]]; then
    echo -e "${YELLOW}Warning: This script is designed for Linux. You are on $(uname).${NC}"
    echo -e "${YELLOW}Proceeding anyway, but some commands might differ.${NC}"
fi
echo -e "${GREEN}✓ Operating System: $(uname)${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js 20+.${NC}"
    echo -e "${YELLOW}You can install it via:${NC}"
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

# Check for Java JDK 17
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java is not installed. Please install JDK 17.${NC}"
    exit 1
fi
JAVA_VERSION=$(java -version 2>&1 | head -n 1)
echo -e "${GREEN}✓ $JAVA_VERSION${NC}"

# Check for ANDROID_HOME
if [ -z "$ANDROID_HOME" ]; then
    echo -e "${RED}Error: ANDROID_HOME environment variable is not set.${NC}"
    echo -e "${YELLOW}Would you like to install Android Studio? (y/N)${NC}"
    read -p "" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./scripts/install-android-studio.sh
        exit 0
    else
        echo -e "${YELLOW}Please set it in your .bashrc or .zshrc file, for example:${NC}"
        echo -e "  export ANDROID_HOME=\$HOME/Android/Sdk"
        echo -e "  export PATH=\$PATH:\$ANDROID_HOME/emulator"
        echo -e "  export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
        exit 1
    fi
fi
echo -e "${GREEN}✓ ANDROID_HOME is set to: $ANDROID_HOME${NC}"

# Check for Android SDK components
if [ ! -d "$ANDROID_HOME/platform-tools" ]; then
    echo -e "${RED}Error: Android Platform Tools not found in $ANDROID_HOME/platform-tools${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Android Platform Tools found${NC}"

echo ""
echo -e "${YELLOW}All system prerequisites satisfied!${NC}"
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

# Ensure gradlew is executable
echo -e "${YELLOW}Setting permissions for gradlew...${NC}"
chmod +x android/gradlew
echo -e "${GREEN}✓ gradlew is now executable${NC}"

cd "$PROJECT_ROOT"

echo ""
echo -e "${BLUE}==============================================================================${NC}"
echo -e "${GREEN}                    Setup Complete!                                         ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""
echo -e "You can now run the Android app using:"
echo -e "  ${YELLOW}./scripts/run-android.sh${NC}"
echo ""
echo -e "Or manually:"
echo -e "  ${YELLOW}cd mobile && npm run android${NC}"
echo ""
