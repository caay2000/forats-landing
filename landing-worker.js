// Serves public/ as the forats.app landing. The only routing rule beyond plain
// static assets: /join/<code> (dynamic deep-link path, shared e.g. via WhatsApp)
// always resolves to public/join/index.html, which reads the code from
// window.location.pathname client-side. Firebase Hosting did this via an explicit
// rewrite ("/join/**" -> "/join/index.html"); Workers static assets has no rewrite
// config, so it's done here instead.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);

    if (segments[0] === 'join') {
      return env.ASSETS.fetch(new URL('/join/index.html', url));
    }

    return env.ASSETS.fetch(request);
  },
};
