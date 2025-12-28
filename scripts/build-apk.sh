#!/bin/bash

# =============================================================================
# TTS-App Android APK Builder Script
# =============================================================================
# This script builds a debug or release APK for the TTS-App.
#
# Prerequisites:
#   - Run ./scripts/setup-android.sh first
#   - Java JDK 17
#   - Android SDK
#
# Usage:
#   ./scripts/build-apk.sh                  # Build debug APK (default)
#   ./scripts/build-apk.sh --release        # Build release APK
#   ./scripts/build-apk.sh --clean          # Clean and build debug APK
#
# Options:
#   --release           Build a release APK (unsigned unless configured)
#   --clean             Clean the build directory before building
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
ANDROID_DIR="$MOBILE_DIR/android"

# Default values
BUILD_TYPE="debug"
CLEAN_BUILD=false

# -----------------------------------------------------------------------------
# Parse Arguments
# -----------------------------------------------------------------------------

show_help() {
    echo -e "${BLUE}TTS-App Android APK Builder${NC}"
    echo ""
    echo "Usage: ./scripts/build-apk.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --release           Build a release APK"
    echo "  --clean             Clean the build directory before building"
    echo "  --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/build-apk.sh                      # Build debug APK"
    echo "  ./scripts/build-apk.sh --release            # Build release APK"
    echo "  ./scripts/build-apk.sh --clean --release    # Clean and build release APK"
    echo ""
}

while [[ $# -gt 0 ]]; do
    case $1 in
        --release)
            BUILD_TYPE="release"
            shift
            ;;
        --clean)
            CLEAN_BUILD=true
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
# Pre-flight Checks
# -----------------------------------------------------------------------------

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                    TTS-App APK Builder                                      ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""

# Check if android directory exists
if [ ! -d "$ANDROID_DIR" ]; then
    echo -e "${RED}Error: Android directory not found at $ANDROID_DIR${NC}"
    exit 1
fi

# Check if gradlew exists
if [ ! -f "$ANDROID_DIR/gradlew" ]; then
    echo -e "${RED}Error: gradlew not found in $ANDROID_DIR${NC}"
    echo -e "${YELLOW}Please run ./scripts/setup-android.sh first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment check complete${NC}"
echo ""

# -----------------------------------------------------------------------------
# Build Process
# -----------------------------------------------------------------------------

cd "$ANDROID_DIR"

if [ "$CLEAN_BUILD" = true ]; then
    echo -e "${YELLOW}Cleaning build directory...${NC}"
    ./gradlew clean
    echo -e "${GREEN}✓ Clean complete${NC}"
    echo ""
fi

if [ "$BUILD_TYPE" = "release" ]; then
    echo -e "${YELLOW}Building Release APK...${NC}"
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
else
    echo -e "${YELLOW}Building Debug APK...${NC}"
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}==============================================================================${NC}"
    echo -e "${GREEN}                    Build Successful!                                       ${NC}"
    echo -e "${GREEN}==============================================================================${NC}"
    echo ""
    echo -e "APK Location: ${YELLOW}$ANDROID_DIR/$APK_PATH${NC}"
    echo ""
    
    # Check if file actually exists
    if [ -f "$APK_PATH" ]; then
        echo -e "${GREEN}✓ APK file verified at location.${NC}"
    else
        echo -e "${RED}Warning: Build reported success but APK file not found at expected location:${NC}"
        echo -e "${RED}$ANDROID_DIR/$APK_PATH${NC}"
        echo -e "${YELLOW}Searching for any APK files...${NC}"
        find app/build/outputs/apk -name "*.apk"
    fi
else
    echo ""
    echo -e "${RED}==============================================================================${NC}"
    echo -e "${RED}                    Build Failed!                                           ${NC}"
    echo -e "${RED}==============================================================================${NC}"
    echo ""
    exit 1
fi

cd "$PROJECT_ROOT"
echo ""
