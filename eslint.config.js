import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import astroPlugin from "eslint-plugin-astro";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  // Ignorar directorios generados
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },

  // Base JS (Node globals para archivos de configuracion)
  {
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Archivos TypeScript y TSX (entorno browser)
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // TypeScript
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // React
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // No necesario con React 17+
      "react/prop-types": "off", // Usamos TypeScript para tipos
      "react/jsx-no-target-blank": "error",

      // React Hooks
      ...reactHooksPlugin.configs.recommended.rules,
      // setState dentro de useEffect es un patron valido para hidratacion desde URL
      "react-hooks/set-state-in-effect": "off",

      // Accesibilidad
      ...jsxA11yPlugin.configs.recommended.rules,

      // Generales
      "no-console": "warn",
      "prefer-const": "error",
    },
  },

  // Archivos Astro
  ...astroPlugin.configs.recommended,

  // Prettier debe ir al final para deshabilitar reglas de formato
  prettierConfig,
];
