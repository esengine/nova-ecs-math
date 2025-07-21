import { describe, test, expect, beforeEach } from 'vitest';
import { Fixed } from '../src/Fixed';
import { FixedVector2 } from '../src/FixedVector2';
import {
  FixedPositionComponent,
  FixedVelocityComponent,
  FixedAccelerationComponent
} from '../src/Components';

describe('FixedPositionComponent', () => {
  let component: FixedPositionComponent;

  beforeEach(() => {
    component = new FixedPositionComponent(10, 20);
  });

  test('should initialize with correct position', () => {
    expect(component.position.x.toNumber()).toBe(10);
    expect(component.position.y.toNumber()).toBe(20);
  });

  test('should initialize with default position', () => {
    const defaultComponent = new FixedPositionComponent();
    expect(defaultComponent.position.x.toNumber()).toBe(0);
    expect(defaultComponent.position.y.toNumber()).toBe(0);
  });

  test('should accept Fixed values in constructor', () => {
    const x = new Fixed(5.5);
    const y = new Fixed(7.5);
    const comp = new FixedPositionComponent(x, y);
    
    expect(comp.position.x.equals(x)).toBe(true);
    expect(comp.position.y.equals(y)).toBe(true);
  });

  test('should have correct x and y getters', () => {
    expect(component.x.toNumber()).toBe(10);
    expect(component.y.toNumber()).toBe(20);
  });

  test('should have correct x and y setters with numbers', () => {
    component.x = 15;
    component.y = 25;
    
    expect(component.x.toNumber()).toBe(15);
    expect(component.y.toNumber()).toBe(25);
  });

  test('should have correct x and y setters with Fixed', () => {
    const newX = new Fixed(12.5);
    const newY = new Fixed(22.5);
    
    component.x = newX;
    component.y = newY;
    
    expect(component.x.equals(newX)).toBe(true);
    expect(component.y.equals(newY)).toBe(true);
  });

  test('should set position from coordinates', () => {
    component.setPosition(30, 40);
    
    expect(component.x.toNumber()).toBe(30);
    expect(component.y.toNumber()).toBe(40);
  });

  test('should set position from Fixed coordinates', () => {
    const x = new Fixed(35.5);
    const y = new Fixed(45.5);
    
    component.setPosition(x, y);
    
    expect(component.x.equals(x)).toBe(true);
    expect(component.y.equals(y)).toBe(true);
  });

  test('should set position from vector', () => {
    const vector = new FixedVector2(50, 60);
    component.setPositionFromVector(vector);
    
    expect(component.position.equals(vector)).toBe(true);
    expect(component.position).not.toBe(vector); // Should be a clone
  });

  test('should reset correctly', () => {
    component.reset();
    
    expect(component.x.equals(Fixed.ZERO)).toBe(true);
    expect(component.y.equals(Fixed.ZERO)).toBe(true);
  });

  test('should inherit from Component', () => {
    expect(component.enabled).toBe(true);
    component.enabled = false;
    expect(component.enabled).toBe(false);
  });

  describe('Serialization', () => {
    test('should get serializable properties', () => {
      const props = component.getSerializableProperties();
      
      expect(props.x).toBe(10);
      expect(props.y).toBe(20);
    });

    test('should set serializable properties', () => {
      component.setSerializableProperties({ x: 100, y: 200 });
      
      expect(component.x.toNumber()).toBe(100);
      expect(component.y.toNumber()).toBe(200);
    });

    test('should handle invalid serializable properties gracefully', () => {
      const originalX = component.x.toNumber();
      const originalY = component.y.toNumber();

      // Test with properties that don't match expected types
      component.setSerializableProperties({ someOtherProp: 'invalid' });

      // Should remain unchanged when invalid properties are provided
      expect(component.x.toNumber()).toBe(originalX);
      expect(component.y.toNumber()).toBe(originalY);
    });
  });
});

describe('FixedVelocityComponent', () => {
  let component: FixedVelocityComponent;

  beforeEach(() => {
    component = new FixedVelocityComponent(5, -3);
  });

  test('should initialize with correct velocity', () => {
    expect(component.velocity.x.toNumber()).toBe(5);
    expect(component.velocity.y.toNumber()).toBe(-3);
  });

  test('should initialize with default velocity', () => {
    const defaultComponent = new FixedVelocityComponent();
    expect(defaultComponent.velocity.x.toNumber()).toBe(0);
    expect(defaultComponent.velocity.y.toNumber()).toBe(0);
  });

  test('should have correct x and y getters and setters', () => {
    expect(component.x.toNumber()).toBe(5);
    expect(component.y.toNumber()).toBe(-3);
    
    component.x = 10;
    component.y = -5;
    
    expect(component.x.toNumber()).toBe(10);
    expect(component.y.toNumber()).toBe(-5);
  });

  test('should set velocity from coordinates', () => {
    component.setVelocity(15, -10);
    
    expect(component.x.toNumber()).toBe(15);
    expect(component.y.toNumber()).toBe(-10);
  });

  test('should set velocity from vector', () => {
    const vector = new FixedVector2(20, -15);
    component.setVelocityFromVector(vector);
    
    expect(component.velocity.equals(vector)).toBe(true);
    expect(component.velocity).not.toBe(vector); // Should be a clone
  });

  test('should reset correctly', () => {
    component.reset();

    expect(component.x.equals(Fixed.ZERO)).toBe(true);
    expect(component.y.equals(Fixed.ZERO)).toBe(true);
  });

  describe('Serialization', () => {
    test('should get serializable properties', () => {
      const props = component.getSerializableProperties();

      expect(props.x).toBe(5);
      expect(props.y).toBe(-3);
    });

    test('should set serializable properties', () => {
      component.setSerializableProperties({ x: 25, y: -15 });

      expect(component.x.toNumber()).toBe(25);
      expect(component.y.toNumber()).toBe(-15);
    });
  });
});

describe('FixedAccelerationComponent', () => {
  let component: FixedAccelerationComponent;

  beforeEach(() => {
    component = new FixedAccelerationComponent(2, -1);
  });

  test('should initialize with correct acceleration', () => {
    expect(component.acceleration.x.toNumber()).toBe(2);
    expect(component.acceleration.y.toNumber()).toBe(-1);
  });

  test('should initialize with default acceleration', () => {
    const defaultComponent = new FixedAccelerationComponent();
    expect(defaultComponent.acceleration.x.toNumber()).toBe(0);
    expect(defaultComponent.acceleration.y.toNumber()).toBe(0);
  });

  test('should have correct x and y getters and setters', () => {
    expect(component.x.toNumber()).toBe(2);
    expect(component.y.toNumber()).toBe(-1);

    component.x = 4;
    component.y = -2;

    expect(component.x.toNumber()).toBe(4);
    expect(component.y.toNumber()).toBe(-2);
  });

  test('should set acceleration from coordinates', () => {
    component.setAcceleration(6, -3);

    expect(component.x.toNumber()).toBe(6);
    expect(component.y.toNumber()).toBe(-3);
  });

  test('should set acceleration from vector', () => {
    const vector = new FixedVector2(8, -4);
    component.setAccelerationFromVector(vector);

    expect(component.acceleration.equals(vector)).toBe(true);
    expect(component.acceleration).not.toBe(vector); // Should be a clone
  });

  test('should reset correctly', () => {
    component.reset();

    expect(component.x.equals(Fixed.ZERO)).toBe(true);
    expect(component.y.equals(Fixed.ZERO)).toBe(true);
  });

  describe('Serialization', () => {
    test('should get serializable properties', () => {
      const props = component.getSerializableProperties();

      expect(props.x).toBe(2);
      expect(props.y).toBe(-1);
    });

    test('should set serializable properties', () => {
      component.setSerializableProperties({ x: 10, y: -5 });

      expect(component.x.toNumber()).toBe(10);
      expect(component.y.toNumber()).toBe(-5);
    });
  });
});
