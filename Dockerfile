FROM python:3.5.1
MAINTAINER Jeremy Nelson <jermnelson@gmail.com>

ENV CCETD_GIT https://github.com/Tutt-Library/ccetd.git
ENV CCETD_HOME /opt/ccetd
ENV CCETD_CONF instance/conf.py

RUN apt-get update && apt-get install -y && \
  apt-get install -y python3-setuptools && \
  apt-get install -y python3-pip

RUN git clone $CCETD_GIT $CCETD_HOME && \
  cd $CCETD_HOME && \
  mkdir instance && \
  pip3 install -r requirements.txt
  
COPY $CCETD_CONF $CCETD_HOME/instance/conf.py
WORKDIR $CCETD_HOME
EXPOSE 5000

CMD ["python", "run.py"]
