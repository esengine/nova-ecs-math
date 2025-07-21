/**
 * Fixed-point number implementation for deterministic arithmetic
 * 用于确定性算术的定点数实现
 */
export class Fixed {
  private static readonly SCALE = 1000000;
  private _value: number;

  /**
   * Create a new Fixed-point number
   * 创建新的定点数
   * 
   * @param value - The value to convert to fixed-point
   */
  constructor(value: number | string | Fixed) {
    if (value instanceof Fixed) {
      this._value = value._value;
    } else if (typeof value === 'string') {
      this._value = Math.round(parseFloat(value) * Fixed.SCALE);
    } else {
      this._value = Math.round(value * Fixed.SCALE);
    }
  }

  /**
   * Create a Fixed number from raw internal value
   * 从原始内部值创建定点数
   */
  static fromRaw(rawValue: number): Fixed {
    const fixed = new Fixed(0);
    fixed._value = rawValue;
    return fixed;
  }

  /**
   * Add two fixed-point numbers
   * 两个定点数相加
   */
  add(other: Fixed): Fixed {
    return Fixed.fromRaw(this._value + other._value);
  }

  /**
   * Subtract two fixed-point numbers
   * 两个定点数相减
   */
  subtract(other: Fixed): Fixed {
    return Fixed.fromRaw(this._value - other._value);
  }

  /**
   * Multiply two fixed-point numbers
   * 两个定点数相乘
   */
  multiply(other: Fixed): Fixed {
    return Fixed.fromRaw(Math.round((this._value * other._value) / Fixed.SCALE));
  }

  /**
   * Divide two fixed-point numbers
   * 两个定点数相除
   */
  divide(other: Fixed): Fixed {
    if (other._value === 0) {
      throw new Error('Division by zero');
    }
    return Fixed.fromRaw(Math.round((this._value * Fixed.SCALE) / other._value));
  }

  /**
   * Get the absolute value
   * 获取绝对值
   */
  abs(): Fixed {
    return Fixed.fromRaw(Math.abs(this._value));
  }

  /**
   * Negate the value
   * 取负值
   */
  negate(): Fixed {
    return Fixed.fromRaw(-this._value);
  }

  /**
   * Convert to regular number
   * 转换为普通数字
   */
  toNumber(): number {
    return this._value / Fixed.SCALE;
  }

  /**
   * Convert to string representation
   * 转换为字符串表示
   */
  toString(): string {
    return this.toNumber().toString();
  }

  /**
   * Check equality with another Fixed number
   * 检查与另一个定点数是否相等
   */
  equals(other: Fixed): boolean {
    return this._value === other._value;
  }

  /**
   * Check if this number is less than another
   * 检查是否小于另一个数
   */
  lessThan(other: Fixed): boolean {
    return this._value < other._value;
  }

  /**
   * Check if this number is less than or equal to another
   * 检查是否小于或等于另一个数
   */
  lessThanOrEqual(other: Fixed): boolean {
    return this._value <= other._value;
  }

  /**
   * Check if this number is greater than another
   * 检查是否大于另一个数
   */
  greaterThan(other: Fixed): boolean {
    return this._value > other._value;
  }

  /**
   * Check if this number is greater than or equal to another
   * 检查是否大于或等于另一个数
   */
  greaterThanOrEqual(other: Fixed): boolean {
    return this._value >= other._value;
  }

  /**
   * Get the raw internal value (for advanced usage)
   * 获取原始内部值（高级用法）
   */
  get rawValue(): number {
    return this._value;
  }

  /**
   * Get the scale factor used for fixed-point arithmetic
   * 获取用于定点算术的比例因子
   */
  static get scale(): number {
    return Fixed.SCALE;
  }

  // Static constants
  static readonly ZERO = new Fixed(0);
  static readonly ONE = new Fixed(1);
  static readonly PI = new Fixed(Math.PI);
  static readonly E = new Fixed(Math.E);
  static readonly HALF = new Fixed(0.5);
  static readonly TWO = new Fixed(2);
}
