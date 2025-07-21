/**
 * @esengine/nova-ecs-math - Fixed-point mathematics library for NovaECS
 * 用于NovaECS的定点数学库
 *
 * @packageDocumentation
 */

// Core fixed-point math classes
export { Fixed } from './Fixed';
export { FixedVector2 } from './FixedVector2';
export { FixedMatrix2x2 } from './FixedMatrix2x2';
export { FixedRect } from './FixedRect';

// ECS Components
export {
  FixedPositionComponent,
  FixedVelocityComponent,
  FixedAccelerationComponent
} from './Components';

// Re-export types for convenience
export type { Component, ComponentPool } from '@esengine/nova-ecs';
