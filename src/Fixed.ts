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
   * Normalize angle to [-π, π] range for trigonometric functions
   * 将角度标准化到[-π, π]范围用于三角函数
   */
  private static normalizeAngle(angle: Fixed): Fixed {
    let normalized = new Fixed(angle.toNumber());

    // Reduce to [-π, π] range
    while (normalized.greaterThan(Fixed.PI)) {
      normalized = normalized.subtract(Fixed.TWO_PI);
    }
    while (normalized.lessThanOrEqual(Fixed.PI.negate())) {
      normalized = normalized.add(Fixed.TWO_PI);
    }

    return normalized;
  }

  /**
   * Calculate sine using Taylor series for deterministic results
   * 使用泰勒级数计算正弦值，确保确定性结果
   */
  sin(): Fixed {
    return Fixed.sin(this);
  }

  /**
   * Static sine function using Taylor series
   * 使用泰勒级数的静态正弦函数
   */
  static sin(angle: Fixed): Fixed {
    // 1. 角度标准化到[-π, π]
    const normalizedAngle = Fixed.normalizeAngle(angle);

    // Check lookup table first
    if (Fixed.SIN_TABLE.has(normalizedAngle.rawValue)) {
      return Fixed.SIN_TABLE.get(normalizedAngle.rawValue)!;
    }

    // 2. 利用对称性优化
    let x = normalizedAngle;
    let sign = Fixed.ONE;

    // sin(-x) = -sin(x)
    if (x.lessThan(Fixed.ZERO)) {
      x = x.negate();
      sign = sign.negate();
    }

    // sin(π - x) = sin(x) for x in [π/2, π]
    if (x.greaterThan(Fixed.PI_2)) {
      x = Fixed.PI.subtract(x);
    }

    // 3. 泰勒级数展开（使用预计算的阶乘）
    // sin(x) = x - x³/3! + x⁵/5! - x⁷/7! + x⁹/9! - x¹¹/11! + ...
    let result = Fixed.ZERO;
    let term = x;
    const x_squared = x.multiply(x);
    let termSign = Fixed.ONE;

    for (let i = 1; i <= 11; i += 2) {
      const factorial = Fixed.FACTORIALS[i] || 1;
      result = result.add(term.multiply(termSign).divide(new Fixed(factorial)));

      // Next term: multiply by x²
      term = term.multiply(x_squared);
      termSign = termSign.negate();
    }

    return result.multiply(sign);
  }

  /**
   * Calculate cosine using the identity cos(x) = sin(x + π/2)
   * 使用恒等式 cos(x) = sin(x + π/2) 计算余弦值
   */
  cos(): Fixed {
    return Fixed.cos(this);
  }

  /**
   * Static cosine function using cos(x) = sin(x + π/2)
   * 使用 cos(x) = sin(x + π/2) 的静态余弦函数
   */
  static cos(angle: Fixed): Fixed {
    return Fixed.sin(angle.add(Fixed.PI_HALF));
  }

  /**
   * Calculate tangent
   * 计算正切值
   */
  tan(): Fixed {
    return Fixed.tan(this);
  }

  /**
   * Static tangent function
   * 静态正切函数
   */
  static tan(angle: Fixed): Fixed {
    const cosValue = Fixed.cos(angle);
    // Use a small threshold instead of exact zero check for numerical stability
    if (cosValue.abs().lessThan(new Fixed(0.01))) {
      throw new Error('Tangent undefined');
    }
    return Fixed.sin(angle).divide(cosValue);
  }

  /**
   * Calculate arcsine using Newton's method
   * 使用牛顿法计算反正弦值
   */
  asin(): Fixed {
    if (this.abs().greaterThan(Fixed.ONE)) {
      throw new Error('Arcsine domain error: input must be in [-1, 1]');
    }

    if (this.equals(Fixed.ZERO)) return Fixed.ZERO;
    if (this.equals(Fixed.ONE)) return Fixed.PI_2;
    if (this.equals(new Fixed(-1))) return Fixed.PI_2.negate();

    // Use Newton's method to solve sin(y) = x for y
    let y = new Fixed(this.toNumber()); // Initial guess

    for (let i = 0; i < 10; i++) {
      const sinY = y.sin();
      const cosY = y.cos();

      if (cosY.equals(Fixed.ZERO)) break;

      const delta = sinY.subtract(this).divide(cosY);
      y = y.subtract(delta);

      if (delta.abs().rawValue <= 1) break; // Converged
    }

    return y;
  }

  /**
   * Calculate arccosine
   * 计算反余弦值
   */
  acos(): Fixed {
    if (this.abs().greaterThan(Fixed.ONE)) {
      throw new Error('Arccosine domain error: input must be in [-1, 1]');
    }

    // acos(x) = π/2 - asin(x)
    return Fixed.PI_2.subtract(this.asin());
  }

  /**
   * Calculate arctangent using CORDIC algorithm
   * 使用CORDIC算法计算反正切值
   */
  atan(): Fixed {
    // Use the identity: atan(x) = asin(x/√(1+x²))
    const x_squared = this.multiply(this);
    const denominator = Fixed.ONE.add(x_squared).sqrt();
    return this.divide(denominator).asin();
  }

  /**
   * Calculate atan2 for vector angles
   * 计算atan2用于向量角度
   */
  static atan2(y: Fixed, x: Fixed): Fixed {
    if (x.equals(Fixed.ZERO) && y.equals(Fixed.ZERO)) {
      throw new Error('atan2 undefined for (0, 0)');
    }

    if (x.greaterThan(Fixed.ZERO)) {
      return y.divide(x).atan();
    } else if (x.lessThan(Fixed.ZERO)) {
      if (y.greaterThanOrEqual(Fixed.ZERO)) {
        return y.divide(x).atan().add(Fixed.PI);
      } else {
        return y.divide(x).atan().subtract(Fixed.PI);
      }
    } else { // x == 0
      if (y.greaterThan(Fixed.ZERO)) {
        return Fixed.PI_2;
      } else {
        return Fixed.PI_2.negate();
      }
    }
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

  /**
   * Floor function - largest integer less than or equal to this value
   * 向下取整函数
   */
  floor(): Fixed {
    return Fixed.fromRaw(Math.floor(this._value / Fixed.SCALE) * Fixed.SCALE);
  }

  /**
   * Ceiling function - smallest integer greater than or equal to this value
   * 向上取整函数
   */
  ceil(): Fixed {
    return Fixed.fromRaw(Math.ceil(this._value / Fixed.SCALE) * Fixed.SCALE);
  }

  /**
   * Round to nearest integer
   * 四舍五入到最近整数
   */
  round(): Fixed {
    return Fixed.fromRaw(Math.round(this._value / Fixed.SCALE) * Fixed.SCALE);
  }

  /**
   * Get fractional part
   * 获取小数部分
   */
  frac(): Fixed {
    return this.subtract(this.floor());
  }

  /**
   * Power function using exponentiation by squaring
   * 使用平方求幂的幂函数
   */
  pow(exponent: Fixed): Fixed {
    if (exponent.equals(Fixed.ZERO)) {
      return Fixed.ONE;
    }

    if (exponent.equals(Fixed.ONE)) {
      return new Fixed(this.toNumber());
    }

    // For integer exponents, use exponentiation by squaring
    if (exponent.frac().equals(Fixed.ZERO)) {
      const exp = Math.abs(exponent.toNumber());
      let result = Fixed.ONE;
      let base = new Fixed(this.toNumber());
      let n = exp;

      while (n > 0) {
        if (n % 2 === 1) {
          result = result.multiply(base);
        }
        base = base.multiply(base);
        n = Math.floor(n / 2);
      }

      return exponent.lessThan(Fixed.ZERO) ? Fixed.ONE.divide(result) : result;
    }

    // For fractional exponents, use exp(ln(x) * y)
    return this.ln().multiply(exponent).exp();
  }

  /**
   * Natural logarithm using Taylor series
   * 使用泰勒级数计算自然对数
   */
  ln(): Fixed {
    if (this.lessThanOrEqual(Fixed.ZERO)) {
      throw new Error('Logarithm domain error: input must be positive');
    }

    if (this.equals(Fixed.ONE)) {
      return Fixed.ZERO;
    }

    // Use ln(x) = 2 * ((x-1)/(x+1) + (x-1)³/(3(x+1)³) + ...)
    const x = this;
    const numerator = x.subtract(Fixed.ONE);
    const denominator = x.add(Fixed.ONE);
    const ratio = numerator.divide(denominator);
    const ratio_squared = ratio.multiply(ratio);

    let result = Fixed.ZERO;
    let term = ratio;

    for (let i = 1; i <= 20; i += 2) {
      result = result.add(term.divide(new Fixed(i)));
      term = term.multiply(ratio_squared);
    }

    return result.multiply(Fixed.TWO);
  }

  /**
   * Exponential function using Taylor series
   * 使用泰勒级数计算指数函数
   */
  exp(): Fixed {
    // Use Taylor series: e^x = 1 + x + x²/2! + x³/3! + ...
    let result = Fixed.ONE;
    let term = Fixed.ONE;

    for (let i = 1; i <= 20; i++) {
      term = term.multiply(this).divide(new Fixed(i));
      result = result.add(term);
    }

    return result;
  }

  /**
   * Minimum of two values
   * 两个值的最小值
   */
  static min(a: Fixed, b: Fixed): Fixed {
    return a.lessThan(b) ? a : b;
  }

  /**
   * Maximum of two values
   * 两个值的最大值
   */
  static max(a: Fixed, b: Fixed): Fixed {
    return a.greaterThan(b) ? a : b;
  }

  /**
   * Clamp value between min and max
   * 将值限制在最小值和最大值之间
   */
  clamp(min: Fixed, max: Fixed): Fixed {
    if (this.lessThan(min)) return min;
    if (this.greaterThan(max)) return max;
    return new Fixed(this.toNumber());
  }

  /**
   * Modulo operation - returns the remainder after division
   * 模运算 - 返回除法后的余数
   */
  mod(divisor: Fixed): Fixed {
    if (divisor.equals(Fixed.ZERO)) {
      throw new Error('Modulo by zero');
    }

    // Use the formula: a mod b = a - b * floor(a/b)
    const quotient = this.divide(divisor).floor();
    return this.subtract(divisor.multiply(quotient));
  }

  /**
   * Linear interpolation between two values
   * 两个值之间的线性插值
   */
  static lerp(a: Fixed, b: Fixed, t: Fixed): Fixed {
    return a.add(b.subtract(a).multiply(t));
  }

  // Static constants
  static readonly ZERO = new Fixed(0);
  static readonly ONE = new Fixed(1);
  static readonly PI = new Fixed(3.141592653589793);
  static readonly E = new Fixed(2.718281828459045);
  static readonly HALF = new Fixed(0.5);
  static readonly TWO = new Fixed(2);
  static readonly PI_2 = new Fixed(1.5707963267948966); // PI/2
  static readonly PI_HALF = new Fixed(1.5707963267948966); // PI/2 (alias)
  static readonly PI_4 = new Fixed(0.7853981633974483); // PI/4
  static readonly PI_QUARTER = new Fixed(0.7853981633974483); // PI/4 (alias)
  static readonly TWO_PI = new Fixed(6.283185307179586); // 2*PI
  static readonly PI_TWO = new Fixed(6.283185307179586); // 2*PI (alias)
  static readonly DEG_TO_RAD = new Fixed(0.017453292519943295); // PI/180
  static readonly RAD_TO_DEG = new Fixed(57.29577951308232); // 180/PI

  // Precomputed factorial values for Taylor series
  // 预计算的阶乘值用于泰勒级数
  private static readonly FACTORIALS = [
    1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600
  ];

  // Lookup table for common angles (in radians)
  // 常用角度的查找表（弧度）
  private static readonly SIN_TABLE = new Map<number, Fixed>([
    [0, Fixed.ZERO],
    [Fixed.PI_4.rawValue, new Fixed(0.7071067811865476)], // sin(π/4) = √2/2
    [Fixed.PI_2.rawValue, Fixed.ONE], // sin(π/2) = 1
    [Fixed.PI.rawValue, Fixed.ZERO], // sin(π) = 0
  ]);


}
