# Image de base officielle Nginx (légère)
FROM nginx:alpine

# Métadonnées (bonne pratique)
LABEL maintainer="TP DevOps"
LABEL description="Application web DevOps containerisée avec Nginx"

# Copier la configuration Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de l'application web
COPY src/ /usr/share/nginx/html/

# Exposer le port HTTP
EXPOSE 80

# Vérification de santé du container
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://localhost/ || exit 1

# Lancer Nginx au premier plan
CMD ["nginx", "-g", "daemon off;"]