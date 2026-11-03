export type BookCategory = 'van-hoc' | 'kinh-te' | 'ky-nang-song' | 'khoa-hoc' | 'trinh-tham' | 'thieu-nhi';

export type Book = {
  id: number;
  title: string;
  author: string;
  category: BookCategory;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
  format: string;
  badge: string;
  description: string;
  pages: number;
};
