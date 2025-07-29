// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // VERY important to include src folder
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0D0D0D",
        surface: "#1A1A1A",
        accent: "#00BFA6",
        danger: "#FF4C4C",
      },
    },
  },
  plugins: [],
};
