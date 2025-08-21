export type TProductImage = {
  id: string;
  productId: string;
  imageUrl: string;
  color: string;
  stock: number;
  isPrimary: boolean;
  isActive: boolean;
};

export type TProduct = {
  id: string;
  name: string;
  description?: string;
  originalPrice?: number;
  price: number;
  category: string;
  gender?: string;
  isNew: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  productImages: TProductImage[];
};

// Image type for creation
export type TCreateProductImage = {
  imageUrl: string;
  color: string;
  stock?: number; // optional since default = 0
  isPrimary?: boolean; // optional since default = false
  isActive?: boolean; // optional since default = true
};

// Product type for creation
export type TCreateProduct = {
  name: string;
  description?: string;
  originalPrice?: number;
  price?: number; // optional since default = 0.0
  category: string;
  isNew?: boolean; // optional since default = false
  gender?: "MALE" | "FEMALE" | "UNISEX"; // based on your GenderEnum
  productImages: TCreateProductImage[];
};
