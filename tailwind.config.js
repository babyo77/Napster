/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*"],
  theme: {
    extend: {
      animation: {
        'text-gradient': 'text-gradient 1.5s linear infinite',
        'background-shine': 'background-shine 2s linear infinite',
      },
      keyframes: {
        'text-gradient': {
          to: {
            backgroundPosition: '200% center',
          },
        },
        'background-shine': {
          from: {
            backgroundPosition: '0 0',
          },
          to: {
            backgroundPosition: '-200% 0',
          },
        },
      },
    },
  },
  plugins: [],
};
