import { describe, test, expect } from 'vitest';
import { Fixed } from '../src/Fixed';
import { FixedVector2 } from '../src/FixedVector2';
import { FixedCircle } from '../src/FixedCircle';
import { FixedRect } from '../src/FixedRect';

describe('FixedCircle', () => {
  describe('Construction', () => {
    test('should create circle with center and radius', () => {
      const center = new FixedVector2(10, 20);
      const radius = new Fixed(5);
      const circle = new FixedCircle(center, radius);

      expect(circle.center.equals(center)).toBe(true);
      expect(circle.radius.equals(radius)).toBe(true);
    });

    test('should create circle with x, y, radius', () => {
      const circle = new FixedCircle(10, 20, 5);

      expect(circle.x.toNumber()).toBeCloseTo(10, 5);
      expect(circle.y.toNumber()).toBeCloseTo(20, 5);
      expect(circle.radius.toNumber()).toBeCloseTo(5, 5);
    });

    test('should handle number and Fixed inputs', () => {
      const circle1 = new FixedCircle(new FixedVector2(10, 20), new Fixed(5));
      const circle2 = new FixedCircle(10, 20, 5);

      expect(circle1.equals(circle2)).toBe(true);
    });
  });

  describe('Properties', () => {
    test('should get and set center coordinates', () => {
      const circle = new FixedCircle(10, 20, 5);

      expect(circle.x.toNumber()).toBeCloseTo(10, 5);
      expect(circle.y.toNumber()).toBeCloseTo(20, 5);

      circle.x = new Fixed(15);
      circle.y = 25;

      expect(circle.x.toNumber()).toBeCloseTo(15, 5);
      expect(circle.y.toNumber()).toBeCloseTo(25, 5);
    });

    test('should get and set diameter', () => {
      const circle = new FixedCircle(0, 0, 5);

      expect(circle.diameter.toNumber()).toBeCloseTo(10, 5);

      circle.diameter = new Fixed(20);
      expect(circle.radius.toNumber()).toBeCloseTo(10, 5);
    });
  });

  describe('Containment', () => {
    test('should check if point is inside circle', () => {
      const circle = new FixedCircle(0, 0, 5);

      expect(circle.contains(new FixedVector2(0, 0))).toBe(true);
      expect(circle.contains(new FixedVector2(2, 2))).toBe(true); // 2² + 2² = 8 < 25
      expect(circle.contains(new FixedVector2(3, 4))).toBe(false); // 3² + 4² = 25 = 5², on edge
      expect(circle.contains(new FixedVector2(5, 0))).toBe(false); // On edge
      expect(circle.contains(new FixedVector2(6, 0))).toBe(false); // Outside
    });

    test('should check if point is inside circle inclusively', () => {
      const circle = new FixedCircle(0, 0, 5);

      expect(circle.containsInclusive(new FixedVector2(5, 0))).toBe(true); // On edge
      expect(circle.containsInclusive(new FixedVector2(6, 0))).toBe(false); // Outside
    });
  });

  describe('Intersection', () => {
    test('should check circle-circle intersection', () => {
      const circle1 = new FixedCircle(0, 0, 5);
      const circle2 = new FixedCircle(8, 0, 5); // Touching
      const circle3 = new FixedCircle(12, 0, 5); // Not touching

      expect(circle1.intersects(circle2)).toBe(true);
      expect(circle1.intersects(circle3)).toBe(false);
    });

    test('should check circle-rectangle intersection', () => {
      const circle = new FixedCircle(0, 0, 5);
      const rect1 = new FixedRect(-2, -2, 4, 4); // Inside circle
      const rect2 = new FixedRect(10, 10, 2, 2); // Outside circle

      expect(circle.intersectsRect(rect1)).toBe(true);
      expect(circle.intersectsRect(rect2)).toBe(false);
    });
  });

  describe('Geometric calculations', () => {
    test('should calculate area correctly', () => {
      const circle = new FixedCircle(0, 0, 5);
      const expectedArea = Fixed.PI.multiply(new Fixed(25)); // π * r²

      expect(circle.area().subtract(expectedArea).abs().lessThan(new Fixed(0.001))).toBe(true);
    });

    test('should calculate circumference correctly', () => {
      const circle = new FixedCircle(0, 0, 5);
      const expectedCircumference = new Fixed(2).multiply(Fixed.PI).multiply(new Fixed(5)); // 2 * π * r

      expect(circle.circumference().subtract(expectedCircumference).abs().lessThan(new Fixed(0.001))).toBe(true);
    });

    test('should get bounding rectangle', () => {
      const circle = new FixedCircle(10, 20, 5);
      const bounds = circle.getBounds();

      expect(bounds.x.toNumber()).toBeCloseTo(5, 5);
      expect(bounds.y.toNumber()).toBeCloseTo(15, 5);
      expect(bounds.width.toNumber()).toBeCloseTo(10, 5);
      expect(bounds.height.toNumber()).toBeCloseTo(10, 5);
    });
  });

  describe('Transformations', () => {
    test('should translate circle', () => {
      const circle = new FixedCircle(10, 20, 5);
      const offset = new FixedVector2(5, -3);
      const translated = circle.translate(offset);

      expect(translated.x.toNumber()).toBeCloseTo(15, 5);
      expect(translated.y.toNumber()).toBeCloseTo(17, 5);
      expect(translated.radius.equals(circle.radius)).toBe(true);
    });

    test('should scale circle', () => {
      const circle = new FixedCircle(10, 20, 5);
      const scaled = circle.scale(2);

      expect(scaled.center.equals(circle.center)).toBe(true);
      expect(scaled.radius.toNumber()).toBeCloseTo(10, 5);
    });
  });

  describe('Point operations', () => {
    test('should find closest point on circle', () => {
      const circle = new FixedCircle(0, 0, 5);
      const point = new FixedVector2(10, 0);
      const closest = circle.closestPointTo(point);

      expect(closest.x.toNumber()).toBeCloseTo(5, 5);
      expect(closest.y.toNumber()).toBeCloseTo(0, 5);
    });

    test('should calculate distance to point', () => {
      const circle = new FixedCircle(0, 0, 5);
      const point = new FixedVector2(10, 0);
      const distance = circle.distanceToPoint(point);

      expect(distance.toNumber()).toBeCloseTo(5, 5); // 10 - 5 = 5
    });

    test('should get point at angle', () => {
      const circle = new FixedCircle(0, 0, 5);
      const point = circle.pointAtAngle(0); // 0 radians = right

      expect(point.x.toNumber()).toBeCloseTo(5, 5);
      expect(point.y.toNumber()).toBeCloseTo(0, 5);
    });
  });

  describe('Static methods', () => {
    test('should create circle from array', () => {
      const circle = FixedCircle.fromArray([10, 20, 5]);

      expect(circle.x.toNumber()).toBeCloseTo(10, 5);
      expect(circle.y.toNumber()).toBeCloseTo(20, 5);
      expect(circle.radius.toNumber()).toBeCloseTo(5, 5);
    });

    test('should create circle from points', () => {
      const points = [
        new FixedVector2(0, 0),
        new FixedVector2(10, 0),
        new FixedVector2(5, 5)
      ];
      const circle = FixedCircle.fromPoints(points);

      // Should contain all points
      for (const point of points) {
        expect(circle.containsInclusive(point)).toBe(true);
      }
    });

    test('should create inscribed circle in rectangle', () => {
      const rect = new FixedRect(0, 0, 10, 10);
      const circle = FixedCircle.inscribedInRect(rect);

      expect(circle.center.x.toNumber()).toBeCloseTo(5, 5);
      expect(circle.center.y.toNumber()).toBeCloseTo(5, 5);
      expect(circle.radius.toNumber()).toBeCloseTo(5, 5);
    });
  });

  describe('Utility methods', () => {
    test('should clone circle', () => {
      const circle = new FixedCircle(10, 20, 5);
      const cloned = circle.clone();

      expect(cloned.equals(circle)).toBe(true);
      expect(cloned).not.toBe(circle);
    });

    test('should convert to string', () => {
      const circle = new FixedCircle(10, 20, 5);
      const str = circle.toString();

      expect(str).toContain('FixedCircle');
      expect(str).toContain('10');
      expect(str).toContain('20');
      expect(str).toContain('5');
    });

    test('should convert to array', () => {
      const circle = new FixedCircle(10, 20, 5);
      const array = circle.toArray();

      expect(array).toEqual([10, 20, 5]);
    });
  });

  describe('Constants', () => {
    test('should have ZERO constant', () => {
      expect(FixedCircle.ZERO.center.equals(FixedVector2.ZERO)).toBe(true);
      expect(FixedCircle.ZERO.radius.equals(Fixed.ZERO)).toBe(true);
    });

    test('should have UNIT constant', () => {
      expect(FixedCircle.UNIT.center.equals(FixedVector2.ZERO)).toBe(true);
      expect(FixedCircle.UNIT.radius.equals(Fixed.ONE)).toBe(true);
    });
  });
});
