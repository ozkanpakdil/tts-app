#!/bin/bash

# =============================================================================
# TTS-App Android Run Script (Linux)
# =============================================================================
# This script starts the Android emulator/device and runs the TTS-App.
#
# Prerequisites:
#   - Run ./scripts/setup-android.sh first
#   - Android Emulator running or Physical Device connected via ADB
#
# Usage:
#   ./scripts/run-android.sh                # Run on default device/emulator
#   ./scripts/run-android.sh --list         # List connected devices
#   ./scripts/run-android.sh --device ID    # Run on specific device ID
#   ./scripts/run-android.sh --release      # Build and run in release mode
#
# Options:
#   --list              List all connected Android devices/emulators
#   --device ID         Specify the device/emulator by ID (from adb devices)
#   --release           Build and run in release mode
#   --help              Show this help message
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

# Default values
DEVICE_ID=""
RELEASE_MODE=false
LIST_DEVICES=false

# -----------------------------------------------------------------------------
# Parse Arguments
# -----------------------------------------------------------------------------

show_help() {
    echo -e "${BLUE}TTS-App Android Run Script${NC}"
    echo ""
    echo "Usage: ./scripts/run-android.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --list              List all connected Android devices/emulators"
    echo "  --device ID         Specify the device/emulator by ID"
    echo "  --release           Build and run in release mode"
    echo "  --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/run-android.sh                        # Run on default device"
    echo "  ./scripts/run-android.sh --list                 # List connected devices"
    echo "  ./scripts/run-android.sh --device emulator-5554 # Run on specific emulator"
    echo ""
}

while [[ $# -gt 0 ]]; do
    case $1 in
        --list)
            LIST_DEVICES=true
            shift
            ;;
        --device)
            DEVICE_ID="$2"
            shift 2
            ;;
        --release)
            RELEASE_MODE=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# -----------------------------------------------------------------------------
# List Devices
# -----------------------------------------------------------------------------

if [ "$LIST_DEVICES" = true ]; then
    echo -e "${BLUE}==============================================================================${NC}"
    echo -e "${BLUE}                    Connected Android Devices                                ${NC}"
    echo -e "${BLUE}==============================================================================${NC}"
    echo ""
    adb devices -l
    echo ""
    echo -e "${YELLOW}Usage: ./scripts/run-android.sh --device <device id>${NC}"
    echo ""
    exit 0
fi

# -----------------------------------------------------------------------------
# Pre-flight Checks
# -----------------------------------------------------------------------------

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                    TTS-App Android Runner                                   ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""

# Check if mobile directory exists
if [ ! -d "$MOBILE_DIR" ]; then
    echo -e "${RED}Error: Mobile directory not found at $MOBILE_DIR${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "$MOBILE_DIR/node_modules" ]; then
    echo -e "${RED}Error: Node modules not installed.${NC}"
    echo -e "${YELLOW}Please run ./scripts/setup-android.sh first.${NC}"
    exit 1
fi

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo -e "${RED}Error: adb (Android Debug Bridge) not found in PATH.${NC}"
    echo -e "${YELLOW}Please ensure Android SDK Platform-Tools are installed and in your PATH.${NC}"
    exit 1
fi

# Check if any device is connected
DEVICE_COUNT=$(adb devices | grep -v "List of devices" | grep "device" | wc -l)
if [ "$DEVICE_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}Warning: No Android devices or emulators detected.${NC}"
    echo -e "${YELLOW}Please start an emulator or connect a physical device via ADB.${NC}"
    echo ""
fi

echo -e "${GREEN}✓ Environment check complete${NC}"
echo ""

# -----------------------------------------------------------------------------
# Build Run Command
# -----------------------------------------------------------------------------

cd "$MOBILE_DIR"

# Build the react-native run-android command
RUN_CMD="npx react-native run-android"

if [ -n "$DEVICE_ID" ]; then
    RUN_CMD="$RUN_CMD --deviceId=\"$DEVICE_ID\""
    echo -e "${YELLOW}Targeting device: $DEVICE_ID${NC}"
else
    echo -e "${YELLOW}Targeting default device/emulator${NC}"
fi

if [ "$RELEASE_MODE" = true ]; then
    RUN_CMD="$RUN_CMD --mode=release"
    echo -e "${YELLOW}Building in Release mode${NC}"
else
    echo -e "${YELLOW}Building in Debug mode${NC}"
fi

echo ""
echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                    Starting Android Build & Run                             ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""
echo -e "${YELLOW}This will:${NC}"
echo -e "  1. Start the Metro bundler (if not running)"
echo -e "  2. Build the Android app"
echo -e "  3. Install and run the app on the target device"
echo ""
echo -e "${YELLOW}Running: $RUN_CMD${NC}"
echo ""

# -----------------------------------------------------------------------------
# Run the App
# -----------------------------------------------------------------------------

# Set up port reverse so the app can connect to the Metro bundler
echo -e "${YELLOW}Setting up port reverse...${NC}"
adb reverse tcp:8081 tcp:8081

# Build and install the app
# Use --no-packager because we will start it explicitly afterwards to keep the terminal interactive
RUN_CMD="$RUN_CMD --no-packager"

echo -e "${YELLOW}Building and installing the app...${NC}"
eval $RUN_CMD

echo ""
echo -e "${GREEN}==============================================================================${NC}"
echo -e "${GREEN}                    App Launch Initiated!                                   ${NC}"
echo -e "${GREEN}==============================================================================${NC}"
echo ""

echo -e "${BLUE}Starting Metro bundler to keep this session interactive...${NC}"
echo -e "${YELLOW}Tips:${NC}"
echo -e "  - Press ${YELLOW}r${NC} to reload the app"
echo -e "  - Press ${YELLOW}d${NC} to open the developer menu"
echo -e "  - Press ${YELLOW}Ctrl + C${NC} to stop"
echo ""

# Use 'react-native start' to keep the terminal open and interactive
npx react-native start
