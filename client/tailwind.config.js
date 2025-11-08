/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
 theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8D0392",
          light: "#BF7BB8",
          dark: "#6F0077",
        },
        accent: "#55EFC4",
        background: "#FAFAFA",
        surface: "#FFFFFF",
        border: "#E5E5E5",
        text: {
          DEFAULT: "#1E1E1E",
          muted: "#6B6B6B",
        },
        success: "#4CAF50",
        warning: "#FFCC3A",
        error: "#F44336",
      },
    },
  },
  plugins: [],
}
