import { Fixed } from './Fixed';
import { FixedVector2 } from './FixedVector2';
import { FixedRect } from './FixedRect';

/**
 * Circle using fixed-point arithmetic for deterministic calculations
 * 使用定点算术的圆形，用于确定性计算
 */
export class FixedCircle {
  public center: FixedVector2;
  public radius: Fixed;

  /**
   * Create a new fixed-point circle
   * 创建新的定点圆形
   * 
   * @param center - Center point of the circle
   * @param radius - Radius of the circle
   */
  constructor(center: FixedVector2, radius: Fixed | number);
  constructor(x: Fixed | number, y: Fixed | number, radius: Fixed | number);
  constructor(
    centerOrX: FixedVector2 | Fixed | number,
    radiusOrY: Fixed | number,
    radius?: Fixed | number
  ) {
    if (centerOrX instanceof FixedVector2) {
      this.center = centerOrX;
      this.radius = radiusOrY instanceof Fixed ? radiusOrY : new Fixed(radiusOrY);
    } else {
      const x = centerOrX instanceof Fixed ? centerOrX : new Fixed(centerOrX);
      const y = radiusOrY instanceof Fixed ? radiusOrY : new Fixed(radiusOrY);
      this.center = new FixedVector2(x, y);
      this.radius = radius instanceof Fixed ? radius : new Fixed(radius!);
    }
  }

  /**
   * Get the X coordinate of the center
   * 获取中心点的X坐标
   */
  get x(): Fixed {
    return this.center.x;
  }

  /**
   * Set the X coordinate of the center
   * 设置中心点的X坐标
   */
  set x(value: Fixed | number) {
    this.center.x = value instanceof Fixed ? value : new Fixed(value);
  }

  /**
   * Get the Y coordinate of the center
   * 获取中心点的Y坐标
   */
  get y(): Fixed {
    return this.center.y;
  }

  /**
   * Set the Y coordinate of the center
   * 设置中心点的Y坐标
   */
  set y(value: Fixed | number) {
    this.center.y = value instanceof Fixed ? value : new Fixed(value);
  }

  /**
   * Get the diameter of the circle
   * 获取圆的直径
   */
  get diameter(): Fixed {
    return this.radius.multiply(new Fixed(2));
  }

  /**
   * Set the diameter of the circle (updates radius)
   * 设置圆的直径（更新半径）
   */
  set diameter(value: Fixed | number) {
    const d = value instanceof Fixed ? value : new Fixed(value);
    this.radius = d.divide(new Fixed(2));
  }

  /**
   * Check if a point is inside this circle
   * 检查点是否在此圆内
   */
  contains(point: FixedVector2): boolean {
    const distance = this.center.distance(point);
    return distance.lessThan(this.radius);
  }

  /**
   * Check if a point is inside this circle (inclusive of edge)
   * 检查点是否在此圆内（包含边缘）
   */
  containsInclusive(point: FixedVector2): boolean {
    const distance = this.center.distance(point);
    return distance.lessThanOrEqual(this.radius);
  }

  /**
   * Check if this circle intersects with another circle
   * 检查此圆是否与另一个圆相交
   */
  intersects(other: FixedCircle): boolean {
    const distance = this.center.distance(other.center);
    const radiusSum = this.radius.add(other.radius);
    return distance.lessThan(radiusSum);
  }

  /**
   * Check if this circle intersects with a rectangle
   * 检查此圆是否与矩形相交
   */
  intersectsRect(rect: FixedRect): boolean {
    // Find the closest point on the rectangle to the circle center
    const closestX = this.center.x.clamp(rect.left, rect.right);
    const closestY = this.center.y.clamp(rect.top, rect.bottom);
    const closest = new FixedVector2(closestX, closestY);
    
    // Check if the distance to the closest point is less than the radius
    const distance = this.center.distance(closest);
    return distance.lessThanOrEqual(this.radius);
  }

  /**
   * Check if this circle completely contains another circle
   * 检查此圆是否完全包含另一个圆
   */
  containsCircle(other: FixedCircle): boolean {
    const distance = this.center.distance(other.center);
    const radiusDiff = this.radius.subtract(other.radius);
    return distance.lessThanOrEqual(radiusDiff) && radiusDiff.greaterThanOrEqual(Fixed.ZERO);
  }

  /**
   * Check if this circle is completely contained within another circle
   * 检查此圆是否完全被另一个圆包含
   */
  isContainedBy(other: FixedCircle): boolean {
    return other.containsCircle(this);
  }

  /**
   * Get the area of the circle
   * 获取圆的面积
   */
  area(): Fixed {
    // Area = π * r²
    return Fixed.PI.multiply(this.radius.multiply(this.radius));
  }

  /**
   * Get the circumference of the circle
   * 获取圆的周长
   */
  circumference(): Fixed {
    // Circumference = 2 * π * r
    return new Fixed(2).multiply(Fixed.PI).multiply(this.radius);
  }

  /**
   * Get the bounding rectangle of the circle
   * 获取圆的边界矩形
   */
  getBounds(): FixedRect {
    return new FixedRect(
      this.center.x.subtract(this.radius),
      this.center.y.subtract(this.radius),
      this.diameter,
      this.diameter
    );
  }

  /**
   * Move the circle by the given offset
   * 按给定偏移量移动圆
   */
  translate(offset: FixedVector2): FixedCircle {
    return new FixedCircle(this.center.add(offset), this.radius);
  }

  /**
   * Scale the circle by the given factor
   * 按给定因子缩放圆
   */
  scale(factor: Fixed | number): FixedCircle {
    const f = factor instanceof Fixed ? factor : new Fixed(factor);
    return new FixedCircle(this.center, this.radius.multiply(f));
  }

  /**
   * Get the closest point on the circle to the given point
   * 获取圆上距离给定点最近的点
   */
  closestPointTo(point: FixedVector2): FixedVector2 {
    const direction = point.subtract(this.center).normalize();
    return this.center.add(direction.multiply(this.radius));
  }

  /**
   * Get the distance from the circle edge to the given point
   * 获取从圆边缘到给定点的距离
   */
  distanceToPoint(point: FixedVector2): Fixed {
    const centerDistance = this.center.distance(point);
    return centerDistance.subtract(this.radius);
  }

  /**
   * Get a point on the circle at the given angle
   * 获取圆上给定角度的点
   * 
   * @param angle - Angle in radians (0 = right, π/2 = up)
   */
  pointAtAngle(angle: Fixed | number): FixedVector2 {
    const a = angle instanceof Fixed ? angle : new Fixed(angle);
    const x = this.center.x.add(this.radius.multiply(a.cos()));
    const y = this.center.y.add(this.radius.multiply(a.sin()));
    return new FixedVector2(x, y);
  }

  /**
   * Get the angle from the center to the given point
   * 获取从中心到给定点的角度
   */
  angleToPoint(point: FixedVector2): Fixed {
    const direction = point.subtract(this.center);
    return direction.angle();
  }

  /**
   * Create a copy of this circle
   * 创建此圆的副本
   */
  clone(): FixedCircle {
    return new FixedCircle(this.center.clone(), this.radius);
  }

  /**
   * Check if this circle equals another circle
   * 检查此圆是否等于另一个圆
   */
  equals(other: FixedCircle): boolean {
    return this.center.equals(other.center) && this.radius.equals(other.radius);
  }

  /**
   * Convert to string representation
   * 转换为字符串表示
   */
  toString(): string {
    return `FixedCircle(center: ${this.center.toString()}, radius: ${this.radius.toString()})`;
  }

  /**
   * Convert to a regular number array [x, y, radius]
   * 转换为普通数字数组 [x, y, radius]
   */
  toArray(): number[] {
    return [this.center.x.toNumber(), this.center.y.toNumber(), this.radius.toNumber()];
  }

  /**
   * Create a circle from an array [x, y, radius]
   * 从数组创建圆 [x, y, radius]
   */
  static fromArray(array: number[]): FixedCircle {
    if (array.length !== 3) {
      throw new Error('Array must have exactly 3 elements');
    }
    return new FixedCircle(array[0], array[1], array[2]);
  }

  /**
   * Create a circle that encompasses the given points
   * 创建包含给定点的圆
   */
  static fromPoints(points: FixedVector2[]): FixedCircle {
    if (points.length === 0) {
      return new FixedCircle(FixedVector2.ZERO, Fixed.ZERO);
    }
    
    if (points.length === 1) {
      return new FixedCircle(points[0], Fixed.ZERO);
    }

    // Simple implementation: find center as average of points, radius as max distance
    let centerX = Fixed.ZERO;
    let centerY = Fixed.ZERO;
    
    for (const point of points) {
      centerX = centerX.add(point.x);
      centerY = centerY.add(point.y);
    }
    
    const count = new Fixed(points.length);
    const center = new FixedVector2(centerX.divide(count), centerY.divide(count));
    
    let maxDistance = Fixed.ZERO;
    for (const point of points) {
      const distance = center.distance(point);
      if (distance.greaterThan(maxDistance)) {
        maxDistance = distance;
      }
    }
    
    return new FixedCircle(center, maxDistance);
  }

  /**
   * Create a circle from a bounding rectangle (inscribed circle)
   * 从边界矩形创建圆（内接圆）
   */
  static inscribedInRect(rect: FixedRect): FixedCircle {
    const center = rect.center;
    const radius = Fixed.min(rect.width, rect.height).divide(new Fixed(2));
    return new FixedCircle(center, radius);
  }

  /**
   * Create a circle from a bounding rectangle (circumscribed circle)
   * 从边界矩形创建圆（外接圆）
   */
  static circumscribedAroundRect(rect: FixedRect): FixedCircle {
    const center = rect.center;
    const radius = rect.width.multiply(rect.width)
      .add(rect.height.multiply(rect.height))
      .sqrt()
      .divide(new Fixed(2));
    return new FixedCircle(center, radius);
  }

  // Static constants
  static readonly ZERO = new FixedCircle(FixedVector2.ZERO, Fixed.ZERO);
  static readonly UNIT = new FixedCircle(FixedVector2.ZERO, Fixed.ONE);
}
