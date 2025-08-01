# WSL scripts
## stop_wsl.bat

A batch script to stop the Windows Subsystem for Linux (WSL).

### Script Contents
```batch
@echo off
echo Stopping WSL..
wsl --shutdown
echo WSL is now stopped.
pause
```

### Usage
1. Double-click `stop_wsl.bat` or run it from a command prompt
2. The script will:
   - Display a message indicating WSL is stopping
   - Execute `wsl --shutdown` to stop all running WSL instances
   - Confirm that WSL is now stopped
   - Wait for you to press any key before closing

### Requirements
- Windows 10 version 1903 or later with WSL installed
- Administrator privileges may be required depending on your system configuration

### Notes
- Stopping WSL will terminate all running Linux processes and instances
- Any unsaved work in WSL distributions will be lost
- WSL can be restarted by running any WSL command or launching a distribution
