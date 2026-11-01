import url from 'url';

/**
 * Vite Dev Plugin that runs Vercel Serverless Functions (/api/*) in local development.
 * Automatically polyfills req.query, req.body, res.status(), res.json(), and res.send()
 * matching Vercel Serverless Function behavior.
 */
export function serverlessDevPlugin() {
  return {
    name: 'vite-plugin-vercel-serverless',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next();
        }

        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const query = parsedUrl.query || {};

        req.query = query;

        res.status = function (code) {
          res.statusCode = code;
          return res;
        };

        res.json = function (obj) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(obj));
          return res;
        };

        res.send = function (data) {
          res.end(data);
          return res;
        };

        // Parse JSON body if present
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          let bodyData = '';
          req.on('data', chunk => {
            bodyData += chunk;
          });
          await new Promise(resolve => req.on('end', resolve));

          if (bodyData) {
            try {
              req.body = JSON.parse(bodyData);
            } catch (e) {
              req.body = bodyData;
            }
          } else {
            req.body = {};
          }
        } else {
          req.body = {};
        }

        try {
          if (pathname.startsWith('/api/auth/')) {
            const action = pathname.replace('/api/auth/', '').split('?')[0];
            req.query.action = action;
            const mod = await import(/* @vite-ignore */ '../api/auth/[action].js');
            return await mod.default(req, res);
          }

          if (pathname === '/api/products' || pathname.startsWith('/api/products/')) {
            const mod = await import(/* @vite-ignore */ '../api/products.js');
            return await mod.default(req, res);
          }

          if (pathname === '/api/categories') {
            const mod = await import(/* @vite-ignore */ '../api/categories.js');
            return await mod.default(req, res);
          }

          if (pathname === '/api/offers') {
            const mod = await import(/* @vite-ignore */ '../api/offers.js');
            return await mod.default(req, res);
          }

          if (pathname === '/api/blogs') {
            const mod = await import(/* @vite-ignore */ '../api/blogs.js');
            return await mod.default(req, res);
          }

          if (pathname === '/api/settings') {
            const mod = await import(/* @vite-ignore */ '../api/settings.js');
            return await mod.default(req, res);
          }

          if (pathname === '/api/contact') {
            const mod = await import(/* @vite-ignore */ '../api/contact.js');
            return await mod.default(req, res);
          }

          if (pathname === '/api/track') {
            const mod = await import(/* @vite-ignore */ '../api/track.js');
            return await mod.default(req, res);
          }

          if (pathname === '/api/sitemap' || pathname === '/sitemap.xml') {
            const mod = await import(/* @vite-ignore */ '../api/sitemap.js');
            return await mod.default(req, res);
          }

          return next();
        } catch (err) {
          console.error('[Serverless Dev Error]', err);
          return res.status(500).json({ error: 'Serverless execution error', details: err.message });
        }
      });
    },
  };
}
