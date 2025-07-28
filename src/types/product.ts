export type TProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number; // Added quantity field
  imageUrl: string;
  category: string;
  gender: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isSale: boolean;
};
