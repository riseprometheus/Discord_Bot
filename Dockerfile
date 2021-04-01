From node:12.20.1
RUN apt update
RUN apt install -y python-pip
RUN pip install psutil

copy . /app/Discord_Bot
WORKDIR /app/Discord_Bot

CMD ["python","checkBotStatus.py"]
