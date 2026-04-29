export type ScalingAttribute = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha' | 'none';

export enum ItemCategory {
  SWORD = 'SWORD',
  SHIELD = 'SHIELD',
  DAGGER = 'DAGGER',
  HAMMER = 'HAMMER',
  STAFF = 'STAFF',
  BOOK = 'BOOK',
  BOW = 'BOW',
  CROSSBOW = 'CROSSBOW',
  ARMOR_LIGHT = 'ARMOR_LIGHT',
  ARMOR_MEDIUM = 'ARMOR_MEDIUM',
  ARMOR_HEAVY = 'ARMOR_HEAVY',
  POTION = 'POTION',
  RING = 'RING',
  AMULET = 'AMULET',
  CONSUMABLE = 'CONSUMABLE',
  MISC = 'MISC'
}

export interface ItemTemplate {
  id: string;
  name: string;
  description: string;
  weight: number;
  itemCategory: ItemCategory;
  scalingAttribute?: ScalingAttribute;
  damage?: string;
  acModifier?: number;
  range?: number;
  properties?: string[];
  isEquipped?: boolean;
  quantity?: number;
}
