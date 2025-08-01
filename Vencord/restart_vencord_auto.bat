@echo off
setlocal

:: Sett brukermappen din
set "userDir=%USERPROFILE%"

:: Sett mapper vi vil søke i
set "searchDirs=%userDir%\Desktop %userDir%\Downloads %userDir%\Documents %userDir%\OneDrive %userDir%\AppData\Local\Programs\Vencord %userDir%\AppData\Roaming\Vencord"

:: Sett tom variabel
set "foundFile="

:: For hver mappe, søk etter VencordInstallerCli.exe
for %%D in (%searchDirs%) do (
    if exist "%%D" (
        echo Søker i %%D ...
        call :findIn "%%D"
        if defined foundFile goto :found
    )
)

echo ❌ Fant ikke VencordInstallerCli.exe.
pause
exit /b

:: Subrutine for å finne fil
:findIn
setlocal
for /r %~1 %%F in (VencordInstallerCli.exe) do (
    endlocal
    set "foundFile=%%F"
    goto :eof
)
endlocal
goto :eof

:found
echo ✅ Fant: "%foundFile%"
cd /d "%~dp0"
"%foundFile%"
pause
