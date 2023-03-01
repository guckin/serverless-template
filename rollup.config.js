import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

function bundleHandler(input, output) {
    return {
        input,
        output: {
            file: output,
            sourcemap: true
        },
        plugins: [
            typescript(),
            resolve({exportConditions: ["node"]}),
            commonjs(),
            terser(),
            json()
        ],
    };
}

export default [
    bundleHandler('src/hello-world-handler.ts', 'build/hello-world-handler.js'),
];
