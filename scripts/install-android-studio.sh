#!/bin/bash

# =============================================================================
# TTS-App Android Studio Installer (Linux)
# =============================================================================
# This script automates the installation of Android Studio on Linux.
#
# It will:
#   1. Check for required dependencies (Java JDK 17).
#   2. Download the latest Android Studio for Linux.
#   3. Extract it to ~/android-studio.
#   4. Provide instructions for initial setup and environment variables.
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

INSTALL_DIR="$HOME/android-studio"
SDK_DIR="$HOME/Android/Sdk"
DOWNLOAD_URL="https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2025.2.2.8/android-studio-2025.2.2.8-linux.tar.gz"
TEMP_FILE="/tmp/android-studio.tar.gz"

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                Android Studio Installer for Linux                           ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""

# Check if running on Linux
if [[ "$(uname)" != "Linux" ]]; then
    echo -e "${RED}Error: This script is intended for Linux systems.${NC}"
    exit 1
fi

# Check for Java JDK 17
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java is not installed. Please install JDK 17 before proceeding.${NC}"
    echo -e "${YELLOW}Suggested command: sudo apt update && sudo apt install openjdk-17-jdk${NC}"
    exit 1
fi

# Check if already installed
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}Android Studio appears to be already installed at $INSTALL_DIR.${NC}"
    read -p "Do you want to reinstall it? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi
fi

# Download Android Studio
echo -e "${YELLOW}Downloading Android Studio...${NC}"
echo -e "${BLUE}From: $DOWNLOAD_URL${NC}"
if command -v curl &> /dev/null; then
    curl -L "$DOWNLOAD_URL" -o "$TEMP_FILE"
elif command -v wget &> /dev/null; then
    wget -O "$TEMP_FILE" "$DOWNLOAD_URL"
else
    echo -e "${RED}Error: Neither curl nor wget found. Please install one to download Android Studio.${NC}"
    exit 1
fi

# Extract
echo -e "${YELLOW}Extracting to $HOME...${NC}"
mkdir -p "$HOME"
tar -xzf "$TEMP_FILE" -C "$HOME"
rm "$TEMP_FILE"

echo -e "${GREEN}✓ Android Studio extracted to $INSTALL_DIR${NC}"
echo ""

# Instructions
echo -e "${BLUE}==============================================================================${NC}"
echo -e "${GREEN}                Installation Successful!                                     ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""
echo -e "To complete the setup, please follow these steps:"
echo ""
echo -e "1. ${YELLOW}Launch Android Studio${NC} to install the SDK and build tools:"
echo -e "   ${BLUE}$INSTALL_DIR/bin/studio.sh${NC}"
echo ""
echo -e "2. ${YELLOW}Complete the Setup Wizard${NC} in Android Studio."
echo -e "   Ensure you install 'Android SDK', 'Android SDK Platform-Tools', and a System Image for the emulator."
echo ""
echo -e "3. ${YELLOW}Configure Environment Variables${NC}."
echo -e "   Add the following lines to your ${BLUE}~/.bashrc${NC} or ${BLUE}~/.zshrc${NC}:"
echo ""
echo -e "${CYAN}   export ANDROID_HOME=\$HOME/Android/Sdk${NC}"
echo -e "${CYAN}   export PATH=\$PATH:\$ANDROID_HOME/emulator${NC}"
echo -e "${CYAN}   export PATH=\$PATH:\$ANDROID_HOME/platform-tools${NC}"
echo ""
echo -e "4. ${YELLOW}Reload your configuration${NC}:"
echo -e "   ${BLUE}source ~/.bashrc${NC} (or ~/.zshrc)"
echo ""
echo -e "5. ${YELLOW}Run the setup script again${NC}:"
echo -e "   ${BLUE}./scripts/setup-android.sh${NC}"
echo ""
echo -e "${BLUE}==============================================================================${NC}"
