module.exports = {
  theme: {
    extend: {
      screens: {
        xsm: '375px',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        dm: ['var(--font-dm-sans)'],
        lora: ['var(--font-lora)'],
      },
    },
  },
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
};
