export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentIntentId?: string;
    createdAt: Date;
    updatedAt?: Date;
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export interface CreatePaymentIntentRequest {
    orderId: string;
    amount: number;
}

export interface PaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
}

export interface ConfirmPaymentRequest {
    paymentIntentId: string;
    orderId: string;
}
