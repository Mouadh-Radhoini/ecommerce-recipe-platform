import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toast-container',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="toast.type">
          <span class="message">{{ toast.message }}</span>
          <button class="close" (click)="toastService.remove(toast.id)">&times;</button>
        </div>
      }
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
      color: white;
      font-weight: 500;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast.success {
      background: #4CAF50;
    }

    .toast.error {
      background: #f44336;
    }

    .toast.warning {
      background: #ff9800;
    }

    .toast.info {
      background: #2196F3;
    }

    .message {
      flex: 1;
    }

    .close {
      background: transparent;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0 0.5rem;
      margin-left: 1rem;
      line-height: 1;
    }

    .close:hover {
      opacity: 0.8;
    }
  `]
})
export class ToastContainerComponent {
    toastService = inject(ToastService);
}
