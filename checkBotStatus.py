#!/usr/bin/python
import psutil
import subprocess
import time
def checkIfProcessRunning(processName):

#Iterate over the all the running process
    for proc in psutil.process_iter():
        try:
# Check if process name contains the given name string.
            if(len(proc.cmdline()) > 1):
                #print(proc.cmdline()[1]);
                if processName.lower() in proc.cmdline()[1].lower():
                    return True
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return False;

# Check if any chrome process was running or not.
while(True):
    if checkIfProcessRunning('bot.js'):
        print('Yes a bot process was running')
        time.sleep(60)
    else:
        print('No bot process was running')
        try:
            print("Going to start process.")
            subprocess.Popen(["node ~/Discord_Bot/bot.js"],shell = True)
            time.sleep(10);
        except:
            print("Didn't Start process.")
