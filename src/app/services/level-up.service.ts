import { Injectable, signal } from '@angular/core';

export interface LevelUpInfo {
  tokenId: string;
  characterName: string;
  previousLevel: number;
  newLevel: number;
  benefits?: { icon: string, iconColorClass: string, title: string, description: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class LevelUpService {
  activeLevelUp = signal<LevelUpInfo | null>(null);

  // Tabela Oficial de XP D&D 5e
  private readonly xpThresholds: number[] = [
    0,       // Nível 1
    300,     // Nível 2
    900,     // Nível 3
    2700,    // Nível 4
    6500,    // Nível 5
    14000,   // Nível 6
    23000,   // Nível 7
    34000,   // Nível 8
    48000,   // Nível 9
    64000,   // Nível 10
    85000,   // Nível 11
    100000,  // Nível 12
    120000,  // Nível 13
    140000,  // Nível 14
    165000,  // Nível 15
    195000,  // Nível 16
    225000,  // Nível 17
    265000,  // Nível 18
    305000,  // Nível 19
    355000   // Nível 20
  ];

  /**
   * Calcula o nível com base no XP total.
   */
  calculateLevelFromXP(xp: number): number {
    if (xp < 0) return 1;
    for (let i = this.xpThresholds.length - 1; i >= 0; i--) {
      if (xp >= this.xpThresholds[i]) {
        return i + 1; // Níveis são baseados em 1 (index 0 = Nível 1)
      }
    }
    return 1;
  }

  /**
   * Dispara o fluxo de Level Up na interface.
   */
  triggerLevelUp(info: LevelUpInfo) {
    this.activeLevelUp.set(info);
  }

  /**
   * Remove o popup atual.
   */
  clearLevelUp() {
    this.activeLevelUp.set(null);
  }
}
