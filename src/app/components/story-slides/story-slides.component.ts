import { Component, ChangeDetectionStrategy, input, signal, computed, ElementRef, ViewChild, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CombatService } from '../../services/combat.service';

export interface Slide {
  url: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-story-slides',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full h-full flex flex-col bg-stone-950 border-2 border-[#b8860b] rounded-sm overflow-hidden shadow-2xl group" #slideContainer>
      
      <!-- Progress Bar -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-stone-900 z-30">
        <div class="h-full bg-[#b8860b] transition-all duration-500 ease-out" [style.width.%]="progressPercentage()"></div>
      </div>

      <!-- Top Controls -->
      <div class="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        @if (auth.currentUser()?.role === 'GM') {
          <label class="cursor-pointer bg-stone-900/80 text-[#b8860b] hover:text-amber-400 hover:bg-stone-800 px-3 py-1 rounded text-xs font-serif border border-[#b8860b]/50 backdrop-blur-sm flex items-center gap-2 transition-colors">
            <mat-icon style="font-size: 16px; width: 16px; height: 16px;">add_photo_alternate</mat-icon>
            Nova Cena
            <input type="file" accept="image/*" class="hidden" (change)="uploadNewSlide($event)">
          </label>
          <label class="cursor-pointer bg-stone-900/80 text-[#b8860b] hover:text-amber-400 hover:bg-stone-800 px-3 py-1 rounded text-xs font-serif border border-[#b8860b]/50 backdrop-blur-sm flex items-center gap-2 transition-colors">
            <mat-icon style="font-size: 16px; width: 16px; height: 16px;">edit</mat-icon>
            Alterar Imagem
            <input type="file" accept="image/*" class="hidden" (change)="updateCurrentSlideImage($event)">
          </label>
        }
        <div class="bg-stone-900/80 text-[#b8860b] px-3 py-1 rounded text-xs font-serif border border-[#b8860b]/50 backdrop-blur-sm flex items-center">
          Cena {{ currentIndex() + 1 }} de {{ slides().length || 1 }}
        </div>
        <button (click)="toggleFullscreen()" class="w-8 h-8 flex items-center justify-center bg-stone-900/80 text-[#b8860b] hover:text-amber-400 hover:bg-stone-800 rounded border border-[#b8860b]/50 backdrop-blur-sm transition-colors">
          <mat-icon style="font-size: 18px; width: 18px; height: 18px;">{{ isFullscreen() ? 'fullscreen_exit' : 'fullscreen' }}</mat-icon>
        </button>
      </div>

      <!-- Slides -->
      <div class="relative flex-1 w-full h-full overflow-hidden bg-black">
        @for (slide of slides(); track $index; let i = $index) {
          <div class="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out flex items-center justify-center p-4"
               [class.opacity-100]="i === currentIndex()"
               [class.opacity-0]="i !== currentIndex()"
               [class.pointer-events-none]="i !== currentIndex()">
            <img [src]="slide.url" [alt]="slide.title" class="max-w-full max-h-full object-contain m-auto shadow-2xl" referrerpolicy="no-referrer" />
            
            <!-- Overlay -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-24 pb-8 px-12 flex justify-start">
              @if (auth.currentUser()?.role === 'GM') {
                <input type="text"
                       [value]="slide.title"
                       (change)="updateSlideTitle(i, $event)"
                       class="text-4xl font-serif text-[#b8860b] drop-shadow-md bg-transparent border-b border-transparent hover:border-[#b8860b]/50 focus:border-[#b8860b] focus:outline-none w-full max-w-4xl text-left placeholder-[#b8860b]/50 transition-colors"
                       placeholder="Título da Cena">
              } @else {
                <h2 class="text-4xl font-serif text-[#b8860b] drop-shadow-md text-left">{{ slide.title }}</h2>
              }
            </div>
          </div>
        }
        
        @if (slides().length === 0) {
          <div class="absolute inset-0 flex items-center justify-center text-stone-500 font-serif">
            Nenhum slide disponível.
          </div>
        }
      </div>

      <!-- Navigation Controls -->
      @if (slides().length > 1) {
        <button (click)="prevSlide()" 
                class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-stone-900/50 hover:bg-stone-800/80 text-[#b8860b] rounded-full border border-[#b8860b]/30 backdrop-blur-sm transition-all z-30 opacity-0 group-hover:opacity-100 focus:opacity-100"
                [class.cursor-not-allowed]="currentIndex() === 0"
                [class.opacity-30]="currentIndex() === 0"
                [disabled]="currentIndex() === 0">
          <mat-icon>chevron_left</mat-icon>
        </button>
        
        <button (click)="nextSlide()" 
                class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-stone-900/50 hover:bg-stone-800/80 text-[#b8860b] rounded-full border border-[#b8860b]/30 backdrop-blur-sm transition-all z-30 opacity-0 group-hover:opacity-100 focus:opacity-100"
                [class.cursor-not-allowed]="currentIndex() === slides().length - 1"
                [class.opacity-30]="currentIndex() === slides().length - 1"
                [disabled]="currentIndex() === slides().length - 1">
          <mat-icon>chevron_right</mat-icon>
        </button>
      }
    </div>
  `,
  styles: [`
    .text-shadow-sm { text-shadow: 0 1px 3px rgba(0,0,0,0.9); }
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class StorySlidesComponent {
  auth = inject(AuthService);
  combat = inject(CombatService);

  slides = input<Slide[]>([]);
  
  currentIndex = signal<number>(0);
  isFullscreen = signal<boolean>(false);

  @ViewChild('slideContainer') slideContainer!: ElementRef<HTMLDivElement>;

  progressPercentage = computed(() => {
    const total = this.slides().length;
    if (total <= 1) return 100;
    return ((this.currentIndex() + 1) / total) * 100;
  });

  @HostListener('document:fullscreenchange')
  onFullscreenChange() {
    this.isFullscreen.set(!!document.fullscreenElement);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.nextSlide();
    } else if (event.key === 'ArrowLeft') {
      this.prevSlide();
    }
  }

  nextSlide() {
    if (this.currentIndex() < this.slides().length - 1) {
      this.currentIndex.update(i => i + 1);
    }
  }

  prevSlide() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
    }
  }

  async toggleFullscreen() {
    if (!this.slideContainer) return;
    
    const elem = this.slideContainer.nativeElement;
    
    if (!document.fullscreenElement) {
      try {
        await elem.requestFullscreen();
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  }

  uploadNewSlide(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        this.combat.addStorySlide({
          url: result,
          title: 'Nova Cena',
          description: 'Descrição da nova cena...'
        });
        // Move to the new slide
        setTimeout(() => {
          this.currentIndex.set(this.slides().length - 1);
        }, 100);
      }
    };
    
    reader.readAsDataURL(file);
    input.value = ''; // Reset input
  }

  updateCurrentSlideImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        this.combat.updateStorySlide(this.currentIndex(), { url: result });
      }
    };
    
    reader.readAsDataURL(file);
    input.value = ''; // Reset input
  }

  updateSlideTitle(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.combat.updateStorySlide(index, { title: input.value });
  }
}
