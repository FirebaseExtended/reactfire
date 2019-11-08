import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './pub/reactfire/index.js',
  output: {
    file: './pub/reactfire/bundle.js',
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
    'rxjs/operators'
  ],
  plugins: [resolve()]
};
