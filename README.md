# FocusLock

FocusLock is a browser extension designed to help you maintain focus by blocking non-educational websites. It allows you to create a list of distracting websites and prevent access to them when you need to concentrate on work or studies.

## Features

- Block distracting websites with a simple toggle
- Customize your list of blocked sites
- Clean, minimalist interface built with Svelte
- Focus mode to help you stay productive

## Getting Started

This project is built with Svelte, powered by [`sv`](https://svelte.dev/docs/kit/introduction).

## Installing on the browser

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. Build the extension:
   ```bash
   npm run build:extension
   # or
   yarn build:extension
   # or
   pnpm build:extension
   ```

3. Open Chrome and navigate to `chrome://extensions/`

4. Enable "Developer mode" using the toggle in the top-right corner

5. Click on "Load Unpacked" and select the `build` directory from your project folder

The extension should now be installed and ready to use in your browser.
