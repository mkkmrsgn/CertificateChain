@echo off
echo 💾 Starting MongoDB...
IF NOT EXIST "C:\data\db" (
  mkdir C:\data\db
)
start "" mongod --dbpath "C:\data\db"

timeout /t 2 >nul

echo ⚙ Starting Blockchain Node (Hardhat)...
start cmd /k "cd blockchain && npx hardhat node"

timeout /t 2 >nul

echo 🧠 Starting Backend Server...
start cmd /k "cd server && npx nodemon server.js"

timeout /t 2 >nul

echo 🌐 Starting Frontend React App...
start cmd /k "cd client && npm start"
