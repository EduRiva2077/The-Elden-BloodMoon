import { Injectable, signal } from '@angular/core';
import { Ability } from '../models/ability';
import { Token } from '../models/token';

@Injectable({ providedIn: 'root' })
export class CombatService {
  // Estado de Combate / Preview
  previewAbility = signal<Ability | null>(null);
  previewOrigin = signal<{x: number, y: number} | null>(null);
  previewTarget = signal<{x: number, y: number} | null>(null);
  
  // Estado de Seleção e Visual (Novos)
  selectedTokenId = signal<string | null>(null);
  mapBackgroundImage = signal<string | null>(null); // URL da imagem de fundo
  showGrid = signal<boolean>(false); // Toggle grid visibility
  uiVisible = signal<boolean>(true); // Toggle all UI panels
  rightPanelTab = signal<'abilities' | 'sheet'>('abilities'); // Control right panel tab
  
  // View State (Zoom & Pan)
  zoom = signal<number>(1);
  pan = signal<{x: number, y: number}>({x: 0, y: 0});
  
  // Measure Tool State
  isMeasuring = signal<boolean>(false);
  measureStart = signal<{x: number, y: number} | null>(null);
  measureCurrent = signal<{x: number, y: number} | null>(null);
  
  // Session Notes State
  storyContent = signal<string>('The party approaches the ruined temple of <span style="color: #991b1b; font-weight: bold;">BloodDragons</span>. <br>A thick fog obscures the entrance, and the smell of sulfur hangs heavy in the air.');
  gmSecretContent = signal<string>('<strong>GM Secret:</strong> The statues by the door are actually Gargoyles waiting to ambush.');

  // Story Slides State
  showStorySlides = signal<boolean>(false);
  storySlides = signal<{url: string, title: string, description: string}[]>([
    {
      url: 'https://picsum.photos/seed/dnd1/1920/1080',
      title: 'A Taverna do Dragão Caolho',
      description: 'O cheiro de cerveja anã e carne assada preenche o ar. Aventureiros de todas as raças se reúnem aqui em busca de glória e ouro.'
    },
    {
      url: 'https://picsum.photos/seed/dnd2/1920/1080',
      title: 'A Floresta Sussurrante',
      description: 'As árvores parecem se mover quando você não está olhando. Um nevoeiro denso cobre o chão, escondendo perigos ancestrais.'
    },
    {
      url: 'https://picsum.photos/seed/dnd3/1920/1080',
      title: 'O Rei Goblin',
      description: 'Sentado em seu trono de ossos, o Rei Goblin sorri maliciosamente. Seus olhos brilham com uma inteligência cruel e gananciosa.'
    }
  ]);

  // Tokens State
  tokens = signal<Token[]>([
    { 
      id: 't1', name: 'Fighter Bob', x: 2, y: 2, hp: 45, maxHp: 45, conditions: [], controlledBy: 'user_player_1', color: '#ef4444', type: 'player',
      sheet: { classLevel: 'Fighter 3', background: 'Soldier', playerName: 'Player 1', race: 'Human', alignment: 'Neutral Good', xp: '900', str: 16, dex: 14, con: 15, int: 10, wis: 12, cha: 8, ac: 16, initiative: 2, speed: 9, proficiencyBonus: 2, passivePerception: 11 },
      abilities: [
        { id: 'a1', name: 'Longsword Sweep', type: 'action', range: 1.5, areaShape: 'cone', angle: 90, damage: '1d8+3', damageType: 'slashing', description: 'A wide sweep with a longsword.', requiresAttackRoll: true, attackBonus: 5 }
      ]
    },
    { 
      id: 't2', name: 'Wizard Alice', x: 4, y: 5, hp: 22, maxHp: 22, conditions: ['Mage Armor'], controlledBy: 'user_player_2', color: '#3b82f6', type: 'player',
      sheet: { classLevel: 'Wizard 3', background: 'Sage', playerName: 'Player 2', race: 'Elf', alignment: 'Chaotic Good', xp: '900', str: 8, dex: 14, con: 12, int: 16, wis: 13, cha: 10, ac: 12, initiative: 2, speed: 9, proficiencyBonus: 2, passivePerception: 11 },
      abilities: [
        { id: 'a2', name: 'Fireball', type: 'action', range: 45, areaShape: 'circle', radius: 6, damage: '8d6', damageType: 'fire', description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame.' },
        { id: 'a3', name: 'Lightning Bolt', type: 'action', range: 30, areaShape: 'line', width: 1.5, length: 30, damage: '8d6', damageType: 'lightning', description: 'A stroke of lightning forming a line 30m long and 1.5m wide.' }
      ]
    },
    { 
      id: 't3', name: 'Goblin Boss', x: 8, y: 3, hp: 15, maxHp: 25, conditions: ['Poisoned'], controlledBy: 'user_gm_1', color: '#22c55e', imageUrl: 'https://picsum.photos/seed/goblin/128/128', type: 'boss',
      sheet: { classLevel: 'Boss 1', background: 'Monster', playerName: 'GM', race: 'Goblin', alignment: 'Neutral Evil', xp: '200', str: 14, dex: 14, con: 14, int: 10, wis: 10, cha: 10, ac: 15, initiative: 2, speed: 9, proficiencyBonus: 2, passivePerception: 10 },
      abilities: [
        { id: 'a4', name: 'Goblin Cleave', type: 'action', range: 1.5, areaShape: 'circle', radius: 1.5, damage: '2d6+2', damageType: 'slashing', description: 'A wild spinning attack hitting everyone nearby.', requiresAttackRoll: true, attackBonus: 4 }
      ]
    },
    { id: 't4', name: 'Goblin Minion', x: 9, y: 4, hp: 7, maxHp: 7, conditions: [], controlledBy: 'user_gm_1', color: '#22c55e', type: 'enemy', abilities: [], sheet: { classLevel: 'Minion', background: 'Monster', playerName: 'GM', race: 'Goblin', alignment: 'Neutral Evil', xp: '50', str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8, ac: 13, initiative: 2, speed: 9, proficiencyBonus: 2, passivePerception: 9 } },
    { id: 't5', name: 'Goblin Minion', x: 7, y: 4, hp: 7, maxHp: 7, conditions: [], controlledBy: 'user_gm_1', color: '#22c55e', type: 'enemy', abilities: [], sheet: { classLevel: 'Minion', background: 'Monster', playerName: 'GM', race: 'Goblin', alignment: 'Neutral Evil', xp: '50', str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8, ac: 13, initiative: 2, speed: 9, proficiencyBonus: 2, passivePerception: 9 } },
  ]);

  updateToken(id: string, updates: Partial<Token>) {
    this.tokens.update(ts => ts.map(t => t.id === id ? { ...t, ...updates } : t));
  }

  addToken(token: Token) {
    this.tokens.update(ts => [...ts, token]);
  }

  deleteToken(id: string) {
    this.tokens.update(ts => ts.filter(t => t.id !== id));
  }
  
  startPreview(ability: Ability, originToken: Token) {
    this.previewAbility.set(ability);
    this.previewOrigin.set({ x: originToken.x, y: originToken.y });
    // Default target
    this.previewTarget.set({ x: (originToken.x + 0.5) * 64, y: (originToken.y + 0.5) * 64 });
  }

  updateTarget(x: number, y: number) {
    this.previewTarget.set({ x, y });
  }

  cancelPreview() {
    this.previewAbility.set(null);
    this.previewOrigin.set(null);
    this.previewTarget.set(null);
  }

  selectToken(id: string) {
    this.selectedTokenId.set(id);
  }

  setMapBackground(url: string) {
    this.mapBackgroundImage.set(url);
  }

  addStorySlide(slide: {url: string, title: string, description: string}) {
    this.storySlides.update(slides => [...slides, slide]);
  }

  updateStorySlide(index: number, updates: Partial<{url: string, title: string, description: string}>) {
    this.storySlides.update(slides => {
      const newSlides = [...slides];
      if (newSlides[index]) {
        newSlides[index] = { ...newSlides[index], ...updates };
      }
      return newSlides;
    });
  }
}