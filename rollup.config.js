import node from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/js/test.ts',
  output: [
    {
      name: 'bert_sentiment_tfjs',
      file: 'public/js/main.js',
      format: 'iife',
    },
  ],
  plugins: [
    typescript({
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          module: 'ES2015',
          noUnusedLocals: false
        },
      },
      include: ["src/js/*", "src/@types"],
    }),
    node(),
  ],
}
