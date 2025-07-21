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
   * Add in place (modifies this instance for better performance)
   * 就地相加（修改当前实例以提高性能）
   */
  addInPlace(other: FixedVector2): FixedVector2 {
    this.x.addInPlace(other.x);
    this.y.addInPlace(other.y);
    return this;
  }

  /**
   * Subtract two vectors
   * 两个向量相减
   */
  subtract(other: FixedVector2): FixedVector2 {
    return new FixedVector2(this.x.subtract(other.x), this.y.subtract(other.y));
  }

  /**
   * Subtract in place (modifies this instance for better performance)
   * 就地相减（修改当前实例以提高性能）
   */
  subtractInPlace(other: FixedVector2): FixedVector2 {
    this.x.subtractInPlace(other.x);
    this.y.subtractInPlace(other.y);
    return this;
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
   * Multiply in place (modifies this instance for better performance)
   * 就地相乘（修改当前实例以提高性能）
   */
  multiplyInPlace(scalar: Fixed | number): FixedVector2 {
    const scalarFixed = scalar instanceof Fixed ? scalar : new Fixed(scalar);
    this.x.multiplyInPlace(scalarFixed);
    this.y.multiplyInPlace(scalarFixed);
    return this;
  }

  /**
   * Divide vector by a scalar
   * 向量除以标量
   */
  divide(scalar: Fixed | number): FixedVector2 {
    const scalarFixed = scalar instanceof Fixed ? scalar : new Fixed(scalar);
    if (scalarFixed.equals(Fixed.ZERO)) {
      throw new Error('Division by zero vector');
    }
    return new FixedVector2(this.x.divide(scalarFixed), this.y.divide(scalarFixed));
  }

  /**
   * Divide in place (modifies this instance for better performance)
   * 就地相除（修改当前实例以提高性能）
   */
  divideInPlace(scalar: Fixed | number): FixedVector2 {
    const scalarFixed = scalar instanceof Fixed ? scalar : new Fixed(scalar);
    if (scalarFixed.equals(Fixed.ZERO)) {
      throw new Error('Division by zero vector');
    }
    this.x.divideInPlace(scalarFixed);
    this.y.divideInPlace(scalarFixed);
    return this;
  }

  /**
   * Calculate the magnitude (length) of the vector
   * 计算向量的大小（长度）
   */
  magnitude(): Fixed {
    const sqrMagnitude = this.x.multiply(this.x).add(this.y.multiply(this.y));
    return sqrMagnitude.sqrt();
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

  /**
   * Set this vector's components from another vector (for reusing objects)
   * 从另一个向量设置此向量的分量（用于重用对象）
   */
  setFrom(other: FixedVector2): FixedVector2 {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  /**
   * Set this vector's components from coordinates (for reusing objects)
   * 从坐标设置此向量的分量（用于重用对象）
   */
  set(x: Fixed | number, y: Fixed | number): FixedVector2 {
    this.x = x instanceof Fixed ? x : new Fixed(x);
    this.y = y instanceof Fixed ? y : new Fixed(y);
    return this;
  }

  /**
   * Reset this vector to zero (for object pooling)
   * 将此向量重置为零（用于对象池）
   */
  reset(): FixedVector2 {
    this.x = Fixed.ZERO;
    this.y = Fixed.ZERO;
    return this;
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
    return new FixedVector2(
      Fixed.lerp(a.x, b.x, tFixed),
      Fixed.lerp(a.y, b.y, tFixed)
    );
  }

  /**
   * Calculate angle between two vectors in radians using deterministic math
   * 使用确定性数学计算两个向量之间的角度（弧度）
   */
  static angle(a: FixedVector2, b: FixedVector2): Fixed {
    const dot = a.dot(b);
    const magnitudes = a.magnitude().multiply(b.magnitude());
    if (magnitudes.equals(Fixed.ZERO)) {
      return Fixed.ZERO;
    }
    const cosAngle = dot.divide(magnitudes);

    // Clamp to [-1, 1] to avoid domain errors
    const clampedCos = cosAngle.clamp(new Fixed(-1), Fixed.ONE);
    return clampedCos.acos();
  }

  /**
   * Get the angle of this vector from the positive X axis
   * 获取此向量相对于正X轴的角度
   */
  angle(): Fixed {
    return Fixed.atan2(this.y, this.x);
  }

  /**
   * Reflect this vector across a normal vector
   * 沿法向量反射此向量
   *
   * @param normal - The normal vector to reflect across (should be normalized)
   * @returns The reflected vector
   */
  reflect(normal: FixedVector2): FixedVector2 {
    // Formula: v - 2 * (v · n) * n
    const dotProduct = this.dot(normal);
    const reflection = normal.multiply(dotProduct.multiply(new Fixed(2)));
    return this.subtract(reflection);
  }

  /**
   * Project this vector onto another vector
   * 将此向量投影到另一个向量上
   *
   * @param onto - The vector to project onto
   * @returns The projected vector
   */
  project(onto: FixedVector2): FixedVector2 {
    // Formula: (v · u) / (u · u) * u
    const dotProduct = this.dot(onto);
    const ontoLengthSquared = onto.dot(onto);

    if (ontoLengthSquared.equals(Fixed.ZERO)) {
      return FixedVector2.ZERO;
    }

    const scalar = dotProduct.divide(ontoLengthSquared);
    return onto.multiply(scalar);
  }

  /**
   * Get the component of this vector perpendicular to another vector
   * 获取此向量垂直于另一个向量的分量
   *
   * @param onto - The vector to get the perpendicular component relative to
   * @returns The perpendicular component
   */
  reject(onto: FixedVector2): FixedVector2 {
    // Formula: v - project(v, onto)
    return this.subtract(this.project(onto));
  }

  /**
   * Rotate this vector by the given angle in radians
   * 将此向量按给定角度（弧度）旋转
   *
   * @param angle - Angle in radians
   * @returns The rotated vector
   */
  rotate(angle: Fixed | number): FixedVector2 {
    const a = angle instanceof Fixed ? angle : new Fixed(angle);
    const cos = a.cos();
    const sin = a.sin();

    const newX = this.x.multiply(cos).subtract(this.y.multiply(sin));
    const newY = this.x.multiply(sin).add(this.y.multiply(cos));

    return new FixedVector2(newX, newY);
  }

  /**
   * Get a vector perpendicular to this one (rotated 90 degrees counter-clockwise)
   * 获取垂直于此向量的向量（逆时针旋转90度）
   */
  perpendicular(): FixedVector2 {
    return new FixedVector2(this.y.negate(), this.x);
  }

  /**
   * Get the right perpendicular vector (rotated 90 degrees clockwise)
   * 获取右垂直向量（顺时针旋转90度）
   */
  perpendicularRight(): FixedVector2 {
    return new FixedVector2(this.y, this.x.negate());
  }

  /**
   * Create a vector from angle and magnitude
   * 从角度和大小创建向量
   */
  static fromAngle(angle: Fixed, magnitude: Fixed = Fixed.ONE): FixedVector2 {
    return new FixedVector2(
      angle.cos().multiply(magnitude),
      angle.sin().multiply(magnitude)
    );
  }
}
