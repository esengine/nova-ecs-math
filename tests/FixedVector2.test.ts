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

    test('should throw error on division by zero', () => {
      const vector = new FixedVector2(6, 9);
      expect(() => vector.divide(0)).toThrow('Division by zero vector');
      expect(() => vector.divide(Fixed.ZERO)).toThrow('Division by zero vector');
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

  describe('Advanced vector operations', () => {
    test('should reflect vector across normal', () => {
      const vector = new FixedVector2(1, 1);
      const normal = new FixedVector2(0, 1); // Vertical normal
      const reflected = vector.reflect(normal);

      expect(reflected.x.toNumber()).toBeCloseTo(1, 5);
      expect(reflected.y.toNumber()).toBeCloseTo(-1, 5);
    });

    test('should project vector onto another vector', () => {
      const vector = new FixedVector2(3, 4);
      const onto = new FixedVector2(1, 0); // Project onto X-axis
      const projected = vector.project(onto);

      expect(projected.x.toNumber()).toBeCloseTo(3, 5);
      expect(projected.y.toNumber()).toBeCloseTo(0, 5);
    });

    test('should handle zero vector projection', () => {
      const vector = new FixedVector2(3, 4);
      const onto = FixedVector2.ZERO;
      const projected = vector.project(onto);

      expect(projected.equals(FixedVector2.ZERO)).toBe(true);
    });

    test('should get perpendicular component (reject)', () => {
      const vector = new FixedVector2(3, 4);
      const onto = new FixedVector2(1, 0); // Reject from X-axis
      const rejected = vector.reject(onto);

      expect(rejected.x.toNumber()).toBeCloseTo(0, 5);
      expect(rejected.y.toNumber()).toBeCloseTo(4, 5);
    });

    test('should rotate vector by angle', () => {
      const vector = new FixedVector2(1, 0);
      const rotated = vector.rotate(Fixed.PI.divide(new Fixed(2))); // 90 degrees

      expect(rotated.x.toNumber()).toBeCloseTo(0, 5);
      expect(rotated.y.toNumber()).toBeCloseTo(1, 5);
    });

    test('should get perpendicular vector', () => {
      const vector = new FixedVector2(1, 0);
      const perp = vector.perpendicular();

      expect(perp.x.toNumber()).toBeCloseTo(0, 5);
      expect(perp.y.toNumber()).toBeCloseTo(1, 5);
    });

    test('should get right perpendicular vector', () => {
      const vector = new FixedVector2(1, 0);
      const perpRight = vector.perpendicularRight();

      expect(perpRight.x.toNumber()).toBeCloseTo(0, 5);
      expect(perpRight.y.toNumber()).toBeCloseTo(-1, 5);
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

  describe('In-Place Operations', () => {
    test('should add in place correctly', () => {
      const a = new FixedVector2(2, 3);
      const b = new FixedVector2(1, -1);
      const result = a.addInPlace(b);

      expect(result).toBe(a); // Should return same instance
      expect(a.x.toNumber()).toBe(3);
      expect(a.y.toNumber()).toBe(2);
    });

    test('should subtract in place correctly', () => {
      const a = new FixedVector2(5, 3);
      const b = new FixedVector2(2, 1);
      const result = a.subtractInPlace(b);

      expect(result).toBe(a);
      expect(a.x.toNumber()).toBe(3);
      expect(a.y.toNumber()).toBe(2);
    });

    test('should multiply in place correctly', () => {
      const vector = new FixedVector2(2, 3);
      const result = vector.multiplyInPlace(2);

      expect(result).toBe(vector);
      expect(vector.x.toNumber()).toBe(4);
      expect(vector.y.toNumber()).toBe(6);
    });

    test('should divide in place correctly', () => {
      const vector = new FixedVector2(6, 9);
      const result = vector.divideInPlace(3);

      expect(result).toBe(vector);
      expect(vector.x.toNumber()).toBe(2);
      expect(vector.y.toNumber()).toBe(3);
    });

    test('should throw error on division by zero in place', () => {
      const vector = new FixedVector2(6, 9);
      expect(() => vector.divideInPlace(0)).toThrow('Division by zero vector');
    });
  });

  describe('Object Reuse Methods', () => {
    test('should set from another vector', () => {
      const a = new FixedVector2(1, 2);
      const b = new FixedVector2(3, 4);

      const result = a.setFrom(b);

      expect(result).toBe(a);
      expect(a.x.toNumber()).toBe(3);
      expect(a.y.toNumber()).toBe(4);
    });

    test('should set from coordinates', () => {
      const vector = new FixedVector2(1, 2);
      const result = vector.set(5, 6);

      expect(result).toBe(vector);
      expect(vector.x.toNumber()).toBe(5);
      expect(vector.y.toNumber()).toBe(6);
    });

    test('should reset to zero', () => {
      const vector = new FixedVector2(5, 10);
      const result = vector.reset();

      expect(result).toBe(vector);
      expect(vector.x.equals(Fixed.ZERO)).toBe(true);
      expect(vector.y.equals(Fixed.ZERO)).toBe(true);
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

    test('should calculate angle between vectors using deterministic math', () => {
      const a = new FixedVector2(1, 0);
      const b = new FixedVector2(0, 1);
      const angle = FixedVector2.angle(a, b);

      expect(angle.toNumber()).toBeCloseTo(Math.PI / 2, 4);
    });

    test('should handle zero magnitude in angle calculation', () => {
      const a = new FixedVector2(0, 0);
      const b = new FixedVector2(1, 0);
      const angle = FixedVector2.angle(a, b);

      expect(angle.equals(Fixed.ZERO)).toBe(true);
    });

    test('should get vector angle from positive X axis', () => {
      const right = new FixedVector2(1, 0);
      const up = new FixedVector2(0, 1);
      const left = new FixedVector2(-1, 0);

      expect(right.angle().toNumber()).toBeCloseTo(0, 5);
      expect(up.angle().toNumber()).toBeCloseTo(Math.PI / 2, 4);
      expect(left.angle().toNumber()).toBeCloseTo(Math.PI, 4);
    });

    test('should create vector from angle and magnitude', () => {
      const angle = Fixed.PI_4; // 45 degrees
      const magnitude = new Fixed(2);
      const vector = FixedVector2.fromAngle(angle, magnitude);

      expect(vector.x.toNumber()).toBeCloseTo(Math.sqrt(2), 4);
      expect(vector.y.toNumber()).toBeCloseTo(Math.sqrt(2), 4);
      expect(vector.magnitude().toNumber()).toBeCloseTo(2, 4);
    });

    test('should create unit vector from angle', () => {
      const angle = Fixed.PI_2; // 90 degrees
      const vector = FixedVector2.fromAngle(angle);

      expect(vector.x.toNumber()).toBeCloseTo(0, 4);
      expect(vector.y.toNumber()).toBeCloseTo(1, 4);
      expect(vector.magnitude().toNumber()).toBeCloseTo(1, 4);
    });
  });
});
