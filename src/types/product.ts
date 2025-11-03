export type TProductSpecifications = {
  key: string;
  value: string;
};

export type TProductImage = {
  id: string;
  productId: string;
  publicId: string;
  imageUrl: string;
  color: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TCoverImage = {
  id: string;
  productId: string;
  publicId: string;
  imageUrl: string;
};

export type TBulkImage = {
  id: string;
  productId: string;
  publicId: string;
  imageUrl: string;
};

export type TProduct = {
  id: string;
  name: string;
  code: string;
  brand?: string;
  totalStock: number;
  description?: string;
  originalPrice?: number;
  price: number;
  category: string;
  subCategory: string;
  gender?: string;
  isNew: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  coverImage: TCoverImage;
  bulkImages: TBulkImage[];
  productImages: TProductImage[];
  specifications: TProductSpecifications[];
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

export type TShowedproductImage = {
  id: string;
  productId: string;
  publicId: string;
  imageUrl: string;
  color?: string | null | undefined;
  stock?: number | null | undefined;
  isActive?: boolean | null | undefined;
};
