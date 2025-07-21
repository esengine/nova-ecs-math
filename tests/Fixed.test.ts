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
