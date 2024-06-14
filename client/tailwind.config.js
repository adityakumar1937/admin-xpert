/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'login-img': "url('./images/login-img.png')",
        "hero-img": "url('./images/hero-img.jpg')",
      },
      colors: {
        purple: "#9D89E3",
        blue: "#7AB9D5",
      },
    },
  },
  plugins: [],
};
