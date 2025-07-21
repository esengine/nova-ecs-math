import { Fixed } from './Fixed';

/**
 * 2D Vector using fixed-point arithmetic for deterministic calculations
 * 使用定点算术的2D向量，用于确定性计算
 */
export class FixedVector2 {
  public x: Fixed;
  public y: Fixed;

  /**
   * Create a new 2D fixed-point vector
   * 创建新的2D定点向量
   * 
   * @param x - X component (can be Fixed or number)
   * @param y - Y component (can be Fixed or number)
   */
  constructor(x: Fixed | number = 0, y: Fixed | number = 0) {
    this.x = x instanceof Fixed ? x : new Fixed(x);
    this.y = y instanceof Fixed ? y : new Fixed(y);
  }

  /**
   * Add two vectors
   * 两个向量相加
   */
  add(other: FixedVector2): FixedVector2 {
    return new FixedVector2(this.x.add(other.x), this.y.add(other.y));
  }

  /**
   * Subtract two vectors
   * 两个向量相减
   */
  subtract(other: FixedVector2): FixedVector2 {
    return new FixedVector2(this.x.subtract(other.x), this.y.subtract(other.y));
  }

  /**
   * Multiply vector by a scalar
   * 向量乘以标量
   */
  multiply(scalar: Fixed | number): FixedVector2 {
    const scalarFixed = scalar instanceof Fixed ? scalar : new Fixed(scalar);
    return new FixedVector2(this.x.multiply(scalarFixed), this.y.multiply(scalarFixed));
  }

  /**
   * Divide vector by a scalar
   * 向量除以标量
   */
  divide(scalar: Fixed | number): FixedVector2 {
    const scalarFixed = scalar instanceof Fixed ? scalar : new Fixed(scalar);
    return new FixedVector2(this.x.divide(scalarFixed), this.y.divide(scalarFixed));
  }

  /**
   * Calculate the magnitude (length) of the vector
   * 计算向量的大小（长度）
   */
  magnitude(): Fixed {
    const sqrMagnitude = this.x.multiply(this.x).add(this.y.multiply(this.y));
    return new Fixed(Math.sqrt(sqrMagnitude.toNumber()));
  }

  /**
   * Calculate the squared magnitude (more efficient than magnitude)
   * 计算平方大小（比magnitude更高效）
   */
  sqrMagnitude(): Fixed {
    return this.x.multiply(this.x).add(this.y.multiply(this.y));
  }

  /**
   * Normalize the vector (make it unit length)
   * 归一化向量（使其长度为1）
   */
  normalize(): FixedVector2 {
    const mag = this.magnitude();
    if (mag.equals(Fixed.ZERO)) {
      return new FixedVector2(Fixed.ZERO, Fixed.ZERO);
    }
    return new FixedVector2(this.x.divide(mag), this.y.divide(mag));
  }

  /**
   * Calculate dot product with another vector
   * 计算与另一个向量的点积
   */
  dot(other: FixedVector2): Fixed {
    return this.x.multiply(other.x).add(this.y.multiply(other.y));
  }

  /**
   * Calculate cross product with another vector (returns scalar for 2D)
   * 计算与另一个向量的叉积（2D返回标量）
   */
  cross(other: FixedVector2): Fixed {
    return this.x.multiply(other.y).subtract(this.y.multiply(other.x));
  }

  /**
   * Calculate distance to another vector
   * 计算到另一个向量的距离
   */
  distance(other: FixedVector2): Fixed {
    return this.subtract(other).magnitude();
  }

  /**
   * Calculate squared distance to another vector (more efficient)
   * 计算到另一个向量的平方距离（更高效）
   */
  sqrDistance(other: FixedVector2): Fixed {
    return this.subtract(other).sqrMagnitude();
  }

  /**
   * Negate the vector
   * 取向量的负值
   */
  negate(): FixedVector2 {
    return new FixedVector2(this.x.negate(), this.y.negate());
  }

  /**
   * Get the absolute values of components
   * 获取分量的绝对值
   */
  abs(): FixedVector2 {
    return new FixedVector2(this.x.abs(), this.y.abs());
  }

  /**
   * Check equality with another vector
   * 检查与另一个向量是否相等
   */
  equals(other: FixedVector2): boolean {
    return this.x.equals(other.x) && this.y.equals(other.y);
  }

  /**
   * Convert to string representation
   * 转换为字符串表示
   */
  toString(): string {
    return `(${this.x.toString()}, ${this.y.toString()})`;
  }

  /**
   * Convert to array [x, y]
   * 转换为数组 [x, y]
   */
  toArray(): [number, number] {
    return [this.x.toNumber(), this.y.toNumber()];
  }

  /**
   * Create a copy of this vector
   * 创建此向量的副本
   */
  clone(): FixedVector2 {
    return new FixedVector2(this.x, this.y);
  }

  // Static constants
  static readonly ZERO = new FixedVector2(0, 0);
  static readonly ONE = new FixedVector2(1, 1);
  static readonly UP = new FixedVector2(0, 1);
  static readonly DOWN = new FixedVector2(0, -1);
  static readonly LEFT = new FixedVector2(-1, 0);
  static readonly RIGHT = new FixedVector2(1, 0);

  /**
   * Linear interpolation between two vectors
   * 两个向量之间的线性插值
   */
  static lerp(a: FixedVector2, b: FixedVector2, t: Fixed | number): FixedVector2 {
    const tFixed = t instanceof Fixed ? t : new Fixed(t);
    const oneMinusT = Fixed.ONE.subtract(tFixed);
    return a.multiply(oneMinusT).add(b.multiply(tFixed));
  }

  /**
   * Calculate angle between two vectors in radians
   * 计算两个向量之间的角度（弧度）
   */
  static angle(a: FixedVector2, b: FixedVector2): Fixed {
    const dot = a.dot(b);
    const magnitudes = a.magnitude().multiply(b.magnitude());
    if (magnitudes.equals(Fixed.ZERO)) {
      return Fixed.ZERO;
    }
    const cosAngle = dot.divide(magnitudes);
    return new Fixed(Math.acos(Math.max(-1, Math.min(1, cosAngle.toNumber()))));
  }
}
