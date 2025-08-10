/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      keyframes: {
        glowPulse: {
          "0%, 100%": { filter: "drop-shadow(0 0 6px rgba(59,130,246,0.9))" },
          "50%": { filter: "drop-shadow(0 0 12px rgba(59,130,246,1))" },
        },
        glowPulseDark: {
          "0%, 100%": { filter: "drop-shadow(0 0 6px rgba(168,85,247,0.9))" },
          "50%": { filter: "drop-shadow(0 0 12px rgba(168,85,247,1))" },
        },
      },
      animation: {
        glowPulse: "glowPulse 1.5s ease-in-out infinite",
        glowPulseDark: "glowPulseDark 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
