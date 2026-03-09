export type FoodCategory =
  | 'Pizza'
  | 'Burger'
  | 'Biryani'
  | 'Desserts'
  | 'Drinks'
  | 'South Indian'
  | 'Chinese'
  | 'Healthy';

export interface CategoryChip {
  id: FoodCategory;
  label: string;
  emoji: string;
}

export interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  rating: number; // 0-5
  deliveryMins: number;
  cuisines: string[];
  priceForOne: number;
  promoted?: boolean;
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  category: FoodCategory;
  price: number;
  rating: number; // 0-5
  imageUrl: string;
  bestseller?: boolean;
}

export interface CartLine {
  dish: Dish;
  qty: number;
}

