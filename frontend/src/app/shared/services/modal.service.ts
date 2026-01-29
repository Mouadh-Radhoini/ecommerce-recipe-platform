import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
    title?: string;
    size?: 'small' | 'medium' | 'large';
}

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private isOpenSignal = signal(false);
    private configSignal = signal<ModalConfig>({});

    readonly isOpen = this.isOpenSignal.asReadonly();
    readonly config = this.configSignal.asReadonly();

    open(config: ModalConfig = {}): void {
        this.configSignal.set(config);
        this.isOpenSignal.set(true);
    }

    close(): void {
        this.isOpenSignal.set(false);
    }
}
