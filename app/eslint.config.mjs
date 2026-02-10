import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactLint from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

const IGNORED_UNICORN_RULES = {
  "unicorn/filename-case": "off",
  "unicorn/no-null": "off",
  "unicorn/prevent-abbreviations": "off",
  "unicorn/no-nested-ternary": "off",
};

export default tseslint.config(
  {
    ignores: [
      "src/routeTree.gen.ts",
      "src/types/melosysSkjemaTypes.ts",
      "dist/*",
      "playwright-report/**",
      ".tanstack/**",
      "scripts/**",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...reactLint.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  eslintPluginUnicorn.configs["flat/recommended"],
  {
    rules: {
      eqeqeq: ["error", "always"],
      "react/jsx-key": "error",
      "react/jsx-sort-props": "error",
      "react/react-in-jsx-scope": "off",
      "no-console": "error",
      ...IGNORED_UNICORN_RULES,
    },
  },
  eslintPluginPrettierRecommended,
);
