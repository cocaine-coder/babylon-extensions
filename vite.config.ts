import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: "./lib/index.ts",
            name: "BABYLON.Toolkits",
            formats: ['umd', 'es'],
            fileName: (format) => `index.${format}.js`
        },
        rollupOptions:{
            external : ['@babylonjs/core', '@babylonjs/gui']
        }
    },
    plugins: [dts()]
})