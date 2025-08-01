@echo off
echo running: spicetify update
spicetify update

echo waiting for 3 seconds...
timeout /t 3 /nobreak >nul

echo running: spicetify restart
spicetify restart

exit
