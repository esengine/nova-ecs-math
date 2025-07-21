import { Fixed } from './Fixed';
import { FixedVector2 } from './FixedVector2';

/**
 * Rectangle using fixed-point arithmetic for deterministic calculations
 * 使用定点算术的矩形，用于确定性计算
 */
export class FixedRect {
  public x: Fixed;
  public y: Fixed;
  public width: Fixed;
  public height: Fixed;

  /**
   * Create a new fixed-point rectangle
   * 创建新的定点矩形
   * 
   * @param x - X coordinate of the top-left corner
   * @param y - Y coordinate of the top-left corner
   * @param width - Width of the rectangle
   * @param height - Height of the rectangle
   */
  constructor(
    x: Fixed | number = 0,
    y: Fixed | number = 0,
    width: Fixed | number = 0,
    height: Fixed | number = 0
  ) {
    this.x = x instanceof Fixed ? x : new Fixed(x);
    this.y = y instanceof Fixed ? y : new Fixed(y);
    this.width = width instanceof Fixed ? width : new Fixed(width);
    this.height = height instanceof Fixed ? height : new Fixed(height);
  }

  /**
   * Get the left edge X coordinate
   * 获取左边缘X坐标
   */
  get left(): Fixed {
    return this.x;
  }

  /**
   * Get the right edge X coordinate
   * 获取右边缘X坐标
   */
  get right(): Fixed {
    return this.x.add(this.width);
  }

  /**
   * Get the top edge Y coordinate
   * 获取顶边Y坐标
   */
  get top(): Fixed {
    return this.y;
  }

  /**
   * Get the bottom edge Y coordinate
   * 获取底边Y坐标
   */
  get bottom(): Fixed {
    return this.y.add(this.height);
  }

  /**
   * Get the center point of the rectangle
   * 获取矩形的中心点
   */
  get center(): FixedVector2 {
    return new FixedVector2(
      this.x.add(this.width.divide(new Fixed(2))),
      this.y.add(this.height.divide(new Fixed(2)))
    );
  }

  /**
   * Get the top-left corner as a vector
   * 获取左上角作为向量
   */
  get topLeft(): FixedVector2 {
    return new FixedVector2(this.x, this.y);
  }

  /**
   * Get the top-right corner as a vector
   * 获取右上角作为向量
   */
  get topRight(): FixedVector2 {
    return new FixedVector2(this.right, this.y);
  }

  /**
   * Get the bottom-left corner as a vector
   * 获取左下角作为向量
   */
  get bottomLeft(): FixedVector2 {
    return new FixedVector2(this.x, this.bottom);
  }

  /**
   * Get the bottom-right corner as a vector
   * 获取右下角作为向量
   */
  get bottomRight(): FixedVector2 {
    return new FixedVector2(this.right, this.bottom);
  }

  /**
   * Check if a point is inside this rectangle
   * 检查点是否在此矩形内
   */
  contains(point: FixedVector2): boolean {
    return point.x.greaterThanOrEqual(this.x) &&
           point.x.lessThan(this.right) &&
           point.y.greaterThanOrEqual(this.y) &&
           point.y.lessThan(this.bottom);
  }

  /**
   * Check if a point is inside this rectangle (inclusive of edges)
   * 检查点是否在此矩形内（包含边缘）
   */
  containsInclusive(point: FixedVector2): boolean {
    return point.x.greaterThanOrEqual(this.x) &&
           point.x.lessThanOrEqual(this.right) &&
           point.y.greaterThanOrEqual(this.y) &&
           point.y.lessThanOrEqual(this.bottom);
  }

  /**
   * Check if this rectangle intersects with another rectangle
   * 检查此矩形是否与另一个矩形相交
   */
  intersects(other: FixedRect): boolean {
    return this.left.lessThan(other.right) &&
           this.right.greaterThan(other.left) &&
           this.top.lessThan(other.bottom) &&
           this.bottom.greaterThan(other.top);
  }

  /**
   * Get the intersection rectangle with another rectangle
   * 获取与另一个矩形的交集矩形
   */
  intersection(other: FixedRect): FixedRect | null {
    if (!this.intersects(other)) {
      return null;
    }

    const left = Fixed.max(this.left, other.left);
    const top = Fixed.max(this.top, other.top);
    const right = Fixed.min(this.right, other.right);
    const bottom = Fixed.min(this.bottom, other.bottom);

    return new FixedRect(
      left,
      top,
      right.subtract(left),
      bottom.subtract(top)
    );
  }

  /**
   * Get the union rectangle with another rectangle
   * 获取与另一个矩形的并集矩形
   */
  union(other: FixedRect): FixedRect {
    const left = Fixed.min(this.left, other.left);
    const top = Fixed.min(this.top, other.top);
    const right = Fixed.max(this.right, other.right);
    const bottom = Fixed.max(this.bottom, other.bottom);

    return new FixedRect(
      left,
      top,
      right.subtract(left),
      bottom.subtract(top)
    );
  }

  /**
   * Expand the rectangle by the given amount in all directions
   * 在所有方向上按给定量扩展矩形
   */
  expand(amount: Fixed | number): FixedRect {
    const amt = amount instanceof Fixed ? amount : new Fixed(amount);
    return new FixedRect(
      this.x.subtract(amt),
      this.y.subtract(amt),
      this.width.add(amt.multiply(new Fixed(2))),
      this.height.add(amt.multiply(new Fixed(2)))
    );
  }

  /**
   * Shrink the rectangle by the given amount in all directions
   * 在所有方向上按给定量收缩矩形
   */
  shrink(amount: Fixed | number): FixedRect {
    const amt = amount instanceof Fixed ? amount : new Fixed(amount);
    return this.expand(amt.negate());
  }

  /**
   * Move the rectangle by the given offset
   * 按给定偏移量移动矩形
   */
  translate(offset: FixedVector2): FixedRect {
    return new FixedRect(
      this.x.add(offset.x),
      this.y.add(offset.y),
      this.width,
      this.height
    );
  }

  /**
   * Create a copy of this rectangle
   * 创建此矩形的副本
   */
  clone(): FixedRect {
    return new FixedRect(this.x, this.y, this.width, this.height);
  }

  /**
   * Check if this rectangle equals another rectangle
   * 检查此矩形是否等于另一个矩形
   */
  equals(other: FixedRect): boolean {
    return this.x.equals(other.x) &&
           this.y.equals(other.y) &&
           this.width.equals(other.width) &&
           this.height.equals(other.height);
  }

  /**
   * Get the area of the rectangle
   * 获取矩形的面积
   */
  area(): Fixed {
    return this.width.multiply(this.height);
  }

  /**
   * Get the perimeter of the rectangle
   * 获取矩形的周长
   */
  perimeter(): Fixed {
    return this.width.add(this.height).multiply(new Fixed(2));
  }

  /**
   * Check if the rectangle is empty (zero or negative area)
   * 检查矩形是否为空（零或负面积）
   */
  isEmpty(): boolean {
    return this.width.lessThanOrEqual(Fixed.ZERO) || 
           this.height.lessThanOrEqual(Fixed.ZERO);
  }

  /**
   * Convert to string representation
   * 转换为字符串表示
   */
  toString(): string {
    return `FixedRect(${this.x.toString()}, ${this.y.toString()}, ${this.width.toString()}, ${this.height.toString()})`;
  }

  /**
   * Convert to a regular number array [x, y, width, height]
   * 转换为普通数字数组 [x, y, width, height]
   */
  toArray(): number[] {
    return [
      this.x.toNumber(),
      this.y.toNumber(),
      this.width.toNumber(),
      this.height.toNumber()
    ];
  }

  /**
   * Create a rectangle from an array [x, y, width, height]
   * 从数组创建矩形 [x, y, width, height]
   */
  static fromArray(array: number[]): FixedRect {
    if (array.length !== 4) {
      throw new Error('Array must have exactly 4 elements');
    }
    return new FixedRect(array[0], array[1], array[2], array[3]);
  }

  /**
   * Create a rectangle from two corner points
   * 从两个角点创建矩形
   */
  static fromCorners(corner1: FixedVector2, corner2: FixedVector2): FixedRect {
    const left = Fixed.min(corner1.x, corner2.x);
    const top = Fixed.min(corner1.y, corner2.y);
    const right = Fixed.max(corner1.x, corner2.x);
    const bottom = Fixed.max(corner1.y, corner2.y);

    return new FixedRect(
      left,
      top,
      right.subtract(left),
      bottom.subtract(top)
    );
  }

  /**
   * Create a rectangle centered at the given point
   * 创建以给定点为中心的矩形
   */
  static centered(center: FixedVector2, width: Fixed | number, height: Fixed | number): FixedRect {
    const w = width instanceof Fixed ? width : new Fixed(width);
    const h = height instanceof Fixed ? height : new Fixed(height);
    const halfW = w.divide(new Fixed(2));
    const halfH = h.divide(new Fixed(2));

    return new FixedRect(
      center.x.subtract(halfW),
      center.y.subtract(halfH),
      w,
      h
    );
  }

  // Static constants
  static readonly ZERO = new FixedRect(0, 0, 0, 0);
  static readonly UNIT = new FixedRect(0, 0, 1, 1);
}
