// @ ts-check
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { string } from 'rollup-plugin-string'
import { terser } from 'rollup-plugin-terser'

// Build notes:
// Ignore the warnings about this, and about the unresolved crypto module. It isn't used.

export default {
    input: 'src/index.ts',
    output: {
        file: 'bot/bundle.js',
        format: 'iife',
        sourcemap: true,
        globals: {
            crypto: 'crypto'
        }
    },
    plugins: [
        resolve(),
        commonjs(),
        string({ include: '**/*.html' }),
        typescript(),
        terser()
    ]
}
