@echo off
echo Starting Damage Detection Microservice...
echo Port: 5001
echo using virtual environment: damage_env

call damage_env\Scripts\activate
python pycharm_damage_service.py
pause
