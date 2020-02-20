import resolve from '@rollup/plugin-node-resolve';

export default {
  input: './pub/reactfire/index.js',
  output: {
    dir: './pub/reactfire/cjs',
    format: 'cjs',
    name: 'reactfire'
  },
  external: id => !id.startsWith('.'),
  plugins: [resolve()]
};
