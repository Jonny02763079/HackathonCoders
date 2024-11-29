/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        pageShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        wave: "wave 1s infinite ease-in-out", // Animation für die Wellenbewegung
      },
      keyframes: {
        wave: {
          "0%, 100%": {
            transform: "scaleY(0.6)", // Anfangs- und Endzustand
          },
          "50%": {
            transform: "scaleY(0.4)", // Höhe der Balken in der Mitte der Animation
          },
        },
      },
    },
  },
  plugins: [],
};
