/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                bgColor: {
                    DEFAULT: '#0e0f10',
                },
            }
        },
    },
    plugins: [],
}

