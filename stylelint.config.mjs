/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "scss/percent-placeholder-pattern": null,
    "scss/dollar-variable-pattern": null,
    "scss/at-mixin-pattern": null,
    "keyframes-name-pattern": null,
    "selector-class-pattern": null,
    "declaration-block-no-redundant-longhand-properties": [
      true,
      {
        ignoreLonghands: [
          "grid-template",
          "grid-template-areas",
          "grid-template-rows",
          "grid-template-columns",
        ],
      },
    ],
  },
}
