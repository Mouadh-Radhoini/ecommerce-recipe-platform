import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingCountSignal = signal<number>(0);
    private isLoadingSignal = signal<boolean>(false);

    readonly isLoading = this.isLoadingSignal.asReadonly();

    show(): void {
        this.loadingCountSignal.update(count => count + 1);
        this.isLoadingSignal.set(true);
    }

    hide(): void {
        this.loadingCountSignal.update(count => Math.max(0, count - 1));

        // Only set to false when all requests are complete
        if (this.loadingCountSignal() === 0) {
            this.isLoadingSignal.set(false);
        }
    }

    reset(): void {
        this.loadingCountSignal.set(0);
        this.isLoadingSignal.set(false);
    }
}
