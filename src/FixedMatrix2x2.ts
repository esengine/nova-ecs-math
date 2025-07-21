import { Fixed } from './Fixed';
import { FixedVector2 } from './FixedVector2';

/**
 * 2x2 Matrix using fixed-point arithmetic for deterministic calculations
 * 使用定点算术的2x2矩阵，用于确定性计算
 * 
 * Matrix layout:
 * | m00  m01 |
 * | m10  m11 |
 */
export class FixedMatrix2x2 {
  public m00: Fixed; // Row 0, Column 0
  public m01: Fixed; // Row 0, Column 1
  public m10: Fixed; // Row 1, Column 0
  public m11: Fixed; // Row 1, Column 1

  /**
   * Create a new 2x2 fixed-point matrix
   * 创建新的2x2定点矩阵
   * 
   * @param m00 - Element at row 0, column 0
   * @param m01 - Element at row 0, column 1
   * @param m10 - Element at row 1, column 0
   * @param m11 - Element at row 1, column 1
   */
  constructor(
    m00: Fixed | number = 1,
    m01: Fixed | number = 0,
    m10: Fixed | number = 0,
    m11: Fixed | number = 1
  ) {
    this.m00 = m00 instanceof Fixed ? m00 : new Fixed(m00);
    this.m01 = m01 instanceof Fixed ? m01 : new Fixed(m01);
    this.m10 = m10 instanceof Fixed ? m10 : new Fixed(m10);
    this.m11 = m11 instanceof Fixed ? m11 : new Fixed(m11);
  }

  /**
   * Create an identity matrix
   * 创建单位矩阵
   */
  static identity(): FixedMatrix2x2 {
    return new FixedMatrix2x2(1, 0, 0, 1);
  }

  /**
   * Create a zero matrix
   * 创建零矩阵
   */
  static zero(): FixedMatrix2x2 {
    return new FixedMatrix2x2(0, 0, 0, 0);
  }

  /**
   * Create a rotation matrix
   * 创建旋转矩阵
   * 
   * @param angle - Rotation angle in radians
   */
  static rotation(angle: Fixed): FixedMatrix2x2 {
    const cos = angle.cos();
    const sin = angle.sin();
    return new FixedMatrix2x2(cos, sin.negate(), sin, cos);
  }

  /**
   * Create a scaling matrix
   * 创建缩放矩阵
   * 
   * @param scaleX - Scale factor for X axis
   * @param scaleY - Scale factor for Y axis (defaults to scaleX for uniform scaling)
   */
  static scaling(scaleX: Fixed, scaleY?: Fixed): FixedMatrix2x2 {
    const sy = scaleY || scaleX;
    return new FixedMatrix2x2(scaleX, Fixed.ZERO, Fixed.ZERO, sy);
  }

  /**
   * Create a shear matrix
   * 创建剪切矩阵
   *
   * @param shearX - Shear factor for X axis
   * @param shearY - Shear factor for Y axis
   */
  static shear(shearX: Fixed, shearY: Fixed): FixedMatrix2x2 {
    return new FixedMatrix2x2(Fixed.ONE, shearX, shearY, Fixed.ONE);
  }

  /**
   * Create a matrix from an array [m00, m01, m10, m11]
   * 从数组创建矩阵 [m00, m01, m10, m11]
   */
  static fromArray(array: number[]): FixedMatrix2x2 {
    if (array.length !== 4) {
      throw new Error('Array must have exactly 4 elements');
    }
    return new FixedMatrix2x2(array[0], array[1], array[2], array[3]);
  }

  /**
   * Add two matrices
   * 两个矩阵相加
   */
  add(other: FixedMatrix2x2): FixedMatrix2x2 {
    return new FixedMatrix2x2(
      this.m00.add(other.m00),
      this.m01.add(other.m01),
      this.m10.add(other.m10),
      this.m11.add(other.m11)
    );
  }

  /**
   * Add in place (modifies this instance for better performance)
   * 就地相加（修改当前实例以提高性能）
   */
  addInPlace(other: FixedMatrix2x2): FixedMatrix2x2 {
    this.m00.addInPlace(other.m00);
    this.m01.addInPlace(other.m01);
    this.m10.addInPlace(other.m10);
    this.m11.addInPlace(other.m11);
    return this;
  }

  /**
   * Subtract two matrices
   * 两个矩阵相减
   */
  subtract(other: FixedMatrix2x2): FixedMatrix2x2 {
    return new FixedMatrix2x2(
      this.m00.subtract(other.m00),
      this.m01.subtract(other.m01),
      this.m10.subtract(other.m10),
      this.m11.subtract(other.m11)
    );
  }

  /**
   * Subtract in place (modifies this instance for better performance)
   * 就地相减（修改当前实例以提高性能）
   */
  subtractInPlace(other: FixedMatrix2x2): FixedMatrix2x2 {
    this.m00.subtractInPlace(other.m00);
    this.m01.subtractInPlace(other.m01);
    this.m10.subtractInPlace(other.m10);
    this.m11.subtractInPlace(other.m11);
    return this;
  }

  /**
   * Multiply two matrices
   * 两个矩阵相乘
   */
  multiply(other: FixedMatrix2x2): FixedMatrix2x2 {
    return new FixedMatrix2x2(
      this.m00.multiply(other.m00).add(this.m01.multiply(other.m10)),
      this.m00.multiply(other.m01).add(this.m01.multiply(other.m11)),
      this.m10.multiply(other.m00).add(this.m11.multiply(other.m10)),
      this.m10.multiply(other.m01).add(this.m11.multiply(other.m11))
    );
  }

  /**
   * Multiply matrix by a scalar
   * 矩阵乘以标量
   */
  multiplyScalar(scalar: Fixed): FixedMatrix2x2 {
    return new FixedMatrix2x2(
      this.m00.multiply(scalar),
      this.m01.multiply(scalar),
      this.m10.multiply(scalar),
      this.m11.multiply(scalar)
    );
  }

  /**
   * Multiply matrix by a scalar in place
   * 就地矩阵乘以标量
   */
  multiplyScalarInPlace(scalar: Fixed): FixedMatrix2x2 {
    this.m00.multiplyInPlace(scalar);
    this.m01.multiplyInPlace(scalar);
    this.m10.multiplyInPlace(scalar);
    this.m11.multiplyInPlace(scalar);
    return this;
  }

  /**
   * Transform a vector by this matrix
   * 使用此矩阵变换向量
   */
  transformVector(vector: FixedVector2): FixedVector2 {
    return new FixedVector2(
      this.m00.multiply(vector.x).add(this.m01.multiply(vector.y)),
      this.m10.multiply(vector.x).add(this.m11.multiply(vector.y))
    );
  }

  /**
   * Calculate the determinant of this matrix
   * 计算此矩阵的行列式
   */
  determinant(): Fixed {
    return this.m00.multiply(this.m11).subtract(this.m01.multiply(this.m10));
  }

  /**
   * Calculate the inverse of this matrix
   * 计算此矩阵的逆矩阵
   */
  inverse(): FixedMatrix2x2 {
    const det = this.determinant();
    if (det.equals(Fixed.ZERO)) {
      throw new Error('Matrix is not invertible (determinant is zero)');
    }

    const invDet = Fixed.ONE.divide(det);
    return new FixedMatrix2x2(
      this.m11.multiply(invDet),
      this.m01.negate().multiply(invDet),
      this.m10.negate().multiply(invDet),
      this.m00.multiply(invDet)
    );
  }

  /**
   * Transpose this matrix
   * 转置此矩阵
   */
  transpose(): FixedMatrix2x2 {
    return new FixedMatrix2x2(this.m00, this.m10, this.m01, this.m11);
  }

  /**
   * Calculate the trace (sum of diagonal elements) of this matrix
   * 计算此矩阵的迹（对角线元素之和）
   */
  trace(): Fixed {
    return this.m00.add(this.m11);
  }

  /**
   * Check if this matrix equals another matrix
   * 检查此矩阵是否等于另一个矩阵
   */
  equals(other: FixedMatrix2x2): boolean {
    return this.m00.equals(other.m00) &&
           this.m01.equals(other.m01) &&
           this.m10.equals(other.m10) &&
           this.m11.equals(other.m11);
  }

  /**
   * Check if this matrix is the identity matrix
   * 检查此矩阵是否为单位矩阵
   */
  isIdentity(): boolean {
    return this.m00.equals(Fixed.ONE) &&
           this.m01.equals(Fixed.ZERO) &&
           this.m10.equals(Fixed.ZERO) &&
           this.m11.equals(Fixed.ONE);
  }

  /**
   * Create a copy of this matrix
   * 创建此矩阵的副本
   */
  clone(): FixedMatrix2x2 {
    return new FixedMatrix2x2(this.m00, this.m01, this.m10, this.m11);
  }

  /**
   * Convert to a regular number array [m00, m01, m10, m11]
   * 转换为普通数字数组 [m00, m01, m10, m11]
   */
  toArray(): number[] {
    return [
      this.m00.toNumber(),
      this.m01.toNumber(),
      this.m10.toNumber(),
      this.m11.toNumber()
    ];
  }

  /**
   * Convert to string representation
   * 转换为字符串表示
   */
  toString(): string {
    return `[${this.m00.toString()}, ${this.m01.toString()}]\n[${this.m10.toString()}, ${this.m11.toString()}]`;
  }

  // Static constants
  static readonly IDENTITY = FixedMatrix2x2.identity();
  static readonly ZERO = FixedMatrix2x2.zero();
}
