@echo off
cd /d "C:\Users\carll\AuthFlow"
npm uninstall npm npx install --save
npm install
npx expo start --web --clear
pause
