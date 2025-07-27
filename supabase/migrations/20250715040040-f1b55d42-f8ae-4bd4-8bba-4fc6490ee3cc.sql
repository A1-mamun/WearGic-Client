-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
('Wallets', 'Premium leather wallets for men and women'),
('Handbags', 'Luxury handbags and purses'),
('Shoes', 'Fashionable footwear collection'),
('Bags', 'Crossbody bags and accessories');

-- Insert sample products
INSERT INTO public.products (name, description, price, original_price, category_id, gender, image_url, stock_quantity, is_featured, is_new, is_sale, rating, review_count, sku) VALUES
('Premium Leather Wallet', 'Handcrafted genuine leather wallet with multiple card slots', 89.00, 120.00, (SELECT id FROM public.categories WHERE name = 'Wallets'), 'men', '/src/assets/product-wallet.jpg', 50, true, true, true, 4.8, 124, 'WLT001'),
('Luxury Black Handbag', 'Elegant black handbag perfect for professional settings', 299.00, NULL, (SELECT id FROM public.categories WHERE name = 'Handbags'), 'women', '/src/assets/product-handbag.jpg', 30, true, false, false, 4.9, 89, 'HB001'),
('Classic Oxford Shoes', 'Traditional oxford shoes crafted from premium leather', 189.00, 220.00, (SELECT id FROM public.categories WHERE name = 'Shoes'), 'men', '/src/assets/product-shoes.jpg', 25, true, false, true, 4.7, 156, 'SH001'),
('Elegant Crossbody Bag', 'Stylish crossbody bag for everyday use', 149.00, NULL, (SELECT id FROM public.categories WHERE name = 'Bags'), 'women', '/src/assets/product-crossbody.jpg', 40, true, true, false, 4.6, 78, 'CB001');

-- Insert sample banners
INSERT INTO public.banners (title, subtitle, image_url, link_url, button_text, is_active, display_order) VALUES
('Summer Collection 2024', 'Discover our latest premium leather accessories', '/src/assets/hero-banner.jpg', '/products', 'Shop Now', true, 1),
('Exclusive Handbag Sale', 'Up to 40% off on selected luxury handbags', '/src/assets/product-handbag.jpg', '/products?category=handbags', 'View Collection', true, 2),
('New Arrivals', 'Fresh styles for the modern professional', '/src/assets/product-wallet.jpg', '/products?filter=new', 'Explore New', true, 3);