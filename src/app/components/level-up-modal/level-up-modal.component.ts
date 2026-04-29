import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LevelUpService } from '../../services/level-up.service';

@Component({
  selector: 'app-level-up-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (levelUpService.activeLevelUp()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <!-- Confetti/Light rays background effect (CSS based via Tailwind) -->
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
           <div class="w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        </div>
        
        <div class="relative bg-stone-900 border border-amber-500/50 rounded-xl shadow-[0_0_50px_-12px_rgba(245,158,11,0.5)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-500">
          
          <!-- Decorative Header -->
          <div class="relative bg-stone-950 p-6 flex flex-col items-center justify-center border-b border-stone-800">
             <div class="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
             
             <!-- Icon -->
             <div class="w-16 h-16 rounded-full border-2 border-amber-400 flex items-center justify-center bg-stone-900 shadow-[0_0_15px_rgba(251,191,36,0.3)] mb-4">
               <mat-icon class="text-amber-400" style="font-size: 32px; width: 32px; height: 32px;">keyboard_double_arrow_up</mat-icon>
             </div>
             
             <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 tracking-wider text-center uppercase">
               Level Up!
             </h2>
          </div>
          
          <!-- Content -->
          <div class="p-6 space-y-6">
             <div class="text-center">
                <span class="text-stone-400 text-sm block mb-1">Parabéns <span class="text-stone-200 font-bold">{{ levelUpService.activeLevelUp()?.characterName }}</span>, </span>
                <span class="text-xl font-bold text-white block">Você alcançou o Nível {{ levelUpService.activeLevelUp()?.newLevel }}!</span>
             </div>
             
             <div class="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
                <h3 class="text-xs font-bold text-amber-500/70 uppercase tracking-widest mb-3 border-b border-stone-700/50 pb-2">Benefícios Desbloqueados</h3>
                
                <ul class="space-y-3">
                  @for (benefit of levelUpService.activeLevelUp()?.benefits || defaultBenefits; track benefit.title) {
                    <li class="flex items-start gap-3">
                      <div class="p-1.5 rounded-md bg-stone-900 border border-stone-700">
                         <mat-icon [class]="benefit.iconColorClass" style="font-size: 16px; width: 16px; height: 16px;">{{ benefit.icon }}</mat-icon>
                      </div>
                      <div>
                        <span class="text-sm font-bold text-stone-200 block leading-none mb-1">{{ benefit.title }}</span>
                        <span class="text-xs text-stone-400 block">{{ benefit.description }}</span>
                      </div>
                    </li>
                  }
                </ul>
             </div>
             
             <!-- Action -->
             <button (click)="close()" class="w-full py-4 bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold uppercase tracking-widest rounded transition-colors shadow-lg shadow-amber-600/20 active:translate-y-0.5">
               Aceitar e Continuar
             </button>
          </div>
        </div>
      </div>
    }
  `
})
export class LevelUpModalComponent {
  levelUpService = inject(LevelUpService);

  defaultBenefits = [
    { icon: 'health_and_safety', iconColorClass: 'text-green-500', title: 'Aumento de Pontos de Vida (MÁX HP)', description: 'Jogue seu dado de vida para aumentar seu HP Máximo.' },
    { icon: 'auto_awesome', iconColorClass: 'text-blue-500', title: 'Novas Habilidades de Classe', description: 'Verifique o livro do jogador para novas opções e magias.' },
    { icon: 'psychology', iconColorClass: 'text-purple-500', title: 'Crescimento Pessoal', description: 'Em níveis dedicados, receba aumento de Atributos (ASI) ou Talentos.' }
  ];

  close() {
    this.levelUpService.clearLevelUp();
  }
}
