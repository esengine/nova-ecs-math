import { Component } from './BaseComponent';
import { Fixed } from './Fixed';
import { FixedVector2 } from './FixedVector2';

/**
 * Position component using fixed-point arithmetic
 * 使用定点算术的位置组件
 */
export class FixedPositionComponent extends Component {
  public position: FixedVector2;

  /**
   * Create a new fixed-point position component
   * 创建新的定点位置组件
   * 
   * @param x - X coordinate (can be Fixed or number)
   * @param y - Y coordinate (can be Fixed or number)
   */
  constructor(x: Fixed | number = 0, y: Fixed | number = 0) {
    super();
    this.position = new FixedVector2(x, y);
  }

  /**
   * Get X coordinate
   * 获取X坐标
   */
  get x(): Fixed {
    return this.position.x;
  }

  /**
   * Set X coordinate
   * 设置X坐标
   */
  set x(value: Fixed | number) {
    this.position.x = value instanceof Fixed ? value : new Fixed(value);
  }

  /**
   * Get Y coordinate
   * 获取Y坐标
   */
  get y(): Fixed {
    return this.position.y;
  }

  /**
   * Set Y coordinate
   * 设置Y坐标
   */
  set y(value: Fixed | number) {
    this.position.y = value instanceof Fixed ? value : new Fixed(value);
  }

  /**
   * Set position from coordinates
   * 从坐标设置位置
   */
  setPosition(x: Fixed | number, y: Fixed | number): void {
    this.position.x = x instanceof Fixed ? x : new Fixed(x);
    this.position.y = y instanceof Fixed ? y : new Fixed(y);
  }

  /**
   * Set position from vector
   * 从向量设置位置
   */
  setPositionFromVector(vector: FixedVector2): void {
    this.position = vector.clone();
  }

  /**
   * Reset component state
   * 重置组件状态
   */
  reset(): void {
    this.position = FixedVector2.ZERO.clone();
  }

  /**
   * Get serializable properties
   * 获取可序列化属性
   */
  getSerializableProperties(): Record<string, unknown> {
    return {
      ...super.getSerializableProperties(),
      x: this.position.x.toNumber(),
      y: this.position.y.toNumber()
    };
  }

  /**
   * Set serializable properties
   * 设置可序列化属性
   */
  setSerializableProperties(properties: Record<string, unknown>): void {
    super.setSerializableProperties(properties);
    if (typeof properties.x === 'number' && typeof properties.y === 'number') {
      this.position = new FixedVector2(properties.x, properties.y);
    }
  }
}

/**
 * Velocity component using fixed-point arithmetic
 * 使用定点算术的速度组件
 */
export class FixedVelocityComponent extends Component {
  public velocity: FixedVector2;

  /**
   * Create a new fixed-point velocity component
   * 创建新的定点速度组件
   * 
   * @param x - X velocity (can be Fixed or number)
   * @param y - Y velocity (can be Fixed or number)
   */
  constructor(x: Fixed | number = 0, y: Fixed | number = 0) {
    super();
    this.velocity = new FixedVector2(x, y);
  }

  /**
   * Get X velocity
   * 获取X速度
   */
  get x(): Fixed {
    return this.velocity.x;
  }

  /**
   * Set X velocity
   * 设置X速度
   */
  set x(value: Fixed | number) {
    this.velocity.x = value instanceof Fixed ? value : new Fixed(value);
  }

  /**
   * Get Y velocity
   * 获取Y速度
   */
  get y(): Fixed {
    return this.velocity.y;
  }

  /**
   * Set Y velocity
   * 设置Y速度
   */
  set y(value: Fixed | number) {
    this.velocity.y = value instanceof Fixed ? value : new Fixed(value);
  }

  /**
   * Set velocity from coordinates
   * 从坐标设置速度
   */
  setVelocity(x: Fixed | number, y: Fixed | number): void {
    this.velocity.x = x instanceof Fixed ? x : new Fixed(x);
    this.velocity.y = y instanceof Fixed ? y : new Fixed(y);
  }

  /**
   * Set velocity from vector
   * 从向量设置速度
   */
  setVelocityFromVector(vector: FixedVector2): void {
    this.velocity = vector.clone();
  }

  /**
   * Reset component state
   * 重置组件状态
   */
  reset(): void {
    this.velocity = FixedVector2.ZERO.clone();
  }

  /**
   * Get serializable properties
   * 获取可序列化属性
   */
  getSerializableProperties(): Record<string, unknown> {
    return {
      ...super.getSerializableProperties(),
      x: this.velocity.x.toNumber(),
      y: this.velocity.y.toNumber()
    };
  }

  /**
   * Set serializable properties
   * 设置可序列化属性
   */
  setSerializableProperties(properties: Record<string, unknown>): void {
    super.setSerializableProperties(properties);
    if (typeof properties.x === 'number' && typeof properties.y === 'number') {
      this.velocity = new FixedVector2(properties.x, properties.y);
    }
  }
}

/**
 * Acceleration component using fixed-point arithmetic
 * 使用定点算术的加速度组件
 */
export class FixedAccelerationComponent extends Component {
  public acceleration: FixedVector2;

  /**
   * Create a new fixed-point acceleration component
   * 创建新的定点加速度组件
   * 
   * @param x - X acceleration (can be Fixed or number)
   * @param y - Y acceleration (can be Fixed or number)
   */
  constructor(x: Fixed | number = 0, y: Fixed | number = 0) {
    super();
    this.acceleration = new FixedVector2(x, y);
  }

  /**
   * Get X acceleration
   * 获取X加速度
   */
  get x(): Fixed {
    return this.acceleration.x;
  }

  /**
   * Set X acceleration
   * 设置X加速度
   */
  set x(value: Fixed | number) {
    this.acceleration.x = value instanceof Fixed ? value : new Fixed(value);
  }

  /**
   * Get Y acceleration
   * 获取Y加速度
   */
  get y(): Fixed {
    return this.acceleration.y;
  }

  /**
   * Set Y acceleration
   * 设置Y加速度
   */
  set y(value: Fixed | number) {
    this.acceleration.y = value instanceof Fixed ? value : new Fixed(value);
  }

  /**
   * Set acceleration from coordinates
   * 从坐标设置加速度
   */
  setAcceleration(x: Fixed | number, y: Fixed | number): void {
    this.acceleration.x = x instanceof Fixed ? x : new Fixed(x);
    this.acceleration.y = y instanceof Fixed ? y : new Fixed(y);
  }

  /**
   * Set acceleration from vector
   * 从向量设置加速度
   */
  setAccelerationFromVector(vector: FixedVector2): void {
    this.acceleration = vector.clone();
  }

  /**
   * Reset component state
   * 重置组件状态
   */
  reset(): void {
    this.acceleration = FixedVector2.ZERO.clone();
  }

  /**
   * Get serializable properties
   * 获取可序列化属性
   */
  getSerializableProperties(): Record<string, unknown> {
    return {
      ...super.getSerializableProperties(),
      x: this.acceleration.x.toNumber(),
      y: this.acceleration.y.toNumber()
    };
  }

  /**
   * Set serializable properties
   * 设置可序列化属性
   */
  setSerializableProperties(properties: Record<string, unknown>): void {
    super.setSerializableProperties(properties);
    if (typeof properties.x === 'number' && typeof properties.y === 'number') {
      this.acceleration = new FixedVector2(properties.x, properties.y);
    }
  }
}
