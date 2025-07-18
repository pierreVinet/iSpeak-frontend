import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Change unused variables from error to warning
      "@typescript-eslint/no-unused-vars": "warn",

      // Change unescaped entities from error to warning
      "react/no-unescaped-entities": "warn",

      // Change missing display name from error to warning
      "react/display-name": "warn",

      // Change explicit any from error to warning to prevent build failures
      "@typescript-eslint/no-explicit-any": "warn",

      // Keep React hooks rules as warnings since they can cause subtle bugs
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
