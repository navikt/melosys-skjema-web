import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

const IGNORED_UNICORN_RULES = {
  "unicorn/filename-case": "off",
  "unicorn/no-null": "off",
  "unicorn/prevent-abbreviations": "off",
  "unicorn/no-nested-ternary": "off",
  // Route-filnavn og variabelnavn med "i" (norsk) tolkes feil som forkortelse
  "unicorn/name-replacements": "off",
  // Norsk kode bruker "er", "har", "skal" som boolean-prefix, ikke "is", "has", "should"
  "unicorn/consistent-boolean-name": "off",
  // Server entry point og logger må ha top-level side effects
  "unicorn/no-top-level-side-effects": "off",
};

export default tseslint.config(
  {
    ignores: ["dist/*", "scripts/*"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
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
      ...IGNORED_UNICORN_RULES,
    },
  },
  eslintPluginPrettierRecommended,
);
