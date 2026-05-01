import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CombatService } from '../../services/combat.service';

@Component({
  selector: 'app-level-up-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (state()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <!-- Main Modal Container with Dark Fantasy Aesthetics -->
        <div class="bg-stone-900 border-2 border-amber-500/50 rounded-xl shadow-[0_0_40px_rgba(245,158,11,0.2)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          <!-- Header -->
          <div class="bg-stone-800 p-6 border-b border-amber-500/30 flex items-center justify-between relative overflow-hidden">
            <!-- decorative background glow -->
            <div class="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none"></div>
            
            <div class="flex items-center gap-4 relative z-10">
              <div class="w-12 h-12 rounded-full border-2 border-amber-500 bg-stone-900 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <mat-icon class="text-amber-500" style="font-size: 28px; width: 28px; height: 28px;">auto_awesome</mat-icon>
              </div>
              <div>
                <h2 class="text-3xl font-black text-amber-500 uppercase tracking-widest leading-none drop-shadow-md" style="font-family: 'Cinzel', serif;">Level Up!</h2>
                <p class="text-sm font-bold text-stone-300 tracking-wider mt-1">{{ state()?.characterName }} alcançou o Nível {{ state()?.newLevel }}</p>
              </div>
            </div>
            <button (click)="close()" class="relative z-10 text-stone-400 hover:text-white transition-colors">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6">
            
            <div class="bg-stone-950 p-5 rounded-lg border border-stone-700 shadow-inner flex flex-col items-center justify-center py-8">
              <span class="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Novo Nível Alcançado</span>
              <span class="text-7xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">{{ state()?.newLevel }}</span>
            </div>

            <!-- Dynamic Placeholder for Future Features -->
            <div class="bg-stone-800 p-4 rounded border border-stone-700 space-y-3 relative overflow-hidden group">
               <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none group-hover:from-amber-500/10 transition-colors"></div>
               <h4 class="text-sm font-bold text-amber-500 uppercase border-b border-stone-700 pb-2 flex items-center gap-2">
                 <mat-icon style="font-size: 18px; width: 18px; height: 18px;">upgrade</mat-icon>
                 Benefícios Adquiridos
               </h4>
               
               <ul class="text-sm text-stone-300 space-y-2 font-medium">
                 <li class="flex items-center gap-2">
                   <mat-icon class="text-green-500" style="font-size: 16px; width: 16px; height: 16px;">favorite</mat-icon>
                   Aumento de Pontos de Vida (Max HP)
                 </li>
                 <li class="flex items-center gap-2">
                   <mat-icon class="text-blue-500" style="font-size: 16px; width: 16px; height: 16px;">shield</mat-icon>
                   Bônus de Proficiência Ajustado
                 </li>
                 <!-- Empty slot for future dynamic features like new spells, ASI, etc. -->
                 <li class="flex items-center gap-2 text-stone-500 italic mt-4 border-t border-stone-700/50 pt-2">
                   <mat-icon style="font-size: 16px; width: 16px; height: 16px;">hourglass_empty</mat-icon>
                   Aguardando escolhas de classe...
                 </li>
               </ul>
            </div>

            <!-- Action Button -->
            <div class="pt-2">
              <button (click)="close()" class="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-900 font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all">
                Continuar a Jornada
              </button>
            </div>

          </div>
        </div>
      </div>
    }
  `
})
export class LevelUpModalComponent {
  combat = inject(CombatService);
  state = this.combat.levelUpModalState;

  close() {
    this.combat.closeLevelUpModal();
  }
}
