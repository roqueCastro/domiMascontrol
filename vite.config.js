import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    base: '/domiMascontrol/',
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    includeAbsolute: false,
                },
            },
        }),
    ],



    build: {
        // salida de la build (fuera de resources)
        outDir: fileURLToPath(new URL('./dist', import.meta.url)),
        rollupOptions: {
            // punto de entrada HTML
            input: fileURLToPath(
                new URL('./index.html', import.meta.url)
            ),
        },
    },
})