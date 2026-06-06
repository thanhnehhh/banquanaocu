/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                olive: {
                    300: '#a3b18a',
                    800: '#586b4e',
                    900: '#46563e',
                }
            },
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
