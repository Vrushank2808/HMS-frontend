@echo off
echo Initializing HMS Frontend Repository...

REM Initialize git repository
git init

REM Add all files
git add .

REM Create initial commit
git commit -m "Initial commit: HMS Frontend with Admin Dashboard and Password Reset Manager"

REM Add remote origin (replace with your actual repository URL)
echo.
echo Next steps:
echo 1. Create a new repository on GitHub named 'hms-frontend'
echo 2. Run: git remote add origin https://github.com/yourusername/hms-frontend.git
echo 3. Run: git branch -M main
echo 4. Run: git push -u origin main

pause