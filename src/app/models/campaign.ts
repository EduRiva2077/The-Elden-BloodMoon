export interface Scene {
  id: string;
  name: string;
  mapBackgroundImage: string | null;
  tokens: any[];
  fogOfWar: string[];
  isFogEnabled: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: Date;
  lastPlayedAt: Date;
  tokens?: any[];
  mapBackgroundImage?: string | null;
  fogOfWar?: string[];
  isFogEnabled?: boolean;
  scenes?: Scene[];
  activeSceneId?: string | null;
}
