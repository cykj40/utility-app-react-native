import expo from 'eslint-config-expo';
import prettier from 'eslint-plugin-prettier';
import reactNative from 'eslint-plugin-react-native';

export default [
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ...expo,
        plugins: {
            'react-native': reactNative,
            prettier: prettier,
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                    singleQuote: true,
                    semi: true,
                    tabWidth: 2,
                    trailingComma: 'es5',
                    printWidth: 100,
                },
            ],
            'react-native/no-unused-styles': 'error',
            'no-unused-vars': 'warn',
            'no-multiple-empty-lines': ['error', { max: 2 }],
        },
    },
]; 