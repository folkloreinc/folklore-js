## Serving the project (HTML, no Laravel backend)

Without a backend, the dev server serves the project directly on `localhost`.

1. Start the dev server over HTTP, without opening a browser: `npm run server -- --server http --no-open`.
2. Test at `http://localhost:<port>`, the port printed by the dev server (`8080` unless taken).

Notes:

- Options reach `flklr` from `package.json` (`build` key), the environment (`FLKLR_*`) and the command line, the command line winning. Leave `package.json` as is and pass overrides on the command line.
- HTTP avoids the dev server's self-signed certificate, which browsers reject. Use the default HTTPS only when a feature requires a secure context the browser won't grant to `localhost`.
- Stop the dev server once testing is done.
