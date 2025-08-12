import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Blok untuk mengabaikan file secara global (ini sudah benar)
  {
    ignores: [
      "dist/",
      "node_modules/",
      "**/*.config.js",
      "**/*.config.cjs",
      "package.json",
      "package-lock.json",
      "**/*.css", // Ini yang memperbaiki error parsing awal
    ],
  },

  // Konfigurasi untuk file JavaScript dan JSX
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

  // Konfigurasi untuk file JSON
  {
    files: ["**/*.json", "**/*.jsonc"],
    ...json.configs["recommended-with-jsonc"],
  },

  // Konfigurasi untuk Markdown
  ...markdown.configs.recommended,

  // ========================================================================
  // PERUBAHAN UTAMA DI SINI: Blok Konfigurasi untuk CSS
  // ========================================================================
  {
    files: ["**/*.css"],
    // 1. Daftarkan plugin CSS secara eksplisit.
    plugins: {
      css: css,
    },
    // 2. Definisikan aturan secara eksplisit.
    rules: {
      // Mulai dengan semua aturan yang direkomendasikan dari plugin CSS.
      ...css.configs.recommended.rules,
      // Kemudian, timpa aturan spesifik yang kita butuhkan.
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

  // Aturan khusus untuk blok kode di dalam file Markdown
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
