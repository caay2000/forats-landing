# forats-landing

Landing pública de Forats — dominio `forats.app`, servida como Cloudflare Worker (static assets +
`landing-worker.js` para el rewrite de `/join/<code>`).

Antes vivía en `forats-app` (Firebase Hosting, `forats-app.web.app`). Se separó a este repo para que la
landing/deep-linking/privacidad no dependa del repo de la app móvil — ver `forats-server/docs/ROADMAP.md`
para el detalle de la migración.

## Contenido

- `public/index.html` — landing de marketing (es/en/ca vía `data-i18n`, sin build step).
- `public/privacy.html` — política de privacidad (enlazada desde ajustes de la app y Play Console).
- `public/join/index.html` — página de deep-link para `/join/<código>` compartido desde la app.
- `public/.well-known/assetlinks.json` — verificación de Android App Links (debe coincidir con el
  `intentFilters.host` de `app.json` en `forats-app`).
- `public/app-ads.txt` — verificación de AdMob (debe coincidir con el "website" configurado en Play Console).

## Deploy

```bash
npm install
npm run dev      # wrangler dev, local
npm run deploy   # wrangler deploy — publica en forats.app y www.forats.app
```

Mergear a `main` **no despliega**: hay que lanzar `npm run deploy` a mano.

El Worker vive en la cuenta de Cloudflare de Forats (`account_id` fijado en `wrangler.jsonc`, para no
desplegar nunca en otra cuenta con la que `wrangler login` tenga sesión). La credencial es un API token de esa
cuenta en `.env` (gitignored), que wrangler lee solo:

```
CLOUDFLARE_API_TOKEN=<token>
```

Permisos del token: zona `forats.app` → Workers Routes Edit, DNS Edit, Zone Read; cuenta → Workers Scripts
Edit, Account Settings Read. Los dominios (`routes` con `custom_domain`) los crea el propio deploy, incluido
el DNS y el certificado.

### Firebase Hosting (`forats-app.web.app`) sigue vivo

`app.json` de `forats-app` sigue declarando `forats-app.web.app` como host de App Links, así que ese sitio
sirve el mismo `public/` y hay que redesplegarlo también cuando cambie algo (sobre todo `privacy.html` y
`.well-known/assetlinks.json`), desde un directorio temporal con este `firebase.json`:

```json
{
  "hosting": {
    "public": "public",
    "cleanUrls": true,
    "ignore": ["firebase.json", "**/.*", "!**/.well-known/**", "**/node_modules/**"],
    "rewrites": [{ "source": "/join/**", "destination": "/join/index.html" }]
  }
}
```

```bash
firebase deploy --only hosting --project forats-app
```

wrangler pineado a `4.85.0` (no `^`): a partir de la 4.88 requiere Node 22.

## Pendiente de infraestructura (fuera de este repo)

- Actualizar el campo "website" del listing en Play Console a `https://forats.app`.
- Cambiar `intentFilters.host` en `app.json` de `forats-app` de `forats-app.web.app` a `forats.app` y
  publicar un build nuevo para que los dispositivos verifiquen el nuevo dominio de App Links. Hasta que esa
  versión esté adoptada, Firebase Hosting no se puede apagar.
