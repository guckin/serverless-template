import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

function bundleHandler(path) {
    return {
        input: `src/${path}.ts`,
        output: {
            file: `build/${path}.js`,
            sourcemap: true
        },
        plugins: [
            typescript({
                compilerOptions: {
                    target: 'ES2020',
                    module: 'esnext',
                    moduleResolution: 'node'
                }
            }),
            resolve({exportConditions: ["node"]}),
            commonjs(),
            terser(),
            json()
        ],
    };
}

export default [
    bundleHandler('hello-world-handler'),
];