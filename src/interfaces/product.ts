export interface ProductAttributes {
    productId?: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    stockQuantity?: number,
    image?: string,
    sold?: number,
    brandId: string,
    categoryId: string,
    userId: string,
  }