# ✅ Image Alpine (légère)
FROM node:22-alpine

WORKDIR /app

# ✅ Copie des dépendances d'abord (cache)
COPY src/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ✅ Copie du code
COPY src/ ./

# ✅ Utilisateur non-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs   && chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# ✅ Healthcheck (endpoint /health)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s   CMD node -e "fetch('http://localhost:3000/health').then(r=>process.exit(r.status===200?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
