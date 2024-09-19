import tseslint from "typescript-eslint";

export default [
    {
        files: ["**/*.{ts}"]
    },
    {
        ignores: ["**/*.{mjs,js,d.ts}", ],
    },
    ...tseslint.configs.recommended,
];

