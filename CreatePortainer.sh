#!/bin/bash
#
# Loob uue konteineri Portainerile ja käivitab selle
#
# käivitamine: sudo bash RunPortainer.sh
#
# Portaineri UI ava sirvikus, port 9000 (http)
#
# Portaineri seistamine: docker stop portainer
#
# taaskäivitamine: docker start portainer

docker run \
  --name portainer\
  --detach \
  --publish 9000:9000 \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  portainer/portainer
