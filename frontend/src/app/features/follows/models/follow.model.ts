export interface Follow {
    id: string;
    followerId: string; // User who is following
    followerName: string;
    followerAvatarUrl?: string;
    followingId: string; // User being followed (usually a chef)
    followingName: string;
    followingAvatarUrl?: string;
    createdAt: Date;
}

export interface FollowStats {
    followersCount: number;
    followingCount: number;
}
