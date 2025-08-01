# Vencord Scripts

This folder contains batch scripts for managing Vencord, a Discord client modification.

## Scripts Intendedness 
This script is intended for when Discord is updated, which forces the need to re-inject  Vencord.

This script makes it super easy to reapply vencord with just a click.

## Requirements

- Windows operating system
- Vencord (CLI version) downloaded on your computer
    - [Download the latest VencordInstallerCli.exe](https://github.com/Vencord/Installer/releases/latest/download/VencordInstallerCli.exe)
- Discord installed


### 1. `restart_vencord.bat`
A simple script that runs the Vencord installer from a fixed path.


**Features:**
- Direct execution of `VencordInstallerCli.exe`
- Requires manual path configuration

**Setup:**
1. Edit the script and replace `{USER}` with your actual username
2. Update the path to point to your VencordInstallerCli.exe location
3. Example: `C:\Users\YourName\Downloads\VencordInstallerCli.exe`

**Usage:**
Simply double-click the script to run it.

### 2. `restart_vencord_auto.bat` (Recommended)
A semi-intelligent script that automatically searches for the Vencord installer across multiple common locations.

**Features:**
- Automatically searches common directories for `VencordInstallerCli.exe`
- No manual path configuration required
- Searches in:
  - Desktop
  - Downloads
  - Documents
  - OneDrive
  - Custom Scripts folder
- Provides feedback on search progress
- Norwegian language interface

**Usage:**
1. Simply double-click the script
2. The script will search for VencordInstallerCli.exe automatically
3. If found, it will run the installer
4. If not found, it will display an error message

**Search Locations:**
- `%USERPROFILE%\Desktop`
- `%USERPROFILE%\Downloads`
- `%USERPROFILE%\Documents`
- `%USERPROFILE%\OneDrive`
- `%USERPROFILE%\AppData\Local\Programs\Vencord`
- `%USERPROFILE%\AppData\Roaming\Vencord`

## Which Script to Use?

- **Use `restart_vencord_auto.bat`** if you want a hassle-free experience that automatically finds the installer
- **Use `restart_vencord.bat`** if you prefer to specify the exact path or if the auto script doesn't find your installer

## Troubleshooting

If `restart_vencord_auto.bat` doesn't find your installer:
1. Check if VencordInstallerCli.exe is in one of the searched directories
2. Move the file to one of the searched locations, or
3. Use `restart_vencord.bat` with a manual path configuration