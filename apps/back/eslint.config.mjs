// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ["**/*.{js,cjs,mjs}"],
        extends: [tseslint.configs.disableTypeChecked],
    },
    {
        rules: {
            "@typescript-eslint/restrict-template-expressions": "off",
        },
    },
    { ignores: ["dist"] },
);
