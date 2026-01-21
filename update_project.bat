@echo off
echo ========================================
echo   Hawash One Click - Auto Upload Tool
echo ========================================
echo.
echo Adding changes...
git add .
echo.
set /p commit_msg="Enter update description (Enter for default): "
if "%commit_msg%"=="" set commit_msg="Update by Hawash One Click Auto Tool"
echo.
echo Saving changes...
git commit -m "%commit_msg%"
echo.
echo Pushing to GitHub...
git push
echo.
echo ========================================
echo   Update Successful! 🎉
echo ========================================
echo.
pause
