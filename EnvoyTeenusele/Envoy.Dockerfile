# Teenuse PAS Envoy tõmmis
# 
FROM envoyproxy/envoy-alpine:latest

# FROM envoyproxy/envoy:latest

ENTRYPOINT \
  echo "PAS Envoy: Käivitun" && \
  envoy -c /config/Envoy-Conf.json
  
# --service-cluster service${SERVICE_NAME}
