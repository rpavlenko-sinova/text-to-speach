This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev` or `build/chrome-mv3-prod`.

## Template contents

Current version of template contains simple messaging script between content script/popup to background scripts. And Plasmo storage, to store common data.

Setup have husky, lint staged, prettier, and typescript check before commit.

For ui part it's tailwind and shadcn. There currently button component (as an example)

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!
