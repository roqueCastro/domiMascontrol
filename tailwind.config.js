module.exports = {
    darkMode: ['selector', '[class="dark"]'],
    prefix: 'tw-', // AQUÍ ESTÁ EL PREFIJO SOLICITADO
    content: [
        "/index.html",
        "./src/**/*.{js,jsx,ts,tsx,vue,html,css,scss,sass,less,styl}",
    ],
    theme: {
        extend: {
            animation: {
                'swing': 'swing 1s infinite',
                'fade-in': 'fadeIn 0.2s ease-out forwards',
                'slide-up': 'slideUp 0.3s ease-out forwards',
            },
            keyframes: {
                swing: {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '20%': { transform: 'rotate(15deg)' },
                    '40%': { transform: 'rotate(-10deg)' },
                    '60%': { transform: 'rotate(5deg)' },
                    '80%': { transform: 'rotate(-5deg)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        }
    },
    plugins: [],
};
