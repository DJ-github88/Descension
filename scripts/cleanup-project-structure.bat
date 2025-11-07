@echo off
echo ========================================
echo  Project Structure Cleanup
echo ========================================
echo.
echo This script will clean up duplicate files,
echo obsolete documentation, and reorganize
echo the project structure.
echo.
echo WARNING: This will delete files!
echo Press Ctrl+C to cancel, or
pause

echo.
echo 1. Removing duplicate files...

REM Remove duplicate images from root (keep in public/)
if exist "Spellcard.png" (
    echo   - Removing duplicate Spellcard.png from root
    del "Spellcard.png"
)

if exist "Textures-16.png" (
    echo   - Removing duplicate Textures-16.png from root
    del "Textures-16.png"
)

echo 2. Removing redundant configuration files...

REM Remove duplicate netlify.toml from vtt-react (keep root one)
if exist "vtt-react\netlify.toml" (
    echo   - Removing duplicate netlify.toml from vtt-react
    del "vtt-react\netlify.toml"
)

REM Remove duplicate .eslintrc.js files (keep vtt-react one)
if exist ".eslintrc.js" (
    echo   - Removing duplicate .eslintrc.js from root
    del ".eslintrc.js"
)

echo 3. Organizing documentation...

REM Create docs directory if it doesn't exist
if not exist "docs" mkdir docs

REM Move documentation files to docs directory
for %%f in (*.md) do (
    if not "%%f"=="README.md" (
        echo   - Moving %%f to docs/
        move "%%f" "docs\"
    )
)

echo 4. Cleaning up obsolete files...

REM Remove config-overrides.js if it exists (using craco instead)
if exist "vtt-react\config-overrides.js" (
    echo   - Removing obsolete config-overrides.js
    del "vtt-react\config-overrides.js"
)

echo.
echo ========================================
echo  Project Structure Cleaned!
echo ========================================
echo.
echo Changes made:
echo - Removed duplicate image files from root
echo - Removed redundant configuration files
echo - Organized documentation in docs/ folder
echo - Removed obsolete configuration files
echo.
echo Your project structure is now cleaner and
echo more maintainable.
echo.
pause
