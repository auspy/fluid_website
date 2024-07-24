/** @type {import('tailwindcss').Config} */
const colors = {
  primary: "#4288f6",
  "primary-border": "#2a6edb",
  accent: "#29b047",
  text: "#08384d",
  heading: "#062330",
  yellow: "#e8c827",
  bg: "#F0F6FF",
  "bg-border": "#98BEFA",
  heading2: "#0C445B",
};
export default {
  content: ["./src/**/*.{js,jsx}", "./index.html"],
  theme: {
    screens: {
      sm: "390px",
      // => @media (min-width: 640px) { ... }

      md: "760px",
      // => @media (min-width: 768px) { ... }

      lg: "1100px",
      // => @media (min-width: 1024px) { ... }

      xl: "1440px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors,
      spacing: {
        1: "5px",
        2: "10px",
        3: "15px",
        4: "20px",
        5: "25px",
        6: "30px",
        7: "35px",
        8: "40px",
        9: "45px",
        10: "50px",
      },
    },
  },
  plugins: [],
};
