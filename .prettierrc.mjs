export default {
  trailingComma: "all",
  tabWidth: 2,
  tabs: false,
  semi: false,
  singleQuote: false,
  arrowParens: "always",
  plugins: [import.meta.resolve("prettier-plugin-astro")],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
}
