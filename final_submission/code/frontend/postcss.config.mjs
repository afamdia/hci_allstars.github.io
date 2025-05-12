// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // Configure as an object key with an empty options object
    'autoprefixer': {},         // It's also good practice to include autoprefixer
  },
};