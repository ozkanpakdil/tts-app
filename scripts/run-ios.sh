#!/bin/bash

# =============================================================================
# TTS-App iOS Run Script
# =============================================================================
# This script starts the iOS Simulator and runs the TTS-App.
#
# Prerequisites:
#   - Run ./scripts/setup-ios.sh first (or ensure dependencies are installed)
#   - macOS with Xcode installed
#
# Usage:
#   ./scripts/run-ios.sh                    # Run on default simulator
#   ./scripts/run-ios.sh --list             # List available simulators
#   ./scripts/run-ios.sh --simulator "iPhone 15"  # Run on specific simulator
#
# Options:
#   --list              List all available iOS simulators
#   --simulator NAME    Specify the simulator to use (e.g., "iPhone 15")
#   --device ID         Specify the simulator by device ID
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
SIMULATOR_NAME=""
DEVICE_ID=""
RELEASE_MODE=false
LIST_SIMULATORS=false

# -----------------------------------------------------------------------------
# Parse Arguments
# -----------------------------------------------------------------------------

show_help() {
    echo -e "${BLUE}TTS-App iOS Run Script${NC}"
    echo ""
    echo "Usage: ./scripts/run-ios.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --list              List all available iOS simulators"
    echo "  --simulator NAME    Specify the simulator to use (e.g., \"iPhone 15\")"
    echo "  --device ID         Specify the simulator by device ID"
    echo "  --release           Build and run in release mode"
    echo "  --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/run-ios.sh                           # Run on default simulator"
    echo "  ./scripts/run-ios.sh --list                    # List available simulators"
    echo "  ./scripts/run-ios.sh --simulator \"iPhone 15\"   # Run on iPhone 15"
    echo "  ./scripts/run-ios.sh --simulator \"iPhone 15 Pro Max\"  # Run on iPhone 15 Pro Max"
    echo ""
}

while [[ $# -gt 0 ]]; do
    case $1 in
        --list)
            LIST_SIMULATORS=true
            shift
            ;;
        --simulator)
            SIMULATOR_NAME="$2"
            shift 2
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
# List Simulators
# -----------------------------------------------------------------------------

if [ "$LIST_SIMULATORS" = true ]; then
    echo -e "${BLUE}==============================================================================${NC}"
    echo -e "${BLUE}                    Available iOS Simulators                                 ${NC}"
    echo -e "${BLUE}==============================================================================${NC}"
    echo ""
    xcrun simctl list devices available | grep -E "iPhone|iPad"
    echo ""
    echo -e "${YELLOW}Usage: ./scripts/run-ios.sh --simulator \"<simulator name>\"${NC}"
    echo ""
    exit 0
fi

# -----------------------------------------------------------------------------
# Pre-flight Checks
# -----------------------------------------------------------------------------

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                    TTS-App iOS Runner                                       ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""

# Check if running on macOS
if [[ "$(uname)" != "Darwin" ]]; then
    echo -e "${RED}Error: This script requires macOS to run iOS Simulator.${NC}"
    exit 1
fi

# Check if mobile directory exists
if [ ! -d "$MOBILE_DIR" ]; then
    echo -e "${RED}Error: Mobile directory not found at $MOBILE_DIR${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "$MOBILE_DIR/node_modules" ]; then
    echo -e "${RED}Error: Node modules not installed.${NC}"
    echo -e "${YELLOW}Please run ./scripts/setup-ios.sh first.${NC}"
    exit 1
fi

# Check if Pods are installed
if [ ! -d "$MOBILE_DIR/ios/Pods" ]; then
    echo -e "${RED}Error: CocoaPods dependencies not installed.${NC}"
    echo -e "${YELLOW}Please run ./scripts/setup-ios.sh first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All dependencies are installed${NC}"
echo ""

# -----------------------------------------------------------------------------
# Build Run Command
# -----------------------------------------------------------------------------

cd "$MOBILE_DIR"

# Build the react-native run-ios command
RUN_CMD="npx react-native run-ios"

if [ -n "$SIMULATOR_NAME" ]; then
    RUN_CMD="$RUN_CMD --simulator=\"$SIMULATOR_NAME\""
    echo -e "${YELLOW}Using simulator: $SIMULATOR_NAME${NC}"
elif [ -n "$DEVICE_ID" ]; then
    RUN_CMD="$RUN_CMD --udid=\"$DEVICE_ID\""
    echo -e "${YELLOW}Using device ID: $DEVICE_ID${NC}"
else
    echo -e "${YELLOW}Using default simulator${NC}"
fi

if [ "$RELEASE_MODE" = true ]; then
    RUN_CMD="$RUN_CMD --mode=Release"
    echo -e "${YELLOW}Building in Release mode${NC}"
else
    echo -e "${YELLOW}Building in Debug mode${NC}"
fi

echo ""
echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                    Starting iOS Simulator                                   ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""
echo -e "${YELLOW}This will:${NC}"
echo -e "  1. Start the Metro bundler (JavaScript bundler)"
echo -e "  2. Build the iOS app"
echo -e "  3. Launch the iOS Simulator"
echo -e "  4. Install and run the app"
echo ""
echo -e "${YELLOW}Running: $RUN_CMD${NC}"
echo ""

# -----------------------------------------------------------------------------
# Run the App
# -----------------------------------------------------------------------------

eval $RUN_CMD

echo ""
echo -e "${GREEN}==============================================================================${NC}"
echo -e "${GREEN}                    App is running!                                         ${NC}"
echo -e "${GREEN}==============================================================================${NC}"
echo ""
echo -e "Tips:"
echo -e "  - Press ${YELLOW}r${NC} in the Metro terminal to reload the app"
echo -e "  - Press ${YELLOW}d${NC} to open the developer menu"
echo -e "  - Press ${YELLOW}Cmd + D${NC} in the simulator to open developer menu"
echo -e "  - Press ${YELLOW}Ctrl + C${NC} to stop the Metro bundler"
echo ""
