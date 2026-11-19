export interface Order {
    id: string;
    buyerId: string;
    recipeId: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'FAILED';
    createdAt: string;
}
