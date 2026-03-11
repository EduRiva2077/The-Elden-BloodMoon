import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DndMathService } from '../../services/dnd-math.service';
import { CombatService } from '../../services/combat.service';
import { AuthService } from '../../services/auth.service';
import { Ability, AreaShape } from '../../models/ability';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-80 h-full bg-stone-900 border-l border-stone-800 flex flex-col text-stone-300">
      <!-- Tabs -->
      <div class="flex border-b border-stone-800 text-xs font-mono">
        <button class="flex-1 py-3 transition-colors" [class.text-amber-500]="combat.rightPanelTab() === 'abilities'" [class.border-b-2]="combat.rightPanelTab() === 'abilities'" [class.border-amber-500]="combat.rightPanelTab() === 'abilities'" [class.bg-stone-800]="combat.rightPanelTab() === 'abilities'" (click)="combat.rightPanelTab.set('abilities')">Abilities</button>
        <button class="flex-1 py-3 transition-colors" [class.text-amber-500]="combat.rightPanelTab() === 'sheet'" [class.border-b-2]="combat.rightPanelTab() === 'sheet'" [class.border-amber-500]="combat.rightPanelTab() === 'sheet'" [class.bg-stone-800]="combat.rightPanelTab() === 'sheet'" (click)="combat.rightPanelTab.set('sheet')">Sheet</button>
      </div>
      
      <!-- Abilities Tab -->
      @if (combat.rightPanelTab() === 'abilities') {
        <div class="flex-1 overflow-auto p-4 space-y-4">
          @if (combat.previewAbility()) {
            <div class="bg-amber-900/30 border border-amber-500/50 rounded p-3 text-sm text-amber-500 flex items-center gap-2 mb-4">
              <mat-icon>info</mat-icon>
              <span>Preview mode active. Click on the map to confirm attack.</span>
              <button class="ml-auto bg-stone-800 hover:bg-stone-700 text-stone-300 px-2 py-1 rounded text-xs" (click)="combat.cancelPreview()">Cancel</button>
            </div>
          }

          @if (!selectedToken()) {
            <div class="text-sm text-stone-500 italic p-4 text-center border border-dashed border-stone-700 rounded">
              Select a token on the map to view its abilities.
            </div>
          } @else {
            <!-- GM: Add Ability Form -->
            @if (auth.currentUser()?.role === 'GM') {
              <div class="bg-stone-800 rounded border border-stone-700 p-3 mb-4 space-y-3 shadow-md">
                <h4 class="text-xs font-bold text-amber-500 uppercase">Add New Ability to {{ selectedToken()?.name }}</h4>
                <form [formGroup]="abilityForm" (ngSubmit)="addAbility()" class="space-y-2">
                  <input formControlName="name" placeholder="Name" class="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                  
                  <div class="grid grid-cols-2 gap-2">
                    <select formControlName="type" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                      <option value="action">Action</option>
                      <option value="bonus_action">Bonus Action</option>
                      <option value="reaction">Reaction</option>
                      <option value="passive">Passive</option>
                    </select>
                    <select formControlName="areaShape" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                      <option value="none">No Area</option>
                      <option value="circle">Circle</option>
                      <option value="cone">Cone</option>
                      <option value="line">Line</option>
                      <option value="rectangle">Rectangle</option>
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div class="flex flex-col gap-1">
                      <label for="abilityRange" class="text-[10px] text-stone-500 uppercase">Range (m)</label>
                      <input id="abilityRange" type="number" formControlName="range" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label for="abilityDamage" class="text-[10px] text-stone-500 uppercase">Damage</label>
                      <input id="abilityDamage" formControlName="damage" placeholder="e.g. 8d6" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2 items-center">
                    <label class="flex items-center gap-2 text-xs text-stone-400 cursor-pointer">
                      <input type="checkbox" formControlName="requiresAttackRoll" class="accent-amber-500">
                      Requires Attack Roll
                    </label>
                    <div class="flex flex-col gap-1">
                      <label for="attackBonus" class="text-[10px] text-stone-500 uppercase">Attack Bonus</label>
                      <input id="attackBonus" type="number" formControlName="attackBonus" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                    </div>
                  </div>

                  <textarea formControlName="description" placeholder="Description" rows="2" class="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500"></textarea>

                  <button type="submit" [disabled]="abilityForm.invalid" class="w-full py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 text-stone-900 font-bold rounded text-xs transition-colors">
                    Add Ability
                  </button>
                </form>
              </div>
            }

            @if (abilities().length === 0) {
              <div class="text-sm text-stone-500 italic p-4 text-center">
                This token has no abilities yet.
              </div>
            }

            @for (ability of abilities(); track ability.id) {
              <div class="bg-stone-800 rounded border border-stone-700 overflow-hidden shadow-md">
                <div class="p-3 border-b border-stone-700 flex justify-between items-center bg-stone-800/50">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-amber-500">{{ ability.name }}</span>
                    @if (auth.currentUser()?.role === 'GM') {
                      <button class="text-stone-500 hover:text-red-500 transition-colors" (click)="removeAbility(ability.id)">
                        <mat-icon style="font-size: 16px; width: 16px; height: 16px;">delete</mat-icon>
                      </button>
                    }
                  </div>
                  <span class="text-[10px] font-mono text-stone-400 uppercase bg-stone-900 px-2 py-1 rounded">{{ ability.type }}</span>
                </div>
                <div class="p-3 text-sm space-y-3">
                  <p class="text-stone-400 text-xs">{{ ability.description }}</p>
                  <div class="grid grid-cols-2 gap-2 text-xs font-mono bg-stone-900 p-2 rounded border border-stone-700">
                    <div><span class="text-stone-500">Range:</span> {{ ability.range }}m</div>
                    <div><span class="text-stone-500">Area:</span> <span class="capitalize">{{ ability.areaShape }}</span></div>
                    <div><span class="text-stone-500">Damage:</span> {{ ability.damage }}</div>
                    <div><span class="text-stone-500">Type:</span> <span class="capitalize">{{ ability.damageType }}</span></div>
                  </div>
                  <button class="w-full py-2 bg-stone-700 hover:bg-amber-600 hover:text-stone-900 text-stone-300 font-bold rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-stone-700 disabled:hover:text-stone-300 disabled:cursor-not-allowed"
                          [disabled]="!selectedToken()?.sheet"
                          [title]="!selectedToken()?.sheet ? 'Token needs a character sheet to use abilities' : ''"
                          (click)="useAbility(ability)">
                    <mat-icon class="text-sm">my_location</mat-icon> Use Ability
                  </button>
                </div>
              </div>
            }
          }
        </div>
      }
      <!-- Sheet Tab -->
      @if (combat.rightPanelTab() === 'sheet') {
        <div class="flex-1 overflow-auto p-4 space-y-4">
          @if (!selectedToken()) {
            <div class="text-sm text-stone-500 italic p-4 text-center border border-dashed border-stone-700 rounded">
              Select a token on the map to view its character sheet.
            </div>
          } @else {
            @if (isEditingSheet()) {
              <div class="bg-stone-800 rounded border border-stone-700 p-3 space-y-4 shadow-md text-xs">
                <div class="flex justify-between items-center border-b border-stone-700 pb-2">
                  <h3 class="font-bold text-amber-500 text-lg">Edit Sheet</h3>
                  <div class="flex gap-2">
                    <button class="bg-stone-700 hover:bg-stone-600 text-stone-300 px-2 py-1 rounded text-xs transition-colors" (click)="cancelEditSheet()">Cancel</button>
                    <button class="bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold px-2 py-1 rounded text-xs transition-colors" (click)="saveSheet()">Save</button>
                  </div>
                </div>
                <form [formGroup]="sheetForm" class="space-y-3">
                  <div class="grid grid-cols-2 gap-2">
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase">Class & Level</label>
                      <input formControlName="classLevel" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase">Background</label>
                      <input formControlName="background" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase">Player Name</label>
                      <input formControlName="playerName" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase">Race</label>
                      <input formControlName="race" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase">Alignment</label>
                      <input formControlName="alignment" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase">XP</label>
                      <input formControlName="xp" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-2">
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase text-center">AC</label>
                      <input type="number" formControlName="ac" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase text-center">Initiative</label>
                      <input type="number" formControlName="initiative" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase text-center">Speed (m)</label>
                      <input type="number" formControlName="speed" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-amber-500">
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-2">
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase text-center">STR</label>
                      <input type="number" formControlName="str" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase text-center">DEX</label>
                      <input type="number" formControlName="dex" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase text-center">CON</label>
                      <input type="number" formControlName="con" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase text-center">INT</label>
                      <input type="number" formControlName="int" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase text-center">WIS</label>
                      <input type="number" formControlName="wis" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase text-center">CHA</label>
                      <input type="number" formControlName="cha" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-amber-500">
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase">Proficiency Bonus</label>
                      <input type="number" formControlName="proficiencyBonus" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] text-stone-500 uppercase">Passive Perception</label>
                      <input type="number" formControlName="passivePerception" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500">
                    </div>
                  </div>

                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] text-stone-500 uppercase">Inventory</label>
                    <textarea formControlName="inventory" rows="3" class="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500 resize-none"></textarea>
                  </div>
                </form>
              </div>
            } @else if (selectedToken()?.sheet; as sheet) {
              <div class="bg-stone-800 rounded border border-stone-700 p-3 space-y-4 shadow-md text-xs">
                <!-- Header -->
                <div class="border-b border-stone-700 pb-2">
                  <div class="flex justify-between items-start">
                    <h3 class="font-bold text-amber-500 text-lg">{{ selectedToken()?.name }}</h3>
                    @if (auth.currentUser()?.role === 'GM' || selectedToken()?.controlledBy === auth.currentUser()?.id) {
                      <button class="text-stone-500 hover:text-amber-500 transition-colors" (click)="editSheet()" title="Edit Sheet">
                        <mat-icon style="font-size: 16px; width: 16px; height: 16px;">edit</mat-icon>
                      </button>
                    }
                  </div>
                  <div class="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-stone-400">
                    <div><span class="text-stone-500">Class & Level:</span> {{ sheet.classLevel }}</div>
                    <div><span class="text-stone-500">Background:</span> {{ sheet.background }}</div>
                    <div><span class="text-stone-500">Player:</span> {{ sheet.playerName }}</div>
                    <div><span class="text-stone-500">Race:</span> {{ sheet.race }}</div>
                    <div><span class="text-stone-500">Alignment:</span> {{ sheet.alignment }}</div>
                    <div><span class="text-stone-500">XP:</span> {{ sheet.xp }}</div>
                  </div>
                </div>

                <!-- Combat Stats -->
                <div class="flex justify-between items-center bg-stone-900 p-2 rounded border border-stone-700">
                  <div class="text-center">
                    <div class="text-[10px] text-stone-500 uppercase">AC</div>
                    <div class="font-bold text-lg text-amber-500">{{ sheet.ac }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-[10px] text-stone-500 uppercase">Initiative</div>
                    <div class="font-bold text-lg text-amber-500">{{ sheet.initiative >= 0 ? '+' : '' }}{{ sheet.initiative }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-[10px] text-stone-500 uppercase">Speed</div>
                    <div class="font-bold text-lg text-amber-500">{{ sheet.speed }}m</div>
                  </div>
                </div>

                <!-- Attributes -->
                <div class="grid grid-cols-3 gap-2">
                  <div class="bg-stone-900 border border-stone-700 rounded p-2 text-center">
                    <div class="text-[10px] text-stone-500 uppercase font-bold">STR</div>
                    <div class="font-bold text-lg">{{ sheet.str }}</div>
                    <div class="text-[10px] text-stone-400">{{ mathService.calculateModifier(sheet.str) >= 0 ? '+' : '' }}{{ mathService.calculateModifier(sheet.str) }}</div>
                  </div>
                  <div class="bg-stone-900 border border-stone-700 rounded p-2 text-center">
                    <div class="text-[10px] text-stone-500 uppercase font-bold">DEX</div>
                    <div class="font-bold text-lg">{{ sheet.dex }}</div>
                    <div class="text-[10px] text-stone-400">{{ mathService.calculateModifier(sheet.dex) >= 0 ? '+' : '' }}{{ mathService.calculateModifier(sheet.dex) }}</div>
                  </div>
                  <div class="bg-stone-900 border border-stone-700 rounded p-2 text-center">
                    <div class="text-[10px] text-stone-500 uppercase font-bold">CON</div>
                    <div class="font-bold text-lg">{{ sheet.con }}</div>
                    <div class="text-[10px] text-stone-400">{{ mathService.calculateModifier(sheet.con) >= 0 ? '+' : '' }}{{ mathService.calculateModifier(sheet.con) }}</div>
                  </div>
                  <div class="bg-stone-900 border border-stone-700 rounded p-2 text-center">
                    <div class="text-[10px] text-stone-500 uppercase font-bold">INT</div>
                    <div class="font-bold text-lg">{{ sheet.int }}</div>
                    <div class="text-[10px] text-stone-400">{{ mathService.calculateModifier(sheet.int) >= 0 ? '+' : '' }}{{ mathService.calculateModifier(sheet.int) }}</div>
                  </div>
                  <div class="bg-stone-900 border border-stone-700 rounded p-2 text-center">
                    <div class="text-[10px] text-stone-500 uppercase font-bold">WIS</div>
                    <div class="font-bold text-lg">{{ sheet.wis }}</div>
                    <div class="text-[10px] text-stone-400">{{ mathService.calculateModifier(sheet.wis) >= 0 ? '+' : '' }}{{ mathService.calculateModifier(sheet.wis) }}</div>
                  </div>
                  <div class="bg-stone-900 border border-stone-700 rounded p-2 text-center">
                    <div class="text-[10px] text-stone-500 uppercase font-bold">CHA</div>
                    <div class="font-bold text-lg">{{ sheet.cha }}</div>
                    <div class="text-[10px] text-stone-400">{{ mathService.calculateModifier(sheet.cha) >= 0 ? '+' : '' }}{{ mathService.calculateModifier(sheet.cha) }}</div>
                  </div>
                </div>

                <!-- Other Stats -->
                <div class="space-y-2">
                  <div class="flex justify-between items-center bg-stone-900 px-2 py-1 rounded border border-stone-700">
                    <span class="text-stone-500 font-bold">Proficiency Bonus</span>
                    <span class="font-bold text-amber-500">+{{ sheet.proficiencyBonus }}</span>
                  </div>
                  <div class="flex justify-between items-center bg-stone-900 px-2 py-1 rounded border border-stone-700">
                    <span class="text-stone-500 font-bold">Passive Wisdom (Perception)</span>
                    <span class="font-bold text-amber-500">{{ sheet.passivePerception }}</span>
                  </div>
                </div>

                <!-- Inventory -->
                @if (sheet.inventory) {
                  <div class="bg-stone-900 p-2 rounded border border-stone-700">
                    <div class="text-[10px] text-stone-500 uppercase font-bold mb-1">Inventory</div>
                    <div class="text-stone-300 whitespace-pre-wrap">{{ sheet.inventory }}</div>
                  </div>
                }
              </div>
            } @else {
              <div class="bg-stone-800 rounded border border-stone-700 p-4 text-center space-y-3">
                <mat-icon class="text-stone-500 text-4xl mb-2">assignment_late</mat-icon>
                <p class="text-sm text-stone-400">This token does not have a character sheet filled out.</p>
                <p class="text-xs text-stone-500">Abilities requiring attack rolls or saving throws may not function correctly without AC and attributes.</p>
                @if (auth.currentUser()?.role === 'GM' || selectedToken()?.controlledBy === auth.currentUser()?.id) {
                  <button class="bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold px-4 py-2 rounded text-xs transition-colors mt-2" (click)="editSheet()">
                    Create Sheet
                  </button>
                }
              </div>
            }
          }
        </div>
      }
    </div>
  `
})
export class RightPanelComponent {
  mathService = inject(DndMathService);
  combat = inject(CombatService);
  auth = inject(AuthService);

  isEditingSheet = signal(false);

  sheetForm = new FormGroup({
    classLevel: new FormControl('', { nonNullable: true }),
    background: new FormControl('', { nonNullable: true }),
    playerName: new FormControl('', { nonNullable: true }),
    race: new FormControl('', { nonNullable: true }),
    alignment: new FormControl('', { nonNullable: true }),
    xp: new FormControl('', { nonNullable: true }),
    str: new FormControl(10, { nonNullable: true }),
    dex: new FormControl(10, { nonNullable: true }),
    con: new FormControl(10, { nonNullable: true }),
    int: new FormControl(10, { nonNullable: true }),
    wis: new FormControl(10, { nonNullable: true }),
    cha: new FormControl(10, { nonNullable: true }),
    ac: new FormControl(10, { nonNullable: true }),
    initiative: new FormControl(0, { nonNullable: true }),
    speed: new FormControl(9, { nonNullable: true }),
    proficiencyBonus: new FormControl(2, { nonNullable: true }),
    passivePerception: new FormControl(10, { nonNullable: true }),
    inventory: new FormControl('', { nonNullable: true }),
  });

  abilityForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<'action' | 'bonus_action' | 'reaction' | 'passive'>('action', { nonNullable: true, validators: [Validators.required] }),
    range: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    areaShape: new FormControl<AreaShape>('none', { nonNullable: true, validators: [Validators.required] }),
    damage: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    damageType: new FormControl('slashing', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    requiresAttackRoll: new FormControl(false, { nonNullable: true }),
    attackBonus: new FormControl(0, { nonNullable: true })
  });

  selectedToken = computed(() => {
    const id = this.combat.selectedTokenId();
    if (!id) return null;
    return this.combat.tokens().find(t => t.id === id) || null;
  });

  abilities = computed(() => {
    const token = this.selectedToken();
    return token?.abilities || [];
  });

  addAbility() {
    if (this.abilityForm.invalid) return;

    const token = this.selectedToken();
    if (!token) return;

    const formValue = this.abilityForm.getRawValue();
    const newAbility: Ability = {
      ...formValue,
      id: Math.random().toString(36).substring(2, 9),
      // Add default AoE params based on shape if missing
      ...(formValue.areaShape === 'circle' ? { radius: 6 } : {}),
      ...(formValue.areaShape === 'cone' ? { angle: 60 } : {}),
      ...(formValue.areaShape === 'line' ? { width: 1.5, length: formValue.range } : {}),
      ...(formValue.areaShape === 'rectangle' ? { width: 6, length: 6 } : {})
    };

    const newAbilities = [...(token.abilities || []), newAbility];
    this.combat.updateToken(token.id, { abilities: newAbilities });

    this.abilityForm.reset({
      name: '',
      type: 'action',
      range: 0,
      areaShape: 'none',
      damage: '',
      damageType: 'slashing',
      description: '',
      requiresAttackRoll: false,
      attackBonus: 0
    });
  }

  removeAbility(id: string) {
    const token = this.selectedToken();
    if (!token) return;

    const newAbilities = (token.abilities || []).filter(a => a.id !== id);
    this.combat.updateToken(token.id, { abilities: newAbilities });
  }

  useAbility(ability: Ability) {
    const token = this.selectedToken();
    if (!token) return;
    this.combat.startPreview(ability, token);
  }

  editSheet() {
    const token = this.selectedToken();
    if (!token) return;
    
    if (token.sheet) {
      this.sheetForm.patchValue(token.sheet);
    } else {
      this.sheetForm.reset({
        classLevel: '',
        background: '',
        playerName: '',
        race: '',
        alignment: '',
        xp: '',
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
        ac: 10,
        initiative: 0,
        speed: 9,
        proficiencyBonus: 2,
        passivePerception: 10,
        inventory: ''
      });
    }
    this.isEditingSheet.set(true);
  }

  saveSheet() {
    const token = this.selectedToken();
    if (!token) return;

    const sheetData = this.sheetForm.getRawValue();
    this.combat.updateToken(token.id, { sheet: sheetData });
    this.isEditingSheet.set(false);
  }

  cancelEditSheet() {
    this.isEditingSheet.set(false);
  }
}
