import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button 
      [type]="type"
      [class]="buttonClass"
      [disabled]="disabled || loading"
      (click)="handleClick($event)">
      @if (loading) {
        <span class="spinner"></span>
      }
      <ng-content></ng-content>
    </button>
  `,
    styles: [`
    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .primary {
      background: #4CAF50;
      color: white;
    }

    .primary:hover:not(:disabled) {
      background: #45a049;
    }

    .secondary {
      background: #6c757d;
      color: white;
    }

    .secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .danger {
      background: #f44336;
      color: white;
    }

    .danger:hover:not(:disabled) {
      background: #da190b;
    }

    .outline {
      background: transparent;
      border: 2px solid #4CAF50;
      color: #4CAF50;
    }

    .outline:hover:not(:disabled) {
      background: #4CAF50;
      color: white;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
    @Input() variant: 'primary' | 'secondary' | 'danger' | 'outline' = 'primary';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() disabled = false;
    @Input() loading = false;

    get buttonClass(): string {
        return this.variant;
    }

    handleClick(event: Event): void {
        if (this.disabled || this.loading) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
}
