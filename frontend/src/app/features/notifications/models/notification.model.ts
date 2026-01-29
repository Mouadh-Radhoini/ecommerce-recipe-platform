export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedId?: string; // Recipe ID, Order ID, etc.
    read: boolean;
    createdAt: Date;
}

export enum NotificationType {
    NEW_FOLLOWER = 'NEW_FOLLOWER',
    NEW_RECIPE = 'NEW_RECIPE',
    NEW_COMMENT = 'NEW_COMMENT',
    NEW_ORDER = 'NEW_ORDER',
    ORDER_COMPLETED = 'ORDER_COMPLETED',
    PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    SYSTEM = 'SYSTEM'
}

export interface NotificationListResponse {
    notifications: Notification[];
    unreadCount: number;
}
