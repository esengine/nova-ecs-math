import { Fixed } from './Fixed';
import { FixedVector2 } from './FixedVector2';
import { FixedRect } from './FixedRect';
import { FixedCircle } from './FixedCircle';

/**
 * Utility functions for geometric calculations using fixed-point arithmetic
 * 使用定点算术进行几何计算的实用函数
 */
export class GeometryUtils {
  
  /**
   * Calculate the distance between two points
   * 计算两点之间的距离
   */
  static distance(point1: FixedVector2, point2: FixedVector2): Fixed {
    return point1.distance(point2);
  }

  /**
   * Calculate the squared distance between two points (faster than distance)
   * 计算两点之间的距离平方（比距离计算更快）
   */
  static distanceSquared(point1: FixedVector2, point2: FixedVector2): Fixed {
    return point1.sqrDistance(point2);
  }

  /**
   * Check if a point is inside a triangle
   * 检查点是否在三角形内
   */
  static pointInTriangle(point: FixedVector2, a: FixedVector2, b: FixedVector2, c: FixedVector2): boolean {
    // Using barycentric coordinates
    const v0 = c.subtract(a);
    const v1 = b.subtract(a);
    const v2 = point.subtract(a);

    const dot00 = v0.dot(v0);
    const dot01 = v0.dot(v1);
    const dot02 = v0.dot(v2);
    const dot11 = v1.dot(v1);
    const dot12 = v1.dot(v2);

    const invDenom = Fixed.ONE.divide(dot00.multiply(dot11).subtract(dot01.multiply(dot01)));
    const u = dot11.multiply(dot02).subtract(dot01.multiply(dot12)).multiply(invDenom);
    const v = dot00.multiply(dot12).subtract(dot01.multiply(dot02)).multiply(invDenom);

    return u.greaterThanOrEqual(Fixed.ZERO) && 
           v.greaterThanOrEqual(Fixed.ZERO) && 
           u.add(v).lessThanOrEqual(Fixed.ONE);
  }

  /**
   * Calculate the area of a triangle
   * 计算三角形的面积
   */
  static triangleArea(a: FixedVector2, b: FixedVector2, c: FixedVector2): Fixed {
    // Using cross product: |AB × AC| / 2
    const ab = b.subtract(a);
    const ac = c.subtract(a);
    const crossProduct = ab.cross(ac);
    return crossProduct.abs().divide(new Fixed(2));
  }

  /**
   * Calculate the centroid of a triangle
   * 计算三角形的重心
   */
  static triangleCentroid(a: FixedVector2, b: FixedVector2, c: FixedVector2): FixedVector2 {
    const x = a.x.add(b.x).add(c.x).divide(new Fixed(3));
    const y = a.y.add(b.y).add(c.y).divide(new Fixed(3));
    return new FixedVector2(x, y);
  }

  /**
   * Check if two line segments intersect
   * 检查两条线段是否相交
   */
  static lineSegmentsIntersect(
    p1: FixedVector2, q1: FixedVector2,
    p2: FixedVector2, q2: FixedVector2
  ): boolean {
    const orientation = (p: FixedVector2, q: FixedVector2, r: FixedVector2): number => {
      const val = q.y.subtract(p.y).multiply(r.x.subtract(q.x))
        .subtract(q.x.subtract(p.x).multiply(r.y.subtract(q.y)));
      
      if (val.equals(Fixed.ZERO)) return 0; // Collinear
      return val.greaterThan(Fixed.ZERO) ? 1 : 2; // Clockwise or Counterclockwise
    };

    const onSegment = (p: FixedVector2, q: FixedVector2, r: FixedVector2): boolean => {
      return q.x.lessThanOrEqual(Fixed.max(p.x, r.x)) &&
             q.x.greaterThanOrEqual(Fixed.min(p.x, r.x)) &&
             q.y.lessThanOrEqual(Fixed.max(p.y, r.y)) &&
             q.y.greaterThanOrEqual(Fixed.min(p.y, r.y));
    };

    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    // General case
    if (o1 !== o2 && o3 !== o4) return true;

    // Special cases
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;

    return false;
  }

  /**
   * Find the intersection point of two lines (not segments)
   * 找到两条直线（非线段）的交点
   */
  static lineIntersection(
    p1: FixedVector2, p2: FixedVector2,
    p3: FixedVector2, p4: FixedVector2
  ): FixedVector2 | null {
    const x1 = p1.x, y1 = p1.y;
    const x2 = p2.x, y2 = p2.y;
    const x3 = p3.x, y3 = p3.y;
    const x4 = p4.x, y4 = p4.y;

    const denom = x1.subtract(x2).multiply(y3.subtract(y4))
      .subtract(y1.subtract(y2).multiply(x3.subtract(x4)));

    if (denom.equals(Fixed.ZERO)) {
      return null; // Lines are parallel
    }

    const t = x1.subtract(x3).multiply(y3.subtract(y4))
      .subtract(y1.subtract(y3).multiply(x3.subtract(x4)))
      .divide(denom);

    const x = x1.add(t.multiply(x2.subtract(x1)));
    const y = y1.add(t.multiply(y2.subtract(y1)));

    return new FixedVector2(x, y);
  }

  /**
   * Calculate the closest point on a line segment to a given point
   * 计算线段上距离给定点最近的点
   */
  static closestPointOnLineSegment(
    point: FixedVector2,
    lineStart: FixedVector2,
    lineEnd: FixedVector2
  ): FixedVector2 {
    const line = lineEnd.subtract(lineStart);
    const lineLength = line.sqrMagnitude();

    if (lineLength.equals(Fixed.ZERO)) {
      return lineStart; // Line is a point
    }

    const t = point.subtract(lineStart).dot(line).divide(lineLength);
    const clampedT = t.clamp(Fixed.ZERO, Fixed.ONE);

    return lineStart.add(line.multiply(clampedT));
  }

  /**
   * Check if a point is inside a polygon (using ray casting algorithm)
   * 检查点是否在多边形内（使用射线投射算法）
   */
  static pointInPolygon(point: FixedVector2, polygon: FixedVector2[]): boolean {
    if (polygon.length < 3) return false;

    let inside = false;
    const x = point.x;
    const y = point.y;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;

      if (yi.greaterThan(y) !== yj.greaterThan(y) &&
          x.lessThan(xj.subtract(xi).multiply(y.subtract(yi)).divide(yj.subtract(yi)).add(xi))) {
        inside = !inside;
      }
    }

    return inside;
  }

  /**
   * Calculate the area of a polygon
   * 计算多边形的面积
   */
  static polygonArea(polygon: FixedVector2[]): Fixed {
    if (polygon.length < 3) return Fixed.ZERO;

    let area = Fixed.ZERO;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area = area.add(polygon[i].x.multiply(polygon[j].y));
      area = area.subtract(polygon[j].x.multiply(polygon[i].y));
    }

    return area.abs().divide(new Fixed(2));
  }

  /**
   * Calculate the centroid of a polygon
   * 计算多边形的重心
   */
  static polygonCentroid(polygon: FixedVector2[]): FixedVector2 {
    if (polygon.length === 0) return FixedVector2.ZERO;
    if (polygon.length === 1) return polygon[0];

    let area = Fixed.ZERO;
    let centroidX = Fixed.ZERO;
    let centroidY = Fixed.ZERO;

    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      const cross = polygon[i].x.multiply(polygon[j].y).subtract(polygon[j].x.multiply(polygon[i].y));
      area = area.add(cross);
      centroidX = centroidX.add(polygon[i].x.add(polygon[j].x).multiply(cross));
      centroidY = centroidY.add(polygon[i].y.add(polygon[j].y).multiply(cross));
    }

    area = area.divide(new Fixed(2));
    if (area.equals(Fixed.ZERO)) {
      // Degenerate polygon, return average of vertices
      let avgX = Fixed.ZERO;
      let avgY = Fixed.ZERO;
      for (const vertex of polygon) {
        avgX = avgX.add(vertex.x);
        avgY = avgY.add(vertex.y);
      }
      const count = new Fixed(polygon.length);
      return new FixedVector2(avgX.divide(count), avgY.divide(count));
    }

    const factor = Fixed.ONE.divide(area.multiply(new Fixed(6)));
    return new FixedVector2(centroidX.multiply(factor), centroidY.multiply(factor));
  }

  /**
   * Check if two rectangles intersect
   * 检查两个矩形是否相交
   */
  static rectanglesIntersect(rect1: FixedRect, rect2: FixedRect): boolean {
    return rect1.intersects(rect2);
  }

  /**
   * Check if two circles intersect
   * 检查两个圆是否相交
   */
  static circlesIntersect(circle1: FixedCircle, circle2: FixedCircle): boolean {
    return circle1.intersects(circle2);
  }

  /**
   * Check if a circle and rectangle intersect
   * 检查圆和矩形是否相交
   */
  static circleRectangleIntersect(circle: FixedCircle, rect: FixedRect): boolean {
    return circle.intersectsRect(rect);
  }

  /**
   * Calculate the angle between two vectors
   * 计算两个向量之间的角度
   */
  static angleBetween(v1: FixedVector2, v2: FixedVector2): Fixed {
    const dot = v1.normalize().dot(v2.normalize());
    return dot.clamp(new Fixed(-1), Fixed.ONE).acos();
  }

  /**
   * Clamp a point to be within a rectangle
   * 将点限制在矩形内
   */
  static clampPointToRect(point: FixedVector2, rect: FixedRect): FixedVector2 {
    const x = point.x.clamp(rect.left, rect.right);
    const y = point.y.clamp(rect.top, rect.bottom);
    return new FixedVector2(x, y);
  }

  /**
   * Get the bounding rectangle of a set of points
   * 获取一组点的边界矩形
   */
  static getBoundingRect(points: FixedVector2[]): FixedRect {
    if (points.length === 0) {
      return FixedRect.ZERO;
    }

    let minX = points[0].x;
    let maxX = points[0].x;
    let minY = points[0].y;
    let maxY = points[0].y;

    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      if (point.x.lessThan(minX)) minX = point.x;
      if (point.x.greaterThan(maxX)) maxX = point.x;
      if (point.y.lessThan(minY)) minY = point.y;
      if (point.y.greaterThan(maxY)) maxY = point.y;
    }

    return new FixedRect(minX, minY, maxX.subtract(minX), maxY.subtract(minY));
  }

  /**
   * Get the bounding circle of a set of points
   * 获取一组点的边界圆
   */
  static getBoundingCircle(points: FixedVector2[]): FixedCircle {
    return FixedCircle.fromPoints(points);
  }
}
