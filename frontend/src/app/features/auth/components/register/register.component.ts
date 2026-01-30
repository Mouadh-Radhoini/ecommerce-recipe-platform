import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../../services/auth-api.service';
import { UserRole } from '../../../../core/models/user.model';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    isLoading = signal(false);
    errorMessage = signal<string | null>(null);
    readonly UserRole = UserRole;

    constructor(
        private fb: FormBuilder,
        private authApiService: AuthApiService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]],
            role: [UserRole.BUYER, [Validators.required]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');

        if (!password || !confirmPassword) {
            return null;
        }

        if (password.value !== confirmPassword.value) {
            const existingErrors = confirmPassword.errors ?? {};
            confirmPassword.setErrors({ ...existingErrors, passwordMismatch: true });
            return { passwordMismatch: true };
        }

        if (confirmPassword.hasError('passwordMismatch')) {
            const { passwordMismatch, ...rest } = confirmPassword.errors ?? {};
            confirmPassword.setErrors(Object.keys(rest).length ? rest : null);
        }

        return null;
    }

    onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        const rawValue = this.registerForm.getRawValue();
        const trimmedName = rawValue.name.trim();
        const trimmedEmail = rawValue.email.trim();

        if (!trimmedName) {
            this.registerForm.get('name')?.setErrors({ required: true });
            this.isLoading.set(false);
            return;
        }

        if (!trimmedEmail) {
            this.registerForm.get('email')?.setErrors({ required: true });
            this.isLoading.set(false);
            return;
        }

        const { confirmPassword, ...registrationData } = {
            ...rawValue,
            name: trimmedName,
            email: trimmedEmail
        };

        this.authApiService.register(registrationData).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (error) => {
                if (typeof error.message === 'string' && error.message.toLowerCase().includes('email')) {
                    this.registerForm.get('email')?.setErrors({ server: true });
                }
                const message = error.message || 'Registration failed. Please try again.';
                this.errorMessage.set(
                    message.includes('Email already in use')
                        ? 'Email already in use. Try another email or log in.'
                        : message
                );
                this.isLoading.set(false);
            },
            complete: () => {
                this.isLoading.set(false);
            }
        });
    }

    get email() {
        return this.registerForm.get('email');
    }

    get name() {
        return this.registerForm.get('name');
    }

    get password() {
        return this.registerForm.get('password');
    }

    get confirmPassword() {
        return this.registerForm.get('confirmPassword');
    }

    get role() {
        return this.registerForm.get('role');
    }
}
