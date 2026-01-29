import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-rating-stars',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="rating-stars">
      @for (star of stars; track $index) {
        <span 
          class="star"
          [class.filled]="star <= rating"
          [class.interactive]="interactive"
          (click)="onStarClick(star)">
          {{ star <= rating ? '★' : '☆' }}
        </span>
      }
      @if (showCount && count) {
        <span class="count">({{ count }})</span>
      }
    </div>
  `,
    styles: [`
    .rating-stars {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .star {
      font-size: 1.5rem;
      color: #ddd;
      transition: color 0.2s;
    }

    .star.filled {
      color: #ffc107;
    }

    .star.interactive {
      cursor: pointer;
    }

    .star.interactive:hover {
      transform: scale(1.2);
    }

    .count {
      margin-left: 0.5rem;
      color: #666;
      font-size: 0.875rem;
    }
  `]
})
export class RatingStarsComponent {
    @Input() rating = 0;
    @Input() count?: number;
    @Input() showCount = false;
    @Input() interactive = false;

    stars = [1, 2, 3, 4, 5];

    onStarClick(star: number): void {
        if (this.interactive) {
            this.rating = star;
            // Emit event for parent to handle
        }
    }
}
