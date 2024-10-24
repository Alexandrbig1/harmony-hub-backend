export default {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["standard", "prettier"],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2],

    "max-len": ["error", { code: 80 }],

    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

    semi: ["error", "always"],

    "import/newline-after-import": "error",

    "eol-last": ["error", "always"],

    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
  plugins: ["node", "import"],
};
