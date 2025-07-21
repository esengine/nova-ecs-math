# @esengine/nova-ecs-math

A comprehensive fixed-point mathematics library providing deterministic mathematical operations for game development and simulations. Compatible with [NovaECS](https://github.com/esengine/NovaECS) and other frameworks.

一个全面的定点数学库，为游戏开发和仿真提供确定性数学运算。兼容 [NovaECS](https://github.com/esengine/NovaECS) 和其他框架。

[![npm version](https://badge.fury.io/js/%40esengine%2Fnova-ecs-math.svg)](https://badge.fury.io/js/%40esengine%2Fnova-ecs-math)
[![CI](https://github.com/esengine/nova-ecs-math/workflows/CI/badge.svg)](https://github.com/esengine/nova-ecs-math/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)

## API Documentation | API 文档

For complete API documentation, visit: [https://esengine.github.io/nova-ecs-math/](https://esengine.github.io/nova-ecs-math/)

完整的API文档请访问：[https://esengine.github.io/nova-ecs-math/](https://esengine.github.io/nova-ecs-math/)

## Features | 特性

- **Fixed-point arithmetic | 定点数运算**: Deterministic mathematical operations including trigonometric, logarithmic, and power functions | 确定性数学运算，包括三角函数、对数函数和幂函数
- **Vector mathematics | 向量数学**: 2D vector operations with fixed-point precision | 基于定点数精度的2D向量运算
- **Matrix transformations | 矩阵变换**: 2x2 matrices for rotation, scaling, shearing, and general linear transformations | 用于旋转、缩放、剪切和一般线性变换的2x2矩阵
- **Complete math library | 完整数学库**: Square root, trigonometry, inverse trigonometry, exponentials, and utility functions | 平方根、三角函数、反三角函数、指数函数和实用函数
- **Performance optimized | 性能优化**: In-place operations and object caching for reduced GC pressure | 就地操作和对象缓存以减少GC压力
- **ECS ready | ECS就绪**: Optional components for Entity-Component-System architectures | 为实体组件系统架构提供可选组件
- **TypeScript support | TypeScript支持**: Full type safety and IntelliSense | 完整的类型安全和智能提示
- **Zero dependencies | 零依赖**: Lightweight and efficient | 轻量且高效

## Installation | 安装

```bash
npm install @esengine/nova-ecs-math
```

For use with NovaECS (optional) | 与NovaECS一起使用（可选）:
```bash
npm install @esengine/nova-ecs-math @esengine/nova-ecs
```

## Quick Start | 快速开始

```typescript
import { Fixed, FixedVector2, FixedMatrix2x2, FixedPositionComponent } from '@esengine/nova-ecs-math';

// Create fixed-point numbers | 创建定点数
const a = new Fixed(3.14159);
const b = new Fixed(2.71828);
const result = a.multiply(b);

// Create fixed-point vectors | 创建定点向量
const position = new FixedVector2(10, 20);
const velocity = new FixedVector2(1, -0.5);
const newPosition = position.add(velocity);

// Create 2x2 matrices for transformations | 创建2x2矩阵用于变换
const rotation = FixedMatrix2x2.rotation(Fixed.PI_4); // 45 degree rotation
const scaling = FixedMatrix2x2.scaling(new Fixed(2)); // 2x uniform scaling
const transformed = rotation.transformVector(position);

// Create components for ECS systems | 为ECS系统创建组件
const positionComponent = new FixedPositionComponent(100, 200);
const velocityComponent = new FixedVelocityComponent(5, -2);
```

## Core Classes | 核心类

### Fixed Class | Fixed类

Represents a fixed-point number with deterministic arithmetic operations.

表示具有确定性算术运算的定点数。

```typescript
const fixed = new Fixed(3.14159);
const result = fixed.add(new Fixed(2.0)).multiply(new Fixed(0.5));

// Deterministic square root | 确定性平方根
const sqrt = new Fixed(4).sqrt(); // 2.0

// Deterministic trigonometric functions | 确定性三角函数
const angle = Fixed.PI_4; // π/4 (45 degrees)
const sin = angle.sin();   // √2/2
const cos = angle.cos();   // √2/2
const tan = angle.tan();   // 1.0

// Inverse trigonometric functions | 反三角函数
const asin = new Fixed(0.5).asin(); // π/6
const acos = new Fixed(0.5).acos(); // π/3
const atan = Fixed.ONE.atan();      // π/4

// Advanced mathematical functions | 高级数学函数
const power = new Fixed(2).pow(new Fixed(3)); // 8.0
const log = Fixed.E.ln();                     // 1.0
const exp = Fixed.ONE.exp();                  // e

// Rounding and fractional functions | 取整和小数函数
const floored = new Fixed(3.7).floor();      // 3.0
const ceiled = new Fixed(3.2).ceil();        // 4.0
const rounded = new Fixed(3.6).round();      // 4.0
const fractional = new Fixed(3.7).frac();    // 0.7

// Utility functions | 实用函数
const min = Fixed.min(new Fixed(3), new Fixed(5)); // 3
const max = Fixed.max(new Fixed(3), new Fixed(5)); // 5
const clamped = new Fixed(15).clamp(new Fixed(0), new Fixed(10)); // 10
const remainder = new Fixed(7).mod(new Fixed(3)); // 1 (modulo operation)

// Performance optimized in-place operations | 性能优化的就地操作
const value = new Fixed(10);
value.addInPlace(new Fixed(5)).multiplyInPlace(new Fixed(2)); // value is now 30

// Cached values for better performance | 缓存值以提高性能
const cached = Fixed.cached(1.5); // Reuses same instance for common values
```

### FixedVector2 Class | FixedVector2类

Represents a 2D vector using fixed-point arithmetic.

表示使用定点算术的2D向量。

```typescript
const vector = new FixedVector2(10, 20);
const normalized = vector.normalize();
const magnitude = vector.magnitude(); // Uses deterministic sqrt

// Vector angles using deterministic trigonometry | 使用确定性三角学的向量角度
const angle = vector.angle(); // Get angle from positive X axis | 获取相对于正X轴的角度
const vectorFromAngle = FixedVector2.fromAngle(Fixed.PI_4, new Fixed(5)); // Create vector from angle

// Angle between vectors | 向量间角度
const a = new FixedVector2(1, 0);
const b = new FixedVector2(0, 1);
const angleBetween = FixedVector2.angle(a, b); // π/2 (90 degrees)

// Performance optimized in-place operations | 性能优化的就地操作
const velocity = new FixedVector2(5, 3);
velocity.addInPlace(new FixedVector2(1, -1)); // velocity is now (6, 2)

// Object reuse for better performance | 对象重用以提高性能
const reusableVector = new FixedVector2();
reusableVector.set(10, 20).multiplyInPlace(2); // (20, 40)
```

### FixedMatrix2x2 Class | FixedMatrix2x2类

Represents a 2x2 matrix using fixed-point arithmetic for deterministic transformations.

表示使用定点算术的2x2矩阵，用于确定性变换。

```typescript
// Create matrices | 创建矩阵
const identity = FixedMatrix2x2.identity();
const rotation = FixedMatrix2x2.rotation(Fixed.PI_4); // 45° rotation
const scaling = FixedMatrix2x2.scaling(new Fixed(2), new Fixed(3)); // Non-uniform scaling
const shear = FixedMatrix2x2.shear(new Fixed(0.5), Fixed.ZERO); // Shear transformation

// Matrix operations | 矩阵运算
const combined = rotation.multiply(scaling); // Combine transformations
const inverse = combined.inverse(); // Get inverse transformation
const determinant = combined.determinant(); // Calculate determinant

// Transform vectors | 变换向量
const point = new FixedVector2(10, 5);
const rotatedPoint = rotation.transformVector(point);
const scaledPoint = scaling.transformVector(point);

// Matrix properties | 矩阵属性
const isIdentity = matrix.isIdentity();
const transposed = matrix.transpose();
const matrixArray = matrix.toArray(); // [m00, m01, m10, m11]
```

### Components | 组件

- `FixedPositionComponent`: Position component using fixed-point vectors | 使用定点向量的位置组件
- `FixedVelocityComponent`: Velocity component using fixed-point vectors | 使用定点向量的速度组件
- `FixedAccelerationComponent`: Acceleration component using fixed-point vectors | 使用定点向量的加速度组件

## Development | 开发

### Prerequisites | 前置要求

- Node.js >= 16
- npm >= 7

### Setup | 设置

```bash
git clone https://github.com/esengine/nova-ecs-math.git
cd nova-ecs-math
npm install
```

### Scripts | 脚本

```bash
# Run tests | 运行测试
npm test

# Run tests in watch mode | 监视模式运行测试
npm run test:watch

# Run linter | 运行代码检查
npm run lint

# Fix linting issues | 修复代码检查问题
npm run lint:fix

# Build the library | 构建库
npm run build

# Generate documentation | 生成文档
npm run docs
```

### Testing | 测试

The library includes comprehensive tests covering:

该库包含全面的测试，涵盖：

- Fixed-point arithmetic operations | 定点数算术运算
- Vector mathematics | 向量数学
- Component functionality | 组件功能
- Serialization/deserialization | 序列化/反序列化
- Edge cases and error handling | 边界情况和错误处理
- Performance optimizations | 性能优化
- Deterministic calculations | 确定性计算

**Note**: Component tests use test-specific implementations that match standard ECS Component interfaces, ensuring compatibility with various ECS frameworks while avoiding module import issues during testing.

**注意**: 组件测试使用与标准ECS组件接口匹配的测试专用实现，确保与各种ECS框架的兼容性，同时避免测试期间的模块导入问题。

Run tests with coverage:

运行带覆盖率的测试：

```bash
npm run test:coverage
```

### Contributing | 贡献

1. Fork the repository | Fork 仓库
2. Create your feature branch | 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. Make your changes | 进行更改
4. Run tests and linting | 运行测试和代码检查 (`npm run lint && npm test`)
5. Commit your changes | 提交更改 (`git commit -m 'Add some amazing feature'`)
6. Push to the branch | 推送到分支 (`git push origin feature/amazing-feature`)
7. Open a Pull Request | 开启 Pull Request

## Related Projects | 相关项目

- [NovaECS](https://github.com/esengine/NovaECS) - Next-generation Entity Component System framework | 下一代实体组件系统框架

## License | 许可证

MIT
