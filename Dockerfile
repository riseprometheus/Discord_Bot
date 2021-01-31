From node:12.20.1
RUN mkdir ~/Discord_Bot
copy . ~/Discord_Bot
WORKDIR ~/Discord_Bot

CMD["python","checkBotStatus.py"]
