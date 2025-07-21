import { describe, test, expect } from 'vitest';
import { Fixed } from '../src/Fixed';

describe('Fixed', () => {
  describe('Constructor', () => {
    test('should create from number', () => {
      const fixed = new Fixed(3.14159);
      expect(fixed.toNumber()).toBeCloseTo(3.14159, 5);
    });

    test('should create from string', () => {
      const fixed = new Fixed('2.71828');
      expect(fixed.toNumber()).toBeCloseTo(2.71828, 5);
    });

    test('should create from another Fixed', () => {
      const original = new Fixed(1.5);
      const copy = new Fixed(original);
      expect(copy.toNumber()).toBe(original.toNumber());
      expect(copy.equals(original)).toBe(true);
    });

    test('should create from raw value', () => {
      const fixed = Fixed.fromRaw(1500000); // 1.5 * 1000000
      expect(fixed.toNumber()).toBe(1.5);
    });
  });

  describe('Arithmetic Operations', () => {
    test('should add correctly', () => {
      const a = new Fixed(2.5);
      const b = new Fixed(1.5);
      const result = a.add(b);
      expect(result.toNumber()).toBe(4.0);
    });

    test('should subtract correctly', () => {
      const a = new Fixed(5.0);
      const b = new Fixed(2.0);
      const result = a.subtract(b);
      expect(result.toNumber()).toBe(3.0);
    });

    test('should multiply correctly', () => {
      const a = new Fixed(3.0);
      const b = new Fixed(2.0);
      const result = a.multiply(b);
      expect(result.toNumber()).toBe(6.0);
    });

    test('should divide correctly', () => {
      const a = new Fixed(6.0);
      const b = new Fixed(2.0);
      const result = a.divide(b);
      expect(result.toNumber()).toBe(3.0);
    });

    test('should throw error on division by zero', () => {
      const a = new Fixed(5.0);
      const b = new Fixed(0.0);
      expect(() => a.divide(b)).toThrow('Division by zero');
    });

    test('should calculate absolute value', () => {
      const negative = new Fixed(-3.5);
      const positive = new Fixed(3.5);
      expect(negative.abs().toNumber()).toBe(3.5);
      expect(positive.abs().toNumber()).toBe(3.5);
    });

    test('should negate correctly', () => {
      const positive = new Fixed(2.5);
      const negative = positive.negate();
      expect(negative.toNumber()).toBe(-2.5);
      expect(negative.negate().toNumber()).toBe(2.5);
    });

    test('should calculate square root correctly', () => {
      const four = new Fixed(4);
      const sqrt = four.sqrt();
      expect(sqrt.toNumber()).toBeCloseTo(2, 5);

      const nine = new Fixed(9);
      const sqrt9 = nine.sqrt();
      expect(sqrt9.toNumber()).toBeCloseTo(3, 5);

      const two = new Fixed(2);
      const sqrt2 = two.sqrt();
      expect(sqrt2.toNumber()).toBeCloseTo(Math.sqrt(2), 4);
    });

    test('should handle square root edge cases', () => {
      expect(Fixed.ZERO.sqrt().equals(Fixed.ZERO)).toBe(true);
      expect(Fixed.ONE.sqrt().equals(Fixed.ONE)).toBe(true);

      const negative = new Fixed(-1);
      expect(() => negative.sqrt()).toThrow('Square root of negative number');
    });

    test('should have static sqrt method', () => {
      const four = new Fixed(4);
      const sqrt = Fixed.sqrt(four);
      expect(sqrt.toNumber()).toBeCloseTo(2, 5);
    });
  });

  describe('Comparison Operations', () => {
    test('should check equality correctly', () => {
      const a = new Fixed(3.14);
      const b = new Fixed(3.14);
      const c = new Fixed(2.71);
      
      expect(a.equals(b)).toBe(true);
      expect(a.equals(c)).toBe(false);
    });

    test('should compare less than correctly', () => {
      const smaller = new Fixed(2.0);
      const larger = new Fixed(3.0);
      
      expect(smaller.lessThan(larger)).toBe(true);
      expect(larger.lessThan(smaller)).toBe(false);
      expect(smaller.lessThan(smaller)).toBe(false);
    });

    test('should compare less than or equal correctly', () => {
      const smaller = new Fixed(2.0);
      const larger = new Fixed(3.0);
      const equal = new Fixed(2.0);
      
      expect(smaller.lessThanOrEqual(larger)).toBe(true);
      expect(smaller.lessThanOrEqual(equal)).toBe(true);
      expect(larger.lessThanOrEqual(smaller)).toBe(false);
    });

    test('should compare greater than correctly', () => {
      const smaller = new Fixed(2.0);
      const larger = new Fixed(3.0);
      
      expect(larger.greaterThan(smaller)).toBe(true);
      expect(smaller.greaterThan(larger)).toBe(false);
      expect(smaller.greaterThan(smaller)).toBe(false);
    });

    test('should compare greater than or equal correctly', () => {
      const smaller = new Fixed(2.0);
      const larger = new Fixed(3.0);
      const equal = new Fixed(2.0);
      
      expect(larger.greaterThanOrEqual(smaller)).toBe(true);
      expect(smaller.greaterThanOrEqual(equal)).toBe(true);
      expect(smaller.greaterThanOrEqual(larger)).toBe(false);
    });
  });

  describe('Conversion and Utility', () => {
    test('should convert to string correctly', () => {
      const fixed = new Fixed(3.14159);
      expect(fixed.toString()).toBe(fixed.toNumber().toString());
    });

    test('should provide raw value access', () => {
      const fixed = new Fixed(1.5);
      expect(fixed.rawValue).toBe(1500000); // 1.5 * 1000000
    });

    test('should provide scale factor', () => {
      expect(Fixed.scale).toBe(1000000);
    });
  });

  describe('Static Constants', () => {
    test('should have correct static constants', () => {
      expect(Fixed.ZERO.toNumber()).toBe(0);
      expect(Fixed.ONE.toNumber()).toBe(1);
      expect(Fixed.PI.toNumber()).toBeCloseTo(Math.PI, 5);
      expect(Fixed.E.toNumber()).toBeCloseTo(Math.E, 5);
      expect(Fixed.HALF.toNumber()).toBe(0.5);
      expect(Fixed.TWO.toNumber()).toBe(2);
    });
  });

  describe('In-Place Operations', () => {
    test('should add in place correctly', () => {
      const a = new Fixed(2.5);
      const b = new Fixed(1.5);
      const result = a.addInPlace(b);

      expect(result).toBe(a); // Should return same instance
      expect(a.toNumber()).toBe(4.0);
    });

    test('should subtract in place correctly', () => {
      const a = new Fixed(5.0);
      const b = new Fixed(2.0);
      const result = a.subtractInPlace(b);

      expect(result).toBe(a);
      expect(a.toNumber()).toBe(3.0);
    });

    test('should multiply in place correctly', () => {
      const a = new Fixed(3.0);
      const b = new Fixed(2.0);
      const result = a.multiplyInPlace(b);

      expect(result).toBe(a);
      expect(a.toNumber()).toBe(6.0);
    });

    test('should divide in place correctly', () => {
      const a = new Fixed(6.0);
      const b = new Fixed(2.0);
      const result = a.divideInPlace(b);

      expect(result).toBe(a);
      expect(a.toNumber()).toBe(3.0);
    });

    test('should throw error on division by zero in place', () => {
      const a = new Fixed(5.0);
      const b = new Fixed(0.0);
      expect(() => a.divideInPlace(b)).toThrow('Division by zero');
    });
  });

  describe('Caching', () => {
    test('should create cached values', () => {
      const a = Fixed.cached(1.5);
      const b = Fixed.cached(1.5);

      expect(a.toNumber()).toBe(1.5);
      expect(b.toNumber()).toBe(1.5);
      // Note: cached values should be the same instance for performance
      expect(a).toBe(b);
    });
  });

  describe('Trigonometric Functions', () => {
    test('should calculate sine correctly', () => {
      expect(Fixed.ZERO.sin().toNumber()).toBeCloseTo(0, 5);
      expect(Fixed.PI_2.sin().toNumber()).toBeCloseTo(1, 5);
      expect(Fixed.PI.sin().toNumber()).toBeCloseTo(0, 4);

      const angle = new Fixed(Math.PI / 6); // 30 degrees
      expect(angle.sin().toNumber()).toBeCloseTo(0.5, 4);
    });

    test('should calculate cosine correctly', () => {
      expect(Fixed.ZERO.cos().toNumber()).toBeCloseTo(1, 5);
      expect(Fixed.PI_2.cos().toNumber()).toBeCloseTo(0, 4);
      expect(Fixed.PI.cos().toNumber()).toBeCloseTo(-1, 4);

      const angle = new Fixed(Math.PI / 3); // 60 degrees
      expect(angle.cos().toNumber()).toBeCloseTo(0.5, 4);
    });

    test('should calculate tangent correctly', () => {
      expect(Fixed.ZERO.tan().toNumber()).toBeCloseTo(0, 5);
      expect(Fixed.PI_4.tan().toNumber()).toBeCloseTo(1, 4);

      expect(() => Fixed.PI_2.tan()).toThrow('Tangent undefined');
    });

    test('should calculate arcsine correctly', () => {
      expect(Fixed.ZERO.asin().toNumber()).toBeCloseTo(0, 5);
      expect(Fixed.ONE.asin().toNumber()).toBeCloseTo(Math.PI / 2, 4);
      expect(new Fixed(-1).asin().toNumber()).toBeCloseTo(-Math.PI / 2, 4);

      expect(() => new Fixed(2).asin()).toThrow('Arcsine domain error');
    });

    test('should calculate arccosine correctly', () => {
      expect(Fixed.ONE.acos().toNumber()).toBeCloseTo(0, 5);
      expect(Fixed.ZERO.acos().toNumber()).toBeCloseTo(Math.PI / 2, 4);
      expect(new Fixed(-1).acos().toNumber()).toBeCloseTo(Math.PI, 4);

      expect(() => new Fixed(2).acos()).toThrow('Arccosine domain error');
    });

    test('should calculate arctangent correctly', () => {
      expect(Fixed.ZERO.atan().toNumber()).toBeCloseTo(0, 5);
      expect(Fixed.ONE.atan().toNumber()).toBeCloseTo(Math.PI / 4, 4);
    });

    test('should calculate atan2 correctly', () => {
      expect(Fixed.atan2(Fixed.ONE, Fixed.ONE).toNumber()).toBeCloseTo(Math.PI / 4, 4);
      expect(Fixed.atan2(Fixed.ONE, Fixed.ZERO).toNumber()).toBeCloseTo(Math.PI / 2, 4);
      expect(Fixed.atan2(Fixed.ZERO, Fixed.ONE).toNumber()).toBeCloseTo(0, 5);

      expect(() => Fixed.atan2(Fixed.ZERO, Fixed.ZERO)).toThrow('atan2 undefined');
    });
  });

  describe('Mathematical Functions', () => {
    test('should calculate floor correctly', () => {
      expect(new Fixed(3.7).floor().toNumber()).toBe(3);
      expect(new Fixed(-2.3).floor().toNumber()).toBe(-3);
      expect(new Fixed(5).floor().toNumber()).toBe(5);
    });

    test('should calculate ceil correctly', () => {
      expect(new Fixed(3.2).ceil().toNumber()).toBe(4);
      expect(new Fixed(-2.7).ceil().toNumber()).toBe(-2);
      expect(new Fixed(5).ceil().toNumber()).toBe(5);
    });

    test('should calculate round correctly', () => {
      expect(new Fixed(3.4).round().toNumber()).toBe(3);
      expect(new Fixed(3.6).round().toNumber()).toBe(4);
      expect(new Fixed(-2.4).round().toNumber()).toBe(-2);
      expect(new Fixed(-2.6).round().toNumber()).toBe(-3);
    });

    test('should calculate fractional part correctly', () => {
      expect(new Fixed(3.7).frac().toNumber()).toBeCloseTo(0.7, 5);
      expect(new Fixed(-2.3).frac().toNumber()).toBeCloseTo(0.7, 5); // -2.3 - (-3) = 0.7
    });

    test('should calculate power correctly', () => {
      expect(new Fixed(2).pow(new Fixed(3)).toNumber()).toBeCloseTo(8, 5);
      expect(new Fixed(4).pow(new Fixed(0.5)).toNumber()).toBeCloseTo(2, 4);
      expect(new Fixed(5).pow(Fixed.ZERO).toNumber()).toBe(1);
      expect(new Fixed(2).pow(new Fixed(-1)).toNumber()).toBeCloseTo(0.5, 5);
    });

    test('should calculate natural logarithm correctly', () => {
      expect(Fixed.ONE.ln().toNumber()).toBeCloseTo(0, 5);
      expect(Fixed.E.ln().toNumber()).toBeCloseTo(1, 4);
      expect(new Fixed(Math.E * Math.E).ln().toNumber()).toBeCloseTo(2, 2); // Lower precision for complex calculations

      expect(() => Fixed.ZERO.ln()).toThrow('Logarithm domain error');
      expect(() => new Fixed(-1).ln()).toThrow('Logarithm domain error');
    });

    test('should calculate exponential correctly', () => {
      expect(Fixed.ZERO.exp().toNumber()).toBeCloseTo(1, 5);
      expect(Fixed.ONE.exp().toNumber()).toBeCloseTo(Math.E, 4);
      expect(new Fixed(2).exp().toNumber()).toBeCloseTo(Math.E * Math.E, 4);
    });

    test('should calculate min and max correctly', () => {
      const a = new Fixed(3);
      const b = new Fixed(5);

      expect(Fixed.min(a, b).equals(a)).toBe(true);
      expect(Fixed.max(a, b).equals(b)).toBe(true);
    });

    test('should clamp values correctly', () => {
      const min = new Fixed(0);
      const max = new Fixed(10);

      expect(new Fixed(-5).clamp(min, max).equals(min)).toBe(true);
      expect(new Fixed(15).clamp(min, max).equals(max)).toBe(true);
      expect(new Fixed(5).clamp(min, max).toNumber()).toBe(5);
    });

    test('should lerp correctly', () => {
      const a = new Fixed(0);
      const b = new Fixed(10);

      expect(Fixed.lerp(a, b, Fixed.ZERO).equals(a)).toBe(true);
      expect(Fixed.lerp(a, b, Fixed.ONE).equals(b)).toBe(true);
      expect(Fixed.lerp(a, b, Fixed.HALF).toNumber()).toBe(5);
    });

    test('should calculate modulo correctly', () => {
      // Basic modulo operations
      expect(new Fixed(7).mod(new Fixed(3)).toNumber()).toBeCloseTo(1, 5);
      expect(new Fixed(10).mod(new Fixed(4)).toNumber()).toBeCloseTo(2, 5);
      expect(new Fixed(15).mod(new Fixed(5)).toNumber()).toBeCloseTo(0, 5);

      // Negative numbers
      expect(new Fixed(-7).mod(new Fixed(3)).toNumber()).toBeCloseTo(2, 5); // -7 mod 3 = 2
      expect(new Fixed(7).mod(new Fixed(-3)).toNumber()).toBeCloseTo(-2, 5); // 7 mod -3 = -2

      // Fractional modulo
      expect(new Fixed(5.5).mod(new Fixed(2)).toNumber()).toBeCloseTo(1.5, 5);
      expect(new Fixed(3.7).mod(new Fixed(1.2)).toNumber()).toBeCloseTo(0.1, 4);

      // Error case
      expect(() => new Fixed(5).mod(Fixed.ZERO)).toThrow('Modulo by zero');
    });
  });

  describe('Precision and Determinism', () => {
    test('should maintain precision in complex calculations', () => {
      const a = new Fixed(0.1);
      const b = new Fixed(0.2);
      const result = a.add(b);
      
      // This should be exactly 0.3 in fixed-point arithmetic
      expect(result.toNumber()).toBeCloseTo(0.3, 6);
    });

    test('should be deterministic across multiple operations', () => {
      const operations = () => {
        const a = new Fixed(1.0);
        const b = new Fixed(3.0);
        return a.divide(b).multiply(b);
      };
      
      const result1 = operations();
      const result2 = operations();
      
      expect(result1.equals(result2)).toBe(true);
    });
  });
});
