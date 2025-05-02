module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dm: ["DM Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        heading: ["Bowlby One", "sans-serif"],
      },
      fontWeight: {
        100: "100",
        200: "200",
        400: "400",
        500: "500",
        800: "800",
      },
      colors: {
        brand: {
          DEFAULT: "#10B981", // add a default brand color (you can change this)
          light: "#6EE7B7",
          dark: "#047857",
        },
        blue1: "#336b89",
        grey: "#dadadd",
      },
    },
  },
  plugins: [],
};
