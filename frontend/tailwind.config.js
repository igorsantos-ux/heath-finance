/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#8A9A5B", // Moss Green
                secondary: "#697D58", // Reseda Green
                accent: "#DEB587", // Dun
                background: "#F0EAD6", // Eggshell
                surface: "#FFFFFF",
                text: {
                    primary: "#1A202C",
                    secondary: "#4A5568",
                    muted: "#718096"
                }
            },
        },
    },
    plugins: [],
}
