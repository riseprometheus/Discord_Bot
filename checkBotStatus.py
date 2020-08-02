#!/usr/bin/python
import psutil
import subprocess
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
if checkIfProcessRunning('bot.js'):
    print('Yes a bot process was running') 
else:
    print('No bot process was running')
    try:
        print("Going to start process.")
        subprocess.Popen(["node /home/chris/Discord_Bot/bot.js"],shell = True)
    except:
        print("Didn't Start process.")
