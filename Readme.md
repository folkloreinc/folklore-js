Folklore Javascript Packages
============

[![Build Status](https://travis-ci.org/Folkloreatelier/folklore-js.svg?branch=master)](https://travis-ci.org/Folkloreatelier/folklore-js)
[![Coverage Status](https://coveralls.io/repos/github/Folkloreatelier/folklore-js/badge.svg?branch=master)](https://coveralls.io/github/Folkloreatelier/folklore-js?branch=master)

## Packages
This package is splitted in multiple packages that can be used independently.

| Package Name | Description | Version | Links |
| ------------ | ----------- | ------- | ----- |
| [generator-folklore](https://github.com/folkloreinc/folklore-js/tree/main/packages/generator-folklore) | Yeoman generator for Folklore projects | [![NPM Version](https://badge.fury.io/js/generator-folklore.svg)](https://www.npmjs.com/package/generator-folklore) | [Documentation](https://github.com/folkloreinc/folklore-js/tree/main/packages/generator-folklore/) |
| [@folklore/config](https://github.com/folkloreinc/folklore-js/tree/main/packages/config) | Config helpers | [![NPM Version](https://badge.fury.io/js/%40folklore%2Fconfig.svg)](https://www.npmjs.com/package/@folklore/config) |  [Documentation](https://github.com/folkloreinc/folklore-js/tree/main/packages/config/) |
| [@folklore/size](https://github.com/folkloreinc/folklore-js/tree/main/packages/size) | Sizing utilities | [![NPM Version](https://badge.fury.io/js/%40folklore%2Fsize.svg)](https://www.npmjs.com/package/@folklore/size) |  [Documentation](https://github.com/folkloreinc/folklore-js/tree/main/packages/size/) |
| [@folklore/pan](https://github.com/folkloreinc/folklore-js/tree/main/packages/pan) | Panning and MouseWheeling utilities | [![NPM Version](https://badge.fury.io/js/%40folklore%2Fpan.svg)](https://www.npmjs.com/package/@folklore/pan) |  [Documentation](https://github.com/folkloreinc/folklore-js/tree/main/packages/pan/) |
| [@folklore/laravel](https://github.com/folkloreinc/folklore-js/tree/main/packages/laravel) | Laravel javascript helpers | [![NPM Version](https://badge.fury.io/js/%40folklore%2Flaravel.svg)](https://www.npmjs.com/package/@folklore/laravel) |  [Documentation](https://github.com/folkloreinc/folklore-js/tree/main/packages/laravel/) |
| [@folklore/services](https://github.com/folkloreinc/folklore-js/tree/main/packages/services) | External services helpers | [![NPM Version](https://badge.fury.io/js/%40folklore%2Fservices.svg)](https://www.npmjs.com/package/@folklore/services) |  [Documentation](https://github.com/folkloreinc/folklore-js/tree/main/packages/services/) |
| [@folklore/pixi](https://github.com/folkloreinc/folklore-js/tree/main/packages/pixi) | Pixi.js utilities | [![NPM Version](https://badge.fury.io/js/%40folklore%2Fpixi.svg)](https://www.npmjs.com/package/@folklore/pixi) |  [Documentation](https://github.com/folkloreinc/folklore-js/tree/main/packages/pixi/) |
| [@folklore/user-media](https://github.com/folkloreinc/folklore-js/tree/main/packages/user-media) | getUserMedia utilities | [![NPM Version](https://badge.fury.io/js/%40folklore%2Fuser-media.svg)](https://www.npmjs.com/package/@folklore/user-media) |  [Documentation](https://github.com/folkloreinc/folklore-js/tree/main/packages/user-media/) |

## Releases

Packages are versioned independently with [Changesets](https://changesets.dev) and published to npm by GitHub Actions, with [trusted publishing](https://docs.npmjs.com/trusted-publishers): no npm token, and each version gets a provenance attestation.

1. In the pull request that changes a published package, run `npx changeset`: pick the packages, the bump (patch, minor or major) and write the line for their `CHANGELOG.md`. Commit the file it creates in `.changeset/`. Changes outside `packages/` don't need one; a package change that doesn't need a release takes `npx changeset --empty`. The Changeset check fails a pull request that changes a package without one.
2. On every push to `main`, the [Release workflow](.github/workflows/release.yml) opens or updates the "Version packages" pull request, which bumps the versions and writes the changelogs.
3. Before merging it, configure trusted publishing for the packages it releases for the first time (see below).
4. Merging it runs the workflow again: it builds the packages, publishes the new versions, pushes the `<package>@<version>` tags and creates the GitHub releases.

Don't publish from a local machine (`lerna publish`, `npm publish`).

### Trusted publishing

npm only accepts a publish from the Release workflow for packages that trust it. Configure a package once, with npm 11.15+, write access to the package and 2FA:

```bash
scripts/trust-packages.sh
```

Run on the "Version packages" branch with no argument, it configures the packages whose new version isn't on npm yet; it also takes package names. A new configuration expires if no publish succeeds with it within 2 days, so don't configure packages ahead of their release. A package that isn't configured fails to publish with `ENEEDAUTH` while the others go through: configure it and re-run the workflow.

Once a package has been published by the workflow, its npm settings can be set to "Require two-factor authentication and disallow tokens", which doesn't affect trusted publishing. The workflow file name (`release.yml`) is part of the trust: renaming it breaks publishing.
