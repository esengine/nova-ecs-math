import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

const external = ['@esengine/nova-ecs'];

export default [
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/nova-ecs-math.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ],
    external
  },
  // UMD build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/nova-ecs-math.umd.js',
      format: 'umd',
      name: 'NovaECSMath',
      sourcemap: true,
      globals: {
        '@esengine/nova-ecs': 'NovaECS'
      },
      paths: {
        '@esengine/nova-ecs': '../NovaECS/dist/nova-ecs.esm.js'
      }
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ],
    external
  },
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/nova-ecs-math.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ],
    external
  },
  // TypeScript declarations
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/nova-ecs-math.d.ts',
      format: 'es'
    },
    plugins: [dts()],
    external
  }
];
