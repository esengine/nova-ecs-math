import { describe, test, expect } from 'vitest';
import { Fixed } from '../src/Fixed';
import { FixedVector2 } from '../src/FixedVector2';

describe('FixedVector2', () => {
  describe('Constructor', () => {
    test('should create with default values', () => {
      const vector = new FixedVector2();
      expect(vector.x.toNumber()).toBe(0);
      expect(vector.y.toNumber()).toBe(0);
    });

    test('should create with number values', () => {
      const vector = new FixedVector2(3.5, -2.1);
      expect(vector.x.toNumber()).toBeCloseTo(3.5, 5);
      expect(vector.y.toNumber()).toBeCloseTo(-2.1, 5);
    });

    test('should create with Fixed values', () => {
      const x = new Fixed(1.5);
      const y = new Fixed(2.5);
      const vector = new FixedVector2(x, y);
      expect(vector.x.equals(x)).toBe(true);
      expect(vector.y.equals(y)).toBe(true);
    });
  });

  describe('Vector Operations', () => {
    test('should add vectors correctly', () => {
      const a = new FixedVector2(2, 3);
      const b = new FixedVector2(1, -1);
      const result = a.add(b);
      
      expect(result.x.toNumber()).toBe(3);
      expect(result.y.toNumber()).toBe(2);
    });

    test('should subtract vectors correctly', () => {
      const a = new FixedVector2(5, 3);
      const b = new FixedVector2(2, 1);
      const result = a.subtract(b);
      
      expect(result.x.toNumber()).toBe(3);
      expect(result.y.toNumber()).toBe(2);
    });

    test('should multiply by scalar correctly', () => {
      const vector = new FixedVector2(2, 3);
      const scalar = new Fixed(2.5);
      const result = vector.multiply(scalar);
      
      expect(result.x.toNumber()).toBe(5);
      expect(result.y.toNumber()).toBe(7.5);
    });

    test('should multiply by number scalar correctly', () => {
      const vector = new FixedVector2(2, 3);
      const result = vector.multiply(2);
      
      expect(result.x.toNumber()).toBe(4);
      expect(result.y.toNumber()).toBe(6);
    });

    test('should divide by scalar correctly', () => {
      const vector = new FixedVector2(6, 9);
      const scalar = new Fixed(3);
      const result = vector.divide(scalar);
      
      expect(result.x.toNumber()).toBe(2);
      expect(result.y.toNumber()).toBe(3);
    });
  });

  describe('Magnitude and Normalization', () => {
    test('should calculate magnitude correctly', () => {
      const vector = new FixedVector2(3, 4);
      const magnitude = vector.magnitude();
      expect(magnitude.toNumber()).toBeCloseTo(5, 5);
    });

    test('should calculate squared magnitude correctly', () => {
      const vector = new FixedVector2(3, 4);
      const sqrMagnitude = vector.sqrMagnitude();
      expect(sqrMagnitude.toNumber()).toBe(25);
    });

    test('should normalize vector correctly', () => {
      const vector = new FixedVector2(3, 4);
      const normalized = vector.normalize();
      const magnitude = normalized.magnitude();
      
      expect(magnitude.toNumber()).toBeCloseTo(1, 5);
      expect(normalized.x.toNumber()).toBeCloseTo(0.6, 5);
      expect(normalized.y.toNumber()).toBeCloseTo(0.8, 5);
    });

    test('should handle zero vector normalization', () => {
      const zero = new FixedVector2(0, 0);
      const normalized = zero.normalize();
      
      expect(normalized.x.equals(Fixed.ZERO)).toBe(true);
      expect(normalized.y.equals(Fixed.ZERO)).toBe(true);
    });
  });

  describe('Dot and Cross Products', () => {
    test('should calculate dot product correctly', () => {
      const a = new FixedVector2(2, 3);
      const b = new FixedVector2(4, 1);
      const dot = a.dot(b);
      
      expect(dot.toNumber()).toBe(11); // 2*4 + 3*1 = 11
    });

    test('should calculate cross product correctly', () => {
      const a = new FixedVector2(2, 3);
      const b = new FixedVector2(4, 1);
      const cross = a.cross(b);
      
      expect(cross.toNumber()).toBe(-10); // 2*1 - 3*4 = -10
    });
  });

  describe('Distance Calculations', () => {
    test('should calculate distance correctly', () => {
      const a = new FixedVector2(0, 0);
      const b = new FixedVector2(3, 4);
      const distance = a.distance(b);
      
      expect(distance.toNumber()).toBeCloseTo(5, 5);
    });

    test('should calculate squared distance correctly', () => {
      const a = new FixedVector2(0, 0);
      const b = new FixedVector2(3, 4);
      const sqrDistance = a.sqrDistance(b);
      
      expect(sqrDistance.toNumber()).toBe(25);
    });
  });

  describe('Utility Methods', () => {
    test('should negate vector correctly', () => {
      const vector = new FixedVector2(2, -3);
      const negated = vector.negate();
      
      expect(negated.x.toNumber()).toBe(-2);
      expect(negated.y.toNumber()).toBe(3);
    });

    test('should get absolute values correctly', () => {
      const vector = new FixedVector2(-2, -3);
      const abs = vector.abs();
      
      expect(abs.x.toNumber()).toBe(2);
      expect(abs.y.toNumber()).toBe(3);
    });

    test('should check equality correctly', () => {
      const a = new FixedVector2(1.5, 2.5);
      const b = new FixedVector2(1.5, 2.5);
      const c = new FixedVector2(1.5, 2.6);
      
      expect(a.equals(b)).toBe(true);
      expect(a.equals(c)).toBe(false);
    });

    test('should convert to string correctly', () => {
      const vector = new FixedVector2(1.5, 2.5);
      const str = vector.toString();
      expect(str).toBe('(1.5, 2.5)');
    });

    test('should convert to array correctly', () => {
      const vector = new FixedVector2(1.5, 2.5);
      const array = vector.toArray();
      expect(array).toEqual([1.5, 2.5]);
    });

    test('should clone correctly', () => {
      const original = new FixedVector2(1.5, 2.5);
      const clone = original.clone();
      
      expect(clone.equals(original)).toBe(true);
      expect(clone).not.toBe(original); // Different objects
    });
  });

  describe('Static Constants', () => {
    test('should have correct static constants', () => {
      expect(FixedVector2.ZERO.equals(new FixedVector2(0, 0))).toBe(true);
      expect(FixedVector2.ONE.equals(new FixedVector2(1, 1))).toBe(true);
      expect(FixedVector2.UP.equals(new FixedVector2(0, 1))).toBe(true);
      expect(FixedVector2.DOWN.equals(new FixedVector2(0, -1))).toBe(true);
      expect(FixedVector2.LEFT.equals(new FixedVector2(-1, 0))).toBe(true);
      expect(FixedVector2.RIGHT.equals(new FixedVector2(1, 0))).toBe(true);
    });
  });

  describe('Static Methods', () => {
    test('should lerp correctly', () => {
      const a = new FixedVector2(0, 0);
      const b = new FixedVector2(10, 20);
      const t = new Fixed(0.5);
      const result = FixedVector2.lerp(a, b, t);
      
      expect(result.x.toNumber()).toBe(5);
      expect(result.y.toNumber()).toBe(10);
    });

    test('should lerp with number t correctly', () => {
      const a = new FixedVector2(0, 0);
      const b = new FixedVector2(10, 20);
      const result = FixedVector2.lerp(a, b, 0.25);
      
      expect(result.x.toNumber()).toBe(2.5);
      expect(result.y.toNumber()).toBe(5);
    });

    test('should calculate angle between vectors', () => {
      const a = new FixedVector2(1, 0);
      const b = new FixedVector2(0, 1);
      const angle = FixedVector2.angle(a, b);
      
      expect(angle.toNumber()).toBeCloseTo(Math.PI / 2, 5);
    });

    test('should handle zero magnitude in angle calculation', () => {
      const a = new FixedVector2(0, 0);
      const b = new FixedVector2(1, 0);
      const angle = FixedVector2.angle(a, b);
      
      expect(angle.equals(Fixed.ZERO)).toBe(true);
    });
  });
});
