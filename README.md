# @esengine/nova-ecs-math

Fixed-point mathematics library for [NovaECS](https://github.com/esengine/NovaECS) - providing deterministic mathematical operations for game development.

为 [NovaECS](https://github.com/esengine/NovaECS) 提供确定性数学运算的定点数学库，专为游戏开发设计。

[![npm version](https://badge.fury.io/js/%40esengine%2Fnova-ecs-math.svg)](https://badge.fury.io/js/%40esengine%2Fnova-ecs-math)
[![CI](https://github.com/esengine/nova-ecs-math/workflows/CI/badge.svg)](https://github.com/esengine/nova-ecs-math/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)

## API Documentation | API 文档

For complete API documentation, visit: [https://esengine.github.io/nova-ecs-math/](https://esengine.github.io/nova-ecs-math/)

完整的API文档请访问：[https://esengine.github.io/nova-ecs-math/](https://esengine.github.io/nova-ecs-math/)

## Features | 特性

- **Fixed-point arithmetic | 定点数运算**: Deterministic mathematical operations including square root | 确定性数学运算，包括平方根
- **Vector mathematics | 向量数学**: 2D vector operations with fixed-point precision | 基于定点数精度的2D向量运算
- **Performance optimized | 性能优化**: In-place operations and object caching for reduced GC pressure | 就地操作和对象缓存以减少GC压力
- **ECS Components | ECS组件**: Ready-to-use components for [NovaECS](https://github.com/esengine/NovaECS) with object pooling support | 为 [NovaECS](https://github.com/esengine/NovaECS) 准备的即用型组件，支持对象池
- **TypeScript support | TypeScript支持**: Full type safety and IntelliSense | 完整的类型安全和智能提示
- **Zero dependencies | 零依赖**: Lightweight and efficient | 轻量且高效

## Installation | 安装

```bash
npm install @esengine/nova-ecs-math @esengine/nova-ecs
```

## Quick Start | 快速开始

```typescript
import { Fixed, FixedVector2, FixedPositionComponent } from '@esengine/nova-ecs-math';
import { World, Entity } from '@esengine/nova-ecs';

// Create fixed-point numbers | 创建定点数
const a = new Fixed(3.14159);
const b = new Fixed(2.71828);
const result = a.multiply(b);

// Create fixed-point vectors | 创建定点向量
const position = new FixedVector2(10, 20);
const velocity = new FixedVector2(1, -0.5);
const newPosition = position.add(velocity);

// Use with NovaECS | 在NovaECS中使用
const world = new World();
const entity = world.createEntity()
  .addComponent(new FixedPositionComponent(100, 200));

// Object pooling for better performance | 对象池以提高性能
import { ComponentPool } from '@esengine/nova-ecs';

const positionPool = new ComponentPool(
  () => new FixedPositionComponent(),
  { initialSize: 50, maxSize: 200 }
);

const pooledPosition = positionPool.acquire();
pooledPosition.setPosition(100, 200);
// ... use the component
positionPool.release(pooledPosition); // Return to pool when done
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

// Performance optimized in-place operations | 性能优化的就地操作
const velocity = new FixedVector2(5, 3);
velocity.addInPlace(new FixedVector2(1, -1)); // velocity is now (6, 2)

// Object reuse for better performance | 对象重用以提高性能
const reusableVector = new FixedVector2();
reusableVector.set(10, 20).multiplyInPlace(2); // (20, 40)
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

**Note**: Component tests use test-specific implementations that match the NovaECS Component interface exactly, ensuring our components work correctly with the real NovaECS framework while avoiding module import issues during testing.

**注意**: 组件测试使用与NovaECS Component接口完全匹配的测试专用实现，确保我们的组件与真实的NovaECS框架正确工作，同时避免测试期间的模块导入问题。

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
