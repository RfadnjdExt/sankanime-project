import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "dist/",
      "node_modules/",
      "**/*.config.js",
      "**/*.config.cjs",
      "package.json",
      "package-lock.json",
      "**/*.css",
    ],
  },

  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    plugins: {
      react: pluginReact,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs["jsx-runtime"].rules,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    files: ["**/*.json", "**/*.jsonc"],
    ...json.configs["recommended-with-jsonc"],
  },

  ...markdown.configs.recommended,

  {
    files: ["**/*.css"],
    plugins: {
      css: css,
    },
    rules: {
      ...css.configs.recommended.rules,
      "css/at-rule-no-unknown": [
        "error",
        {
          ignoreAtRules: [
            "tailwind",
            "apply",
            "variants",
            "responsive",
            "screen",
            "layer",
          ],
        },
      ],
    },
  },

  {
    files: ["**/*.md/*.{js,jsx}"],
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-undef": "off",
    },
  },
]);
