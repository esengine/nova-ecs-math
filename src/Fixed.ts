/**
 * Fixed-point number implementation for deterministic arithmetic
 * 用于确定性算术的定点数实现
 */
export class Fixed {
  private static readonly SCALE = 1000000;
  private _value: number;

  // Cache for commonly used values to reduce object creation
  // 缓存常用值以减少对象创建
  private static readonly _cache = new Map<number, Fixed>();
  private static readonly MAX_CACHE_SIZE = 1000;

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
   * Create a cached Fixed number for commonly used values
   * 为常用值创建缓存的定点数
   */
  static cached(value: number): Fixed {
    const rawValue = Math.round(value * Fixed.SCALE);

    if (Fixed._cache.has(rawValue)) {
      return Fixed._cache.get(rawValue)!;
    }

    if (Fixed._cache.size >= Fixed.MAX_CACHE_SIZE) {
      // Clear cache when it gets too large
      Fixed._cache.clear();
    }

    const fixed = Fixed.fromRaw(rawValue);
    Fixed._cache.set(rawValue, fixed);
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
   * Add in place (modifies this instance for better performance)
   * 就地相加（修改当前实例以提高性能）
   */
  addInPlace(other: Fixed): Fixed {
    this._value += other._value;
    return this;
  }

  /**
   * Subtract two fixed-point numbers
   * 两个定点数相减
   */
  subtract(other: Fixed): Fixed {
    return Fixed.fromRaw(this._value - other._value);
  }

  /**
   * Subtract in place (modifies this instance for better performance)
   * 就地相减（修改当前实例以提高性能）
   */
  subtractInPlace(other: Fixed): Fixed {
    this._value -= other._value;
    return this;
  }

  /**
   * Multiply two fixed-point numbers
   * 两个定点数相乘
   */
  multiply(other: Fixed): Fixed {
    return Fixed.fromRaw(Math.round((this._value * other._value) / Fixed.SCALE));
  }

  /**
   * Multiply in place (modifies this instance for better performance)
   * 就地相乘（修改当前实例以提高性能）
   */
  multiplyInPlace(other: Fixed): Fixed {
    this._value = Math.round((this._value * other._value) / Fixed.SCALE);
    return this;
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
   * Divide in place (modifies this instance for better performance)
   * 就地相除（修改当前实例以提高性能）
   */
  divideInPlace(other: Fixed): Fixed {
    if (other._value === 0) {
      throw new Error('Division by zero');
    }
    this._value = Math.round((this._value * Fixed.SCALE) / other._value);
    return this;
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
   * Calculate square root using Newton's method for deterministic results
   * 使用牛顿迭代法计算平方根，确保确定性结果
   */
  sqrt(): Fixed {
    if (this.lessThan(Fixed.ZERO)) {
      throw new Error('Square root of negative number');
    }

    if (this.equals(Fixed.ZERO)) {
      return Fixed.ZERO;
    }

    if (this.equals(Fixed.ONE)) {
      return Fixed.ONE;
    }

    // Newton's method: x_{n+1} = (x_n + a/x_n) / 2
    // Start with a reasonable initial guess
    let x = this.greaterThan(Fixed.ONE) ? this.divide(Fixed.TWO) : Fixed.ONE;
    let prev: Fixed;

    // Iterate until convergence (max 20 iterations for safety)
    for (let i = 0; i < 20; i++) {
      prev = x;
      // x = (x + this/x) / 2
      x = x.add(this.divide(x)).divide(Fixed.TWO);

      // Check for convergence (difference less than 1/SCALE)
      if (x.subtract(prev).abs().rawValue <= 1) {
        break;
      }
    }

    return x;
  }

  /**
   * Static square root method
   * 静态平方根方法
   */
  static sqrt(value: Fixed): Fixed {
    return value.sqrt();
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
