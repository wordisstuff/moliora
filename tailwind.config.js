/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './pages/**/*.{ts,tsx}', // якщо є
        './src/**/*.{ts,tsx}', // якщо ти тримаєш код у /src
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                ocean: '#05445E',
                babyblue: '#D4F1F4',
                bluegren: '#75E6DA',
                bluegrotto: '#189AB4',
            },
        },
    },
    plugins: [],
};
