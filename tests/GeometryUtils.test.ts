import { describe, test, expect } from 'vitest';
import { Fixed } from '../src/Fixed';
import { FixedVector2 } from '../src/FixedVector2';
import { FixedRect } from '../src/FixedRect';
import { FixedCircle } from '../src/FixedCircle';
import { GeometryUtils } from '../src/GeometryUtils';

describe('GeometryUtils', () => {
  describe('Distance calculations', () => {
    test('should calculate distance between points', () => {
      const p1 = new FixedVector2(0, 0);
      const p2 = new FixedVector2(3, 4);
      const distance = GeometryUtils.distance(p1, p2);

      expect(distance.toNumber()).toBeCloseTo(5, 5);
    });

    test('should calculate squared distance', () => {
      const p1 = new FixedVector2(0, 0);
      const p2 = new FixedVector2(3, 4);
      const distanceSquared = GeometryUtils.distanceSquared(p1, p2);

      expect(distanceSquared.toNumber()).toBeCloseTo(25, 5);
    });
  });

  describe('Triangle operations', () => {
    test('should check if point is inside triangle', () => {
      const a = new FixedVector2(0, 0);
      const b = new FixedVector2(10, 0);
      const c = new FixedVector2(5, 10);

      const inside = new FixedVector2(5, 3);
      const outside = new FixedVector2(15, 5);

      expect(GeometryUtils.pointInTriangle(inside, a, b, c)).toBe(true);
      expect(GeometryUtils.pointInTriangle(outside, a, b, c)).toBe(false);
    });

    test('should calculate triangle area', () => {
      const a = new FixedVector2(0, 0);
      const b = new FixedVector2(10, 0);
      const c = new FixedVector2(0, 10);
      const area = GeometryUtils.triangleArea(a, b, c);

      expect(area.toNumber()).toBeCloseTo(50, 5); // (10 * 10) / 2
    });

    test('should calculate triangle centroid', () => {
      const a = new FixedVector2(0, 0);
      const b = new FixedVector2(6, 0);
      const c = new FixedVector2(3, 6);
      const centroid = GeometryUtils.triangleCentroid(a, b, c);

      expect(centroid.x.toNumber()).toBeCloseTo(3, 5); // (0 + 6 + 3) / 3
      expect(centroid.y.toNumber()).toBeCloseTo(2, 5); // (0 + 0 + 6) / 3
    });
  });

  describe('Line segment operations', () => {
    test('should check if line segments intersect', () => {
      const p1 = new FixedVector2(0, 0);
      const q1 = new FixedVector2(10, 10);
      const p2 = new FixedVector2(0, 10);
      const q2 = new FixedVector2(10, 0);

      expect(GeometryUtils.lineSegmentsIntersect(p1, q1, p2, q2)).toBe(true);

      const p3 = new FixedVector2(0, 0);
      const q3 = new FixedVector2(5, 5);
      const p4 = new FixedVector2(10, 0);
      const q4 = new FixedVector2(15, 5);

      expect(GeometryUtils.lineSegmentsIntersect(p3, q3, p4, q4)).toBe(false);
    });

    test('should find line intersection', () => {
      const p1 = new FixedVector2(0, 0);
      const p2 = new FixedVector2(10, 10);
      const p3 = new FixedVector2(0, 10);
      const p4 = new FixedVector2(10, 0);

      const intersection = GeometryUtils.lineIntersection(p1, p2, p3, p4);

      expect(intersection).not.toBeNull();
      expect(intersection!.x.toNumber()).toBeCloseTo(5, 5);
      expect(intersection!.y.toNumber()).toBeCloseTo(5, 5);
    });

    test('should return null for parallel lines', () => {
      const p1 = new FixedVector2(0, 0);
      const p2 = new FixedVector2(10, 0);
      const p3 = new FixedVector2(0, 5);
      const p4 = new FixedVector2(10, 5);

      const intersection = GeometryUtils.lineIntersection(p1, p2, p3, p4);

      expect(intersection).toBeNull();
    });

    test('should find closest point on line segment', () => {
      const point = new FixedVector2(5, 5);
      const lineStart = new FixedVector2(0, 0);
      const lineEnd = new FixedVector2(10, 0);

      const closest = GeometryUtils.closestPointOnLineSegment(point, lineStart, lineEnd);

      expect(closest.x.toNumber()).toBeCloseTo(5, 5);
      expect(closest.y.toNumber()).toBeCloseTo(0, 5);
    });
  });

  describe('Polygon operations', () => {
    test('should check if point is inside polygon', () => {
      const polygon = [
        new FixedVector2(0, 0),
        new FixedVector2(10, 0),
        new FixedVector2(10, 10),
        new FixedVector2(0, 10)
      ];

      const inside = new FixedVector2(5, 5);
      const outside = new FixedVector2(15, 5);

      expect(GeometryUtils.pointInPolygon(inside, polygon)).toBe(true);
      expect(GeometryUtils.pointInPolygon(outside, polygon)).toBe(false);
    });

    test('should calculate polygon area', () => {
      const square = [
        new FixedVector2(0, 0),
        new FixedVector2(10, 0),
        new FixedVector2(10, 10),
        new FixedVector2(0, 10)
      ];

      const area = GeometryUtils.polygonArea(square);
      expect(area.toNumber()).toBeCloseTo(100, 5);
    });

    test('should calculate polygon centroid', () => {
      const square = [
        new FixedVector2(0, 0),
        new FixedVector2(10, 0),
        new FixedVector2(10, 10),
        new FixedVector2(0, 10)
      ];

      const centroid = GeometryUtils.polygonCentroid(square);
      expect(centroid.x.toNumber()).toBeCloseTo(5, 2);
      expect(centroid.y.toNumber()).toBeCloseTo(5, 2);
    });
  });

  describe('Shape intersection tests', () => {
    test('should check rectangle intersection', () => {
      const rect1 = new FixedRect(0, 0, 10, 10);
      const rect2 = new FixedRect(5, 5, 10, 10);
      const rect3 = new FixedRect(20, 20, 10, 10);

      expect(GeometryUtils.rectanglesIntersect(rect1, rect2)).toBe(true);
      expect(GeometryUtils.rectanglesIntersect(rect1, rect3)).toBe(false);
    });

    test('should check circle intersection', () => {
      const circle1 = new FixedCircle(0, 0, 5);
      const circle2 = new FixedCircle(8, 0, 5);
      const circle3 = new FixedCircle(20, 0, 5);

      expect(GeometryUtils.circlesIntersect(circle1, circle2)).toBe(true);
      expect(GeometryUtils.circlesIntersect(circle1, circle3)).toBe(false);
    });

    test('should check circle-rectangle intersection', () => {
      const circle = new FixedCircle(0, 0, 5);
      const rect1 = new FixedRect(-2, -2, 4, 4);
      const rect2 = new FixedRect(10, 10, 2, 2);

      expect(GeometryUtils.circleRectangleIntersect(circle, rect1)).toBe(true);
      expect(GeometryUtils.circleRectangleIntersect(circle, rect2)).toBe(false);
    });
  });

  describe('Angle calculations', () => {
    test('should calculate angle between vectors', () => {
      const v1 = new FixedVector2(1, 0);
      const v2 = new FixedVector2(0, 1);
      const angle = GeometryUtils.angleBetween(v1, v2);

      expect(angle.toNumber()).toBeCloseTo(Math.PI / 2, 5);
    });
  });

  describe('Utility functions', () => {
    test('should clamp point to rectangle', () => {
      const point = new FixedVector2(15, -5);
      const rect = new FixedRect(0, 0, 10, 10);
      const clamped = GeometryUtils.clampPointToRect(point, rect);

      expect(clamped.x.toNumber()).toBeCloseTo(10, 5);
      expect(clamped.y.toNumber()).toBeCloseTo(0, 5);
    });

    test('should get bounding rectangle of points', () => {
      const points = [
        new FixedVector2(2, 3),
        new FixedVector2(8, 1),
        new FixedVector2(5, 9),
        new FixedVector2(1, 4)
      ];

      const bounds = GeometryUtils.getBoundingRect(points);

      expect(bounds.x.toNumber()).toBeCloseTo(1, 5);
      expect(bounds.y.toNumber()).toBeCloseTo(1, 5);
      expect(bounds.width.toNumber()).toBeCloseTo(7, 5); // 8 - 1
      expect(bounds.height.toNumber()).toBeCloseTo(8, 5); // 9 - 1
    });

    test('should get bounding circle of points', () => {
      const points = [
        new FixedVector2(0, 0),
        new FixedVector2(10, 0),
        new FixedVector2(5, 5)
      ];

      const circle = GeometryUtils.getBoundingCircle(points);

      // Should contain all points
      for (const point of points) {
        expect(circle.containsInclusive(point)).toBe(true);
      }
    });

    test('should handle empty point arrays', () => {
      const emptyBounds = GeometryUtils.getBoundingRect([]);
      expect(emptyBounds.equals(FixedRect.ZERO)).toBe(true);

      const emptyCircle = GeometryUtils.getBoundingCircle([]);
      expect(emptyCircle.center.equals(FixedVector2.ZERO)).toBe(true);
      expect(emptyCircle.radius.equals(Fixed.ZERO)).toBe(true);
    });
  });
});
