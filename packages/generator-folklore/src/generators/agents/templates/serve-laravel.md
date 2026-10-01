## Serving the project (Laravel)

Always test a Laravel project through its `.test` domain, never `localhost`: some behaviour depends on the domain (multi-site routing, subdomains, absolute URLs, cookies).

1. Valet serves the Laravel app at `https://<project>.test`. Check it with `valet links`.
2. Start the dev server without opening a browser: `npm run server -- --no-open`. It proxies Valet (`FLKLR_PROXY` in `.env`) and serves the assets with hot reload.
3. Test at `https://<project>.test:8080`. `flklr serve` picks up the site's Valet certificate on its own (from `~/.config/valet/Certificates`), so the browser trusts it like the site itself.

Notes:

- Options reach `flklr` from `package.json` (`build` key), the environment (`FLKLR_*`) and the command line, the command line winning. Leave `package.json` as is and pass overrides on the command line.
- On a certificate error, see [Fixing Valet certificates](#fixing-valet-certificates) rather than switching to `localhost` or plain HTTP.
- Stop the dev server once testing is done.

### Fixing Valet certificates

**Why it breaks.** Valet signs each site's certificate with its own certificate authority (CA), which it adds to the macOS keychain. The browser trusts a site only while that chain holds. When the CA expires (older Valet CAs lasted only two years), the keychain no longer trusts it, or a site certificate is missing or expired, the browser rejects the site: usually `ERR_CERT_DATE_INVALID` or `ERR_CERT_AUTHORITY_INVALID`. The dev server on `:8080` reuses the same certificate, so it breaks at the same time. Renewing the certificates fixes it; switching to `localhost` or plain HTTP only hides it and breaks domain-dependent behaviour.

**Check**

```bash
npx flklr certificates <project>.test   # one site (a parent domain's certificate counts)
npx flklr certificates                  # every site secured by Valet
```

Each line shows ✔ or ✖ with the first problem found, and the command exits with 1 when something fails. The check is read-only, so an agent may run it.

**Fix**

```bash
npx flklr certificates --fix
```

- A failing site is secured again with `valet secure`.
- When the CA is missing, expired or untrusted, the command deletes it and secures every site again: every site certificate depends on the CA, so renewing it alone would break the others.
- It then runs the check again. Restart `npm run server` and reload the browser, since the dev server reads the certificate at startup.

`--fix` asks for the sudo password and changes the system keychain: an agent explains it and lets the developer run it.

If the check passes but `:8080` is still rejected, `flklr serve` found no certificate for the proxy's host and fell back to its self-signed `localhost` certificate: check that `FLKLR_PROXY` in `.env` uses the `.test` domain.

With Herd instead of Valet, renew certificates from Herd's settings.
