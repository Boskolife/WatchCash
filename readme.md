# Vite Landing Template

Is a bundler for your landing project

## Installation

Requires [Node.js](https://nodejs.org/) v16+ to run.

Install the dependencies and devDependencies and start the server.

```sh
  npm i
  npm run dev
```

## Eslint + Pretier

If you don't have a .vscode/settings.json file yet, create it with the following settings:

```sh
{
  ...
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}

```

## Picture (WebP + PNG/JPEG)

Images in `public/` are converted to WebP at build start (same as using a converter like Pixelied). Use the **picture** macro in Handlebars to output `<picture>` with WebP and fallback:

```html
{{{picture "/images/hero.png" alt="Hero image"}}}
{{{picture "/images/photo.jpg" alt="Photo" class="rounded"}}}
```

Use **triple braces** `{{{ ... }}}` so the HTML is not escaped. Optional hash: `alt`, `class`, `loading`, `width`, `height`. Put PNG/JPEG in `public/`; WebP is generated automatically when you run `npm run dev` or `npm run build`. You can also run `npm run webp` to convert without building.

## GitHub Pages

Set the correct base in vite.config.js.

If you are deploying to `https://<USERNAME>.github.io/`, you can omit base as it defaults to `/`.

If you are deploying to `https://<USERNAME>.github.io/<REPO>/`, for example your repository is at `https://github.com/<USERNAME>/<REPO>`, then set base to `/<REPO>/`.

## License

MIT

**Free Software, Hell Yeah!**
