import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="card">
      <div class="card-header" *ngIf="hasHeader">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="hasFooter">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 1.25rem;
      border-bottom: 1px solid #e0e0e0;
      font-weight: 600;
    }

    .card-body {
      padding: 1.25rem;
    }

    .card-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid #e0e0e0;
      background: #f8f9fa;
    }
  `]
})
export class CardComponent {
    hasHeader = false;
    hasFooter = false;

    ngAfterContentInit() {
        // Check if header/footer content is provided
        // This is a simplified version; you might want to use @ContentChild
    }
}
