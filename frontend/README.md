# React + Vite (Minimal Template)

A minimal React + Vite starter template with hot module replacement (HMR) and a basic ESLint setup. This README provides quick instructions to get started, recommended workflows, and links to useful plugins.

## Features

- Fast development with Vite and HMR
- React support (JSX/TSX ready)
- Basic ESLint configuration
- Compatibility with official React plugins for improved compilation

## Prerequisites

- Node.js >= 16
- npm or yarn

## Quick start

1. Install dependencies:

	npm install

2. Start development server:

	npm run dev

3. Build for production:

	npm run build

4. Preview production build locally:

	npm run preview

Check package.json for exact script names if your project uses yarn or pnpm.

## Official React plugins

- @vitejs/plugin-react — uses Oxc for compilation: https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react
- @vitejs/plugin-react-swc — uses SWC for compilation: https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc

Choose the plugin that fits your needs (Oxc vs SWC) depending on performance and compatibility requirements.

## React Compiler

The React Compiler is not enabled in this template due to potential impact on dev and build performance. To enable it, see: https://react.dev/learn/react-compiler/installation

## Expanding ESLint (optional)

For production apps we recommend TypeScript with type-aware lint rules. See the TypeScript template for guidance on integrating types and `@typescript-eslint`: https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts

## Contributing

Feel free to open issues or pull requests to improve this template.

---
_This README was expanded to provide clearer setup and usage instructions._
