/**
 * Base Component class for nova-ecs-math
 * This is a simplified version to avoid dependency issues during testing
 */
export abstract class Component {
  private _enabled = true;

  /**
   * Get component enabled state
   */
  get enabled(): boolean {
    return this._enabled;
  }

  /**
   * Set component enabled state
   */
  set enabled(value: boolean) {
    this._enabled = value;
  }

  /**
   * Called when component is added to entity
   */
  onAdded?(): void;

  /**
   * Called when component is removed from entity
   */
  onRemoved?(): void;

  /**
   * Called to reset component state
   */
  reset?(): void;

  /**
   * Get serializable properties of the component
   */
  getSerializableProperties(): Record<string, unknown> {
    const properties: Record<string, unknown> = {};

    // Get all enumerable properties
    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key) && !key.startsWith('_')) {
        const value = this[key];

        // Only serialize primitive values and plain objects
        if (this.isSerializableValue(value)) {
          properties[key] = value;
        }
      }
    }

    return properties;
  }

  /**
   * Set serializable properties of the component
   */
  setSerializableProperties(properties: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(properties)) {
      if (key in this && !key.startsWith('_')) {
        (this as Record<string, unknown>)[key] = value;
      }
    }
  }

  /**
   * Check if a value is serializable
   */
  private isSerializableValue(value: unknown): boolean {
    return value !== null && 
           value !== undefined && 
           (typeof value === 'string' || 
            typeof value === 'number' || 
            typeof value === 'boolean' ||
            (typeof value === 'object' && value.constructor === Object));
  }
}
