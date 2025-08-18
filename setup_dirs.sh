#!/bin/bash
# This script creates required upload directories and sets permissions, using paths relative to the script location.

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create uploads/modules directory relative to the project root
mkdir -p "$SCRIPT_DIR/uploads/modules"

# Set ownership and permissions (update 'ubuntu:devs' as needed for your environment)
chown -R ubuntu:devs "$SCRIPT_DIR/uploads"
chmod -R 775 "$SCRIPT_DIR/uploads"
