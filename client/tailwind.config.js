module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dm: ["DM Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#10B981", // add a default brand color (you can change this)
          light: "#6EE7B7",
          dark: "#047857",
        },
        blue1: "#336b89",
      },
    },
  },
  plugins: [],
};
