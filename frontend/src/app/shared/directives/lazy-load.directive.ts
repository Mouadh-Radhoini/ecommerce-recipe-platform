import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appLazyLoad]',
    standalone: true
})
export class LazyLoadDirective implements OnInit {
    @Input() appLazyLoad: string = '';
    @Input() placeholder: string = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e0e0e0" width="400" height="300"/%3E%3C/svg%3E';

    private observer?: IntersectionObserver;

    constructor(private el: ElementRef<HTMLImageElement>) { }

    ngOnInit(): void {
        // Set placeholder initially
        this.el.nativeElement.src = this.placeholder;

        // Create intersection observer
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage();
                        this.observer?.disconnect();
                    }
                });
            },
            { rootMargin: '50px' }
        );

        this.observer.observe(this.el.nativeElement);
    }

    private loadImage(): void {
        const img = new Image();
        img.onload = () => {
            this.el.nativeElement.src = this.appLazyLoad;
        };
        img.src = this.appLazyLoad;
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }
}
