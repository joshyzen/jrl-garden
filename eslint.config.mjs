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
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**",
    ],
  },
  {
    rules: {
      // Allow 'any' type for rapid development - TODO: gradually remove these
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Allow unused vars in some cases (like destructuring with _)
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      
      // Allow unescaped entities in JSX (quotes, apostrophes)
      "react/no-unescaped-entities": "warn",
      
      // Allow HTML links for now (can migrate to Link later)
      "@next/next/no-html-link-for-pages": "warn",
      
      // Allow img tags (can migrate to Image later)
      "@next/next/no-img-element": "warn",
    }
  }
];

export default eslintConfig;
