/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily:{
        "inter-thin": ["Poppins_100Thin"],
        "inter-regular": ["Poppins_400Regular"],
        "inter-semiBold": ["Poppins_600SemiBold"],
        "inter-bold": ["Poppins_700Bold"],
      },
      colors: {
        primary: "#49D6D8"
      }
    },
  },
  plugins: [],
}

