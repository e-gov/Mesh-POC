#!/bin/bash
# Mesh-POC teenuse Envoy konteinerihaldus
#
# Käivitamine:
# sudo bash ./Envoy.sh

echo "Mesh-POC teenuse Envoy konteinerihaldus"

# Valmista tõmmis
# docker build [OPTIONS] PATH
#
# Vaikimisi võetaks töökaustas olev fail nimega
# Dockerfile, kuid võtmega --file anname teise nime ette.
# --tag annab tõmmisele nime, kujul repo/tõmmis:taag
# Teeks on töökaust (.)
#
docker build \
  --file Envoy.Dockerfile \
  --tag mesh-poc/teenuse-envoy:latest \
  .

# Eemalda eelmine samanimeline konteiner.
# Sama konteineri käivitamiseks kasuta docker start
# docker container rm PAS-Envoy

# Käivita 
# Eeskuju: https://jvns.ca/blog/2018/10/27/envoy-basics/
#
# docker run [OPTIONS] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]
#
# -d (detached)
#
# --rm (konteineri töö lõppedes eemalda
#   konteineri failisüsteem)
#
# --name <nimi> (annab konteinerile nime)
#
# --net <Docker-võrk> (andes 'host', on konteineri avaldatud
#   pordid masinas kohe kättesaadavad; vaikimisi käitatakse
#   konteinerit Docker-võrgus 'bridge', seal peab konteineri
#   pordid -p suvandi abil masinas - aga mitte Docker-võrgus
#   'bridge' - jooksvatele rakendustele kättesaadavaks tegema.
#   Vt: https://stackoverflow.com/questions/43316376/
#       what-does-net-host-option-in-docker-command-really-do 
#
# -v (volume)
#   loe https://docs.docker.com/storage/volumes/
#   (Manage application data)
#   $PWD on töökaust (present working dir-ry?)
#   $PWD: on ketta nimi
#   /config on tee, kuhu ketas konteineris monteeritakse
#   võib (: järel) olla veel suvandite loetelu
#   Selle seadistuse efekt: host-i töökaust tehakse
#   konteinerile failitee /config all kättesaadavaks.
#
#   pas-envoy on käivitatav tõmmis (valmistatud 
#   eelmisel sammul)
# 
#   /usr/local/bin/envoy on käivitatav käsk
#
#   --config-path /config/PAS-Envoy-Conf.json on Envoy-le edastatav
#   argument (konf-ifaili asukoht kettal)
#   Kuidas saab konf-ifail kettale? -v seadistusega.
#
docker run \
  -d \
  --rm \
  --name teenuse-envoy \
  --net host \
  --volume=$PWD:/config \
  -p 5100:5100 \
  -p 9001:9001 \
  -p 10000:10000 \
  mesh-poc/teenuse-envoy:latest \
  /usr/local/bin/envoy

#  --config-path /config/PAS-Envoy-Conf.json
# Konf-ifail on Dockerfile-s määratud.
# Millegipärast --config-path ei tööta.

# Envoy kuulab pordil 5100
# Envoy admin-liides on pordil 9001

