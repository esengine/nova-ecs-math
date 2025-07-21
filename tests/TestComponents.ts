import { Component } from './TestComponent';
import { Fixed } from '../src/Fixed';
import { FixedVector2 } from '../src/FixedVector2';

/**
 * Test version of FixedPositionComponent using test Component base class
 */
export class TestFixedPositionComponent extends Component {
  public position: FixedVector2;

  constructor(x: Fixed | number = 0, y: Fixed | number = 0) {
    super();
    this.position = new FixedVector2(x, y);
  }

  get x(): Fixed {
    return this.position.x;
  }

  set x(value: Fixed | number) {
    this.position.x = value instanceof Fixed ? value : new Fixed(value);
  }

  get y(): Fixed {
    return this.position.y;
  }

  set y(value: Fixed | number) {
    this.position.y = value instanceof Fixed ? value : new Fixed(value);
  }

  setPosition(x: Fixed | number, y: Fixed | number): void {
    this.position.x = x instanceof Fixed ? x : new Fixed(x);
    this.position.y = y instanceof Fixed ? y : new Fixed(y);
  }

  setPositionFromVector(vector: FixedVector2): void {
    this.position = vector.clone();
  }

  reset(): void {
    this.position = FixedVector2.ZERO.clone();
  }

  getSerializableProperties(): Record<string, unknown> {
    return {
      ...super.getSerializableProperties(),
      x: this.position.x.toNumber(),
      y: this.position.y.toNumber()
    };
  }

  setSerializableProperties(properties: Record<string, unknown>): void {
    super.setSerializableProperties(properties);
    if (typeof properties.x === 'number' && typeof properties.y === 'number') {
      this.position = new FixedVector2(properties.x, properties.y);
    }
  }
}

/**
 * Test version of FixedVelocityComponent using test Component base class
 */
export class TestFixedVelocityComponent extends Component {
  public velocity: FixedVector2;

  constructor(x: Fixed | number = 0, y: Fixed | number = 0) {
    super();
    this.velocity = new FixedVector2(x, y);
  }

  get x(): Fixed {
    return this.velocity.x;
  }

  set x(value: Fixed | number) {
    this.velocity.x = value instanceof Fixed ? value : new Fixed(value);
  }

  get y(): Fixed {
    return this.velocity.y;
  }

  set y(value: Fixed | number) {
    this.velocity.y = value instanceof Fixed ? value : new Fixed(value);
  }

  setVelocity(x: Fixed | number, y: Fixed | number): void {
    this.velocity.x = x instanceof Fixed ? x : new Fixed(x);
    this.velocity.y = y instanceof Fixed ? y : new Fixed(y);
  }

  setVelocityFromVector(vector: FixedVector2): void {
    this.velocity = vector.clone();
  }

  reset(): void {
    this.velocity = FixedVector2.ZERO.clone();
  }

  getSerializableProperties(): Record<string, unknown> {
    return {
      ...super.getSerializableProperties(),
      x: this.velocity.x.toNumber(),
      y: this.velocity.y.toNumber()
    };
  }

  setSerializableProperties(properties: Record<string, unknown>): void {
    super.setSerializableProperties(properties);
    if (typeof properties.x === 'number' && typeof properties.y === 'number') {
      this.velocity = new FixedVector2(properties.x, properties.y);
    }
  }
}

/**
 * Test version of FixedAccelerationComponent using test Component base class
 */
export class TestFixedAccelerationComponent extends Component {
  public acceleration: FixedVector2;

  constructor(x: Fixed | number = 0, y: Fixed | number = 0) {
    super();
    this.acceleration = new FixedVector2(x, y);
  }

  get x(): Fixed {
    return this.acceleration.x;
  }

  set x(value: Fixed | number) {
    this.acceleration.x = value instanceof Fixed ? value : new Fixed(value);
  }

  get y(): Fixed {
    return this.acceleration.y;
  }

  set y(value: Fixed | number) {
    this.acceleration.y = value instanceof Fixed ? value : new Fixed(value);
  }

  setAcceleration(x: Fixed | number, y: Fixed | number): void {
    this.acceleration.x = x instanceof Fixed ? x : new Fixed(x);
    this.acceleration.y = y instanceof Fixed ? y : new Fixed(y);
  }

  setAccelerationFromVector(vector: FixedVector2): void {
    this.acceleration = vector.clone();
  }

  reset(): void {
    this.acceleration = FixedVector2.ZERO.clone();
  }

  getSerializableProperties(): Record<string, unknown> {
    return {
      ...super.getSerializableProperties(),
      x: this.acceleration.x.toNumber(),
      y: this.acceleration.y.toNumber()
    };
  }

  setSerializableProperties(properties: Record<string, unknown>): void {
    super.setSerializableProperties(properties);
    if (typeof properties.x === 'number' && typeof properties.y === 'number') {
      this.acceleration = new FixedVector2(properties.x, properties.y);
    }
  }
}
