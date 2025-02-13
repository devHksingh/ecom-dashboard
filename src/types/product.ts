export interface Product {
    _id: string; // MongoDB ObjectId
    title: string;
    brand: string;
    category: string[]; // Array of categories
    currency: string;
    description: string;
    image: string; // URL of the product image
    price: number;
    salePrice: number;
    totalStock: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number; // Mongoose version key
}
