/**
 * 
 * Binding of Isaac item data.
 * TODO: Add full item list with id, name, description, spindown mapping, etc.
 */

export interface IsaacItem {
  id: number;
  name: string;
  description?: string;
}

// Placeholder — replace with full item data
export const items: IsaacItem[] = [];

// Placeholder — spindown dice maps each item id to the next item id
export const spindownMap: Record<number, number> = {};
