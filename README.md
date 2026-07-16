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
npm run deploy   # wrangler deploy — requiere `wrangler login` una vez (o CLOUDFLARE_API_TOKEN)
```

wrangler pineado a `4.85.0` (no `^`): a partir de la 4.88 requiere Node 22.

## Pendiente de infraestructura (fuera de este repo)

- Colgar el dominio `forats.app` a este Worker en el dashboard de Cloudflare (custom domain).
- Actualizar el campo "website" del listing en Play Console a `https://forats.app`.
- Publicar un build nuevo de Android (`forats-app`, `app.json` ya apunta a `forats.app`) para que los
  dispositivos ya instalados verifiquen el nuevo dominio de App Links.
