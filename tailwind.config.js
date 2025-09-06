module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./app.vue",
    "./data/**/*.{json}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IranSans", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
