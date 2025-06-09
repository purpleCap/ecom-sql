export interface BlogAttributes {
    blogId?: string;
    title: string;
    description: string;
    category: Enumerator,
    numViews?: number,
    // isLiked?: boolean;
    // isDisliked?: boolean,
    image?: string,
    createdBy?: string,
    likedUsers?: [],
    dislikedUsers?: [],
  }