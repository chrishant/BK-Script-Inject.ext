# BK BOM Assistant Injector (one-click)

Click the Chrome extension icon once to run the configured script on the matching page. No popup or second button is used.

## Configure routes and scripts

Edit `config.js` only. Add one object to `targets` for each allowed route:

- `id`: unique identifier
- `name`: display/status name
- `protocol`: usually `https:`
- `host`: exact hostname (no wildcard)
- `pathname`: exact document path
- `hash`: exact SPA route, without query parameters
- `scriptUrl`: controller JavaScript URL

The extension compares protocol, hostname, pathname, and the hash route. Chrome manifest match patterns cannot match URL fragments, so the hash check is done by the service worker.

## Install / update

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Remove or disable the previous copy if needed.
4. Click **Load unpacked** and select this folder.
5. Open `https://windeson.bluekaktus.com/Dashboard/Index#/order/bom`.
6. Click the extension icon once. The badge shows `OK`, `ERR`, or a route mismatch status.

## Important

The configured controller is downloaded from GitHub at click time and executed in the page's MAIN world. Only use trusted scripts. The remote file can change independently of this extension. The target site's Content Security Policy may block `eval`; if it does, use a reviewed local script bundle or a CSP-compatible script-loading approach.
