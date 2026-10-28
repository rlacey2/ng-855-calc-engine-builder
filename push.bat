@echo off
git add .
git commit -m "Update: %date% %time%"
git push -f origin main
