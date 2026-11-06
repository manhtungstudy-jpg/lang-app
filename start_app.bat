@echo off
echo ========================================================
echo   Uair amhain - Irish Learning App for Kids (16:9)
echo ========================================================
echo Dang khoi dong may chu noi bo...
start "" "http://localhost:8000"
python -m http.server 8000
pause
