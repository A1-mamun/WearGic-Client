export type TProductImage = {
  id: string;
  productId: string;
  imageUrl: string;
  color: string;
  stock: number;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  stock?: number;
  isPrimary?: boolean;
  isActive?: boolean;
};

// Product type for creation
export type TCreateProduct = {
  name: string;
  description?: string;
  originalPrice?: number;
  price?: number;
  category: string;
  isNew?: boolean;
  gender?: "MALE" | "FEMALE";
  productImages: TCreateProductImage[];
};

export type TGender = "MALE" | "FEMALE";
