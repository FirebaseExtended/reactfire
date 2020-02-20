import resolve from '@rollup/plugin-node-resolve';

export default {
  input: './pub/reactfire/index.js',
  output: {
    dir: './pub/reactfire/cjs',
    format: 'cjs',
    name: 'reactfire'
  },
  external: [
    'react',
    'firebase/app',
    'rxfire/auth',
    'rxfire/database',
    'rxfire/firestore',
    'rxfire/storage',
    'rxjs',
    'rxjs/operators',
    'tslib'
  ],
  plugins: [resolve()],
  inlineDynamicImports: true
};
