import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-minification';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

function bundleHandler(input, output) {
    return {
        input,
        output: {
            file: output,
            sourcemap: true,
            format: 'es'
        },
        plugins: [
            typescript(),
            resolve({exportConditions: ['node'], preferBuiltins: true}),
            commonjs(),
            terser(),
            json()
        ]
    };
}

export default [
    bundleHandler('src/rest-api/rest-api-handler.ts', 'build/rest-api-handler.mjs'),
];
