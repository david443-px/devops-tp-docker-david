# TP noté — Pipeline DevSecOps avec GitHub Actions

![DevSecOps Pipeline](https://github.com/david443-px/devops-tp-docker-david/actions/workflows/security.yml/badge.svg)

## Objectif

Mettre en place un pipeline CI/CD **sécurisé** qui exécute automatiquement :

- **SAST** : Semgrep (OWASP Top 10, security-audit, secrets)
- **SCA** : `npm audit` sur les dépendances Node.js
- **Secret detection** : Gitleaks
- **Container scan** : Trivy (HIGH/CRITICAL)
- **Security gate** : le workflow échoue si un contrôle échoue
- **Rapport** : `security-report.json` (artifact)

## Structure

- `src/` : application Node.js
- `Dockerfile` : image Docker sécurisée (non-root, healthcheck)
- `.github/workflows/security.yml` : pipeline DevSecOps

## Variables d'environnement (local)

Copier l’exemple :

```bash
cp .env.example .env
```

Puis mettre un vrai secret :

- `JWT_SECRET` (>= 32 caractères)
- `ADMIN_PASS` (mot de passe)

## Exécution locale

```bash
# build + run
docker build -t vuln-app:local .
docker run --rm -p 3000:3000 --env-file .env vuln-app:local

# test
curl http://localhost:3000/health
```

## Secrets GitHub (pour le pipeline)

Repo GitHub → **Settings** → **Secrets and variables** → **Actions** :

- `JWT_SECRET`
- `ADMIN_PASS` (optionnel si vous voulez tester login côté CI)

## Résultats attendus

- Le workflow **DevSecOps Pipeline** passe en vert ✅
- Les rapports sont visibles dans **Actions → Artifacts**
