# Spicetify Scripts

This folder contains batch scripts for managing Spicetify, a command-line tool for customizing Spotify.

## Scripts Intendedness
This script is intended for when Spotify is updated, which forces the need to re-inject Spicetify.

This makes it super easy to reapply Spicetify with just a click.

## Requirements

- **Spicetify CLI** must be installed and accessible from command line
    - [Guide for downloading Spicetify CLI](https://spicetify.app/docs/getting-started)
- **Spotify** must be installed
- **Windows** operating system
- Spicetify should be properly configured before running
### `restart_spicetify.bat`
A utility script that updates and restarts Spicetify in a single operation.

**What it does:**
1. **Updates Spicetify** - Runs `spicetify update` to ensure you have the latest version
2. **Waits 3 seconds** - Provides a brief pause for the update to complete
3. **Restarts Spicetify** - Runs `spicetify restart` to apply changes and reload Spotify

**Features:**
- Combines two common Spicetify commands into one convenient script
- Includes a safety delay between operations
- Automatically exits when complete
- Provides clear console output showing each step

**Usage:**
1. Ensure Spicetify is installed and configured on your system
2. Double-click `restart_spicetify.bat` to run the script
3. The script will automatically update and restart Spicetify

**When to use this script:**
- After making changes to Spicetify themes or extensions
- When you want to ensure you're running the latest version
- To quickly refresh Spotify with current Spicetify settings
- As part of regular maintenance routine


## Troubleshooting

**If the script fails:**
1. Verify Spicetify is installed: Open Command Prompt and type `spicetify --version`
2. Check that Spotify is not running before executing the script
3. Ensure you have proper permissions to modify Spotify files
4. Try running the script as Administrator if permission issues occur

**Common Issues:**
- **"spicetify is not recognized"**: Spicetify is not installed or not in PATH
- **Permission errors**: Run as Administrator or check Spotify installation permissions
- **Spotify won't start**: Ensure Spotify is properly configured with Spicetify

## Related Commands

If you need to run commands individually:
```batch
spicetify update          # Update Spicetify
spicetify restart         # Restart Spicetify
spicetify apply           # Apply current theme
spicetify backup apply    # Backup and apply
```