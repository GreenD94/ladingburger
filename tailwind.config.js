/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'orange-brand': '#FF4D00',
        'orange-hover': '#E64500',
        'orange-light': '#FFE0B2',
        'gray-dark': '#2C1810',
        'gray-text': '#4A2A1D',
      },
      backgroundColor: {
        'orange-50': '#FFF3E0',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
} 