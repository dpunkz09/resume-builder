@echo off
echo Clearing Next.js cache and rebuilding...
echo.

echo Step 1: Removing .next folder...
rmdir /s /q .next 2>nul
if exist .next (
    echo Warning: Could not delete .next folder. Please close any applications using it.
    pause
) else (
    echo ✓ .next folder cleared
)

echo.
echo Step 2: Building application...
call npm run build

echo.
echo Build complete!
pause
