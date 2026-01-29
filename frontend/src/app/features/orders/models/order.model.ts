export interface Order {
    id: string;
    buyerId: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentId?: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface OrderItem {
    recipeId: string;
    recipeTitle: string;
    price: number;
    chefId: string;
    chefName: string;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export interface CreateOrderRequest {
    recipeIds: string[];
}

export interface OrderListResponse {
    orders: Order[];
    total: number;
    page: number;
    pageSize: number;
}
