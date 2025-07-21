import { describe, test, expect } from 'vitest';
import { Fixed } from '../src/Fixed';
import { FixedVector2 } from '../src/FixedVector2';
import { FixedMatrix2x2 } from '../src/FixedMatrix2x2';

describe('FixedMatrix2x2', () => {
  describe('Constructor', () => {
    test('should create identity matrix by default', () => {
      const matrix = new FixedMatrix2x2();
      expect(matrix.m00.toNumber()).toBe(1);
      expect(matrix.m01.toNumber()).toBe(0);
      expect(matrix.m10.toNumber()).toBe(0);
      expect(matrix.m11.toNumber()).toBe(1);
    });

    test('should create matrix from numbers', () => {
      const matrix = new FixedMatrix2x2(1, 2, 3, 4);
      expect(matrix.m00.toNumber()).toBe(1);
      expect(matrix.m01.toNumber()).toBe(2);
      expect(matrix.m10.toNumber()).toBe(3);
      expect(matrix.m11.toNumber()).toBe(4);
    });

    test('should create matrix from Fixed values', () => {
      const matrix = new FixedMatrix2x2(
        new Fixed(1.5),
        new Fixed(2.5),
        new Fixed(3.5),
        new Fixed(4.5)
      );
      expect(matrix.m00.toNumber()).toBeCloseTo(1.5, 5);
      expect(matrix.m01.toNumber()).toBeCloseTo(2.5, 5);
      expect(matrix.m10.toNumber()).toBeCloseTo(3.5, 5);
      expect(matrix.m11.toNumber()).toBeCloseTo(4.5, 5);
    });
  });

  describe('Static Factory Methods', () => {
    test('should create identity matrix', () => {
      const identity = FixedMatrix2x2.identity();
      expect(identity.isIdentity()).toBe(true);
    });

    test('should create zero matrix', () => {
      const zero = FixedMatrix2x2.zero();
      expect(zero.m00.equals(Fixed.ZERO)).toBe(true);
      expect(zero.m01.equals(Fixed.ZERO)).toBe(true);
      expect(zero.m10.equals(Fixed.ZERO)).toBe(true);
      expect(zero.m11.equals(Fixed.ZERO)).toBe(true);
    });

    test('should create rotation matrix', () => {
      const rotation90 = FixedMatrix2x2.rotation(Fixed.PI_2);
      // 90 degree rotation: cos(90°) = 0, sin(90°) = 1
      // Matrix should be: [0, -1]
      //                   [1,  0]
      expect(rotation90.m00.toNumber()).toBeCloseTo(0, 4);
      expect(rotation90.m01.toNumber()).toBeCloseTo(-1, 4);
      expect(rotation90.m10.toNumber()).toBeCloseTo(1, 4);
      expect(rotation90.m11.toNumber()).toBeCloseTo(0, 4);
    });

    test('should create scaling matrix', () => {
      const scaling = FixedMatrix2x2.scaling(new Fixed(2), new Fixed(3));
      expect(scaling.m00.toNumber()).toBe(2);
      expect(scaling.m01.toNumber()).toBe(0);
      expect(scaling.m10.toNumber()).toBe(0);
      expect(scaling.m11.toNumber()).toBe(3);
    });

    test('should create uniform scaling matrix', () => {
      const scaling = FixedMatrix2x2.scaling(new Fixed(2));
      expect(scaling.m00.toNumber()).toBe(2);
      expect(scaling.m01.toNumber()).toBe(0);
      expect(scaling.m10.toNumber()).toBe(0);
      expect(scaling.m11.toNumber()).toBe(2);
    });

    test('should create shear matrix', () => {
      const shear = FixedMatrix2x2.shear(new Fixed(0.5), new Fixed(0.3));
      expect(shear.m00.toNumber()).toBe(1);
      expect(shear.m01.toNumber()).toBeCloseTo(0.5, 5);
      expect(shear.m10.toNumber()).toBeCloseTo(0.3, 5);
      expect(shear.m11.toNumber()).toBe(1);
    });

    test('should create matrix from array', () => {
      const matrix = FixedMatrix2x2.fromArray([1, 2, 3, 4]);
      expect(matrix.m00.toNumber()).toBe(1);
      expect(matrix.m01.toNumber()).toBe(2);
      expect(matrix.m10.toNumber()).toBe(3);
      expect(matrix.m11.toNumber()).toBe(4);
    });

    test('should throw error for invalid array length', () => {
      expect(() => FixedMatrix2x2.fromArray([1, 2, 3])).toThrow('Array must have exactly 4 elements');
      expect(() => FixedMatrix2x2.fromArray([1, 2, 3, 4, 5])).toThrow('Array must have exactly 4 elements');
    });
  });

  describe('Arithmetic Operations', () => {
    test('should add matrices correctly', () => {
      const a = new FixedMatrix2x2(1, 2, 3, 4);
      const b = new FixedMatrix2x2(5, 6, 7, 8);
      const result = a.add(b);

      expect(result.m00.toNumber()).toBe(6);
      expect(result.m01.toNumber()).toBe(8);
      expect(result.m10.toNumber()).toBe(10);
      expect(result.m11.toNumber()).toBe(12);
    });

    test('should add matrices in place', () => {
      const a = new FixedMatrix2x2(1, 2, 3, 4);
      const b = new FixedMatrix2x2(5, 6, 7, 8);
      const result = a.addInPlace(b);

      expect(result).toBe(a); // Should return same instance
      expect(a.m00.toNumber()).toBe(6);
      expect(a.m01.toNumber()).toBe(8);
      expect(a.m10.toNumber()).toBe(10);
      expect(a.m11.toNumber()).toBe(12);
    });

    test('should subtract matrices correctly', () => {
      const a = new FixedMatrix2x2(5, 6, 7, 8);
      const b = new FixedMatrix2x2(1, 2, 3, 4);
      const result = a.subtract(b);

      expect(result.m00.toNumber()).toBe(4);
      expect(result.m01.toNumber()).toBe(4);
      expect(result.m10.toNumber()).toBe(4);
      expect(result.m11.toNumber()).toBe(4);
    });

    test('should subtract matrices in place', () => {
      const a = new FixedMatrix2x2(5, 6, 7, 8);
      const b = new FixedMatrix2x2(1, 2, 3, 4);
      const result = a.subtractInPlace(b);

      expect(result).toBe(a); // Should return same instance
      expect(a.m00.toNumber()).toBe(4);
      expect(a.m01.toNumber()).toBe(4);
      expect(a.m10.toNumber()).toBe(4);
      expect(a.m11.toNumber()).toBe(4);
    });

    test('should multiply matrices correctly', () => {
      const a = new FixedMatrix2x2(1, 2, 3, 4);
      const b = new FixedMatrix2x2(5, 6, 7, 8);
      const result = a.multiply(b);

      // [1, 2] * [5, 6] = [1*5+2*7, 1*6+2*8] = [19, 22]
      // [3, 4]   [7, 8]   [3*5+4*7, 3*6+4*8]   [43, 50]
      expect(result.m00.toNumber()).toBe(19);
      expect(result.m01.toNumber()).toBe(22);
      expect(result.m10.toNumber()).toBe(43);
      expect(result.m11.toNumber()).toBe(50);
    });

    test('should multiply by scalar correctly', () => {
      const matrix = new FixedMatrix2x2(1, 2, 3, 4);
      const result = matrix.multiplyScalar(new Fixed(2));

      expect(result.m00.toNumber()).toBe(2);
      expect(result.m01.toNumber()).toBe(4);
      expect(result.m10.toNumber()).toBe(6);
      expect(result.m11.toNumber()).toBe(8);
    });

    test('should multiply by scalar in place', () => {
      const matrix = new FixedMatrix2x2(1, 2, 3, 4);
      const result = matrix.multiplyScalarInPlace(new Fixed(2));

      expect(result).toBe(matrix); // Should return same instance
      expect(matrix.m00.toNumber()).toBe(2);
      expect(matrix.m01.toNumber()).toBe(4);
      expect(matrix.m10.toNumber()).toBe(6);
      expect(matrix.m11.toNumber()).toBe(8);
    });
  });

  describe('Vector Transformation', () => {
    test('should transform vector correctly', () => {
      const matrix = new FixedMatrix2x2(2, 0, 0, 3); // Scaling matrix
      const vector = new FixedVector2(4, 5);
      const result = matrix.transformVector(vector);

      expect(result.x.toNumber()).toBe(8); // 2 * 4
      expect(result.y.toNumber()).toBe(15); // 3 * 5
    });

    test('should rotate vector correctly', () => {
      const rotation90 = FixedMatrix2x2.rotation(Fixed.PI_2);
      const vector = new FixedVector2(1, 0);
      const result = rotation90.transformVector(vector);

      // Rotating (1, 0) by 90 degrees should give (0, 1)
      expect(result.x.toNumber()).toBeCloseTo(0, 4);
      expect(result.y.toNumber()).toBeCloseTo(1, 4);
    });
  });

  describe('Matrix Properties', () => {
    test('should calculate determinant correctly', () => {
      const matrix = new FixedMatrix2x2(1, 2, 3, 4);
      const det = matrix.determinant();
      // det = 1*4 - 2*3 = 4 - 6 = -2
      expect(det.toNumber()).toBe(-2);
    });

    test('should calculate inverse correctly', () => {
      const matrix = new FixedMatrix2x2(1, 2, 3, 4);
      const inverse = matrix.inverse();
      
      // For matrix [1, 2; 3, 4], det = -2
      // Inverse = (1/det) * [4, -2; -3, 1] = [-2, 1; 1.5, -0.5]
      expect(inverse.m00.toNumber()).toBeCloseTo(-2, 4);
      expect(inverse.m01.toNumber()).toBeCloseTo(1, 4);
      expect(inverse.m10.toNumber()).toBeCloseTo(1.5, 4);
      expect(inverse.m11.toNumber()).toBeCloseTo(-0.5, 4);
    });

    test('should throw error for non-invertible matrix', () => {
      const singular = new FixedMatrix2x2(1, 2, 2, 4); // det = 0
      expect(() => singular.inverse()).toThrow('Matrix is not invertible');
    });

    test('should transpose correctly', () => {
      const matrix = new FixedMatrix2x2(1, 2, 3, 4);
      const transposed = matrix.transpose();

      expect(transposed.m00.toNumber()).toBe(1);
      expect(transposed.m01.toNumber()).toBe(3);
      expect(transposed.m10.toNumber()).toBe(2);
      expect(transposed.m11.toNumber()).toBe(4);
    });

    test('should calculate trace correctly', () => {
      const matrix = new FixedMatrix2x2(1, 2, 3, 4);
      const trace = matrix.trace();
      // trace = m00 + m11 = 1 + 4 = 5
      expect(trace.toNumber()).toBe(5);
    });
  });

  describe('Utility Methods', () => {
    test('should check equality correctly', () => {
      const a = new FixedMatrix2x2(1, 2, 3, 4);
      const b = new FixedMatrix2x2(1, 2, 3, 4);
      const c = new FixedMatrix2x2(1, 2, 3, 5);

      expect(a.equals(b)).toBe(true);
      expect(a.equals(c)).toBe(false);
    });

    test('should check identity correctly', () => {
      const identity = FixedMatrix2x2.identity();
      const notIdentity = new FixedMatrix2x2(1, 2, 3, 4);

      expect(identity.isIdentity()).toBe(true);
      expect(notIdentity.isIdentity()).toBe(false);
    });

    test('should clone correctly', () => {
      const original = new FixedMatrix2x2(1, 2, 3, 4);
      const clone = original.clone();

      expect(clone.equals(original)).toBe(true);
      expect(clone).not.toBe(original); // Different instances
    });

    test('should convert to array correctly', () => {
      const matrix = new FixedMatrix2x2(1, 2, 3, 4);
      const array = matrix.toArray();

      expect(array).toEqual([1, 2, 3, 4]);
    });

    test('should convert to string correctly', () => {
      const matrix = new FixedMatrix2x2(1, 2, 3, 4);
      const str = matrix.toString();

      expect(str).toBe('[1, 2]\n[3, 4]');
    });
  });

  describe('Static Constants', () => {
    test('should have correct static constants', () => {
      expect(FixedMatrix2x2.IDENTITY.isIdentity()).toBe(true);
      expect(FixedMatrix2x2.ZERO.equals(FixedMatrix2x2.zero())).toBe(true);
    });
  });
});
