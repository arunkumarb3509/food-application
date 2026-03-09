import { Injectable } from '@angular/core';
import { CategoryChip, Dish, FoodCategory, Restaurant } from './models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  readonly categories: CategoryChip[] = [
    { id: 'Pizza', label: 'Pizza', emoji: '🍕' },
    { id: 'Burger', label: 'Burger', emoji: '🍔' },
    { id: 'Biryani', label: 'Biryani', emoji: '🍛' },
    { id: 'Desserts', label: 'Desserts', emoji: '🍰' },
    { id: 'Drinks', label: 'Drinks', emoji: '🥤' }
  ];

  readonly restaurants: Restaurant[] = [
    {
      id: 'r-roma',
      name: 'Roma Slice & Co.',
      imageUrl:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1400',
      rating: 4.6,
      deliveryMins: 28,
      cuisines: ['Pizza', 'Italian'],
      priceForOne: 250,
      promoted: true
    },
    {
      id: 'r-bombay-biryani',
      name: 'Bombay Biryani House',
      imageUrl:
        'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=1400&q=80',
      rating: 4.4,
      deliveryMins: 32,
      cuisines: ['Biryani', 'North Indian'],
      priceForOne: 220
    },
    {
      id: 'r-smash-bros',
      name: 'Smash Bros Burger',
      imageUrl:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80',
      rating: 4.3,
      deliveryMins: 24,
      cuisines: ['Burger', 'American'],
      priceForOne: 200
    },
    {
      id: 'r-sweet-lab',
      name: 'Sweet Lab Desserts',
      imageUrl:
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1400&q=80',
      rating: 4.7,
      deliveryMins: 20,
      cuisines: ['Desserts', 'Bakery'],
      priceForOne: 180,
      promoted: true
    },
    {
      id: 'r-south-spice',
      name: 'South Spice',
      imageUrl:
        'https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg?auto=compress&cs=tinysrgb&w=1400',
      rating: 4.2,
      deliveryMins: 30,
      cuisines: ['South Indian', 'Healthy'],
      priceForOne: 170
    },
    {
      id: 'r-wok-street',
      name: 'Wok Street',
      imageUrl:
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=80',
      rating: 4.1,
      deliveryMins: 26,
      cuisines: ['Chinese', 'Asian'],
      priceForOne: 190
    }
  ];

  readonly dishes: Dish[] = [
    {
      id: 'd-truffle-pizza',
      restaurantId: 'r-roma',
      name: 'Truffle Mushroom Pizza',
      description: 'Mozzarella, truffle oil, roasted mushrooms, basil.',
      category: 'Pizza',
      price: 399,
      rating: 4.6,
      imageUrl:
        'https://images.pexels.com/photos/4109120/pexels-photo-4109120.jpeg?auto=compress&cs=tinysrgb&w=1400',
      bestseller: true
    },
    {
      id: 'd-pepperoni-pizza',
      restaurantId: 'r-roma',
      name: 'Classic Pepperoni',
      description: 'Loaded pepperoni, melty cheese, tangy marinara.',
      category: 'Pizza',
      price: 349,
      rating: 4.4,
      imageUrl:
        'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'd-hyd-chicken-biryani',
      restaurantId: 'r-bombay-biryani',
      name: 'Hyderabadi Chicken Biryani',
      description: 'Dum-cooked basmati, saffron, tender chicken.',
      category: 'Biryani',
      price: 299,
      rating: 4.5,
      imageUrl:
        'https://images.pexels.com/photos/14607563/pexels-photo-14607563.jpeg?auto=compress&cs=tinysrgb&w=1400',
      bestseller: true
    },
    {
      id: 'd-paneer-biryani',
      restaurantId: 'r-bombay-biryani',
      name: 'Paneer Tikka Biryani',
      description: 'Smoky paneer, masala rice, raita on the side.',
      category: 'Biryani',
      price: 279,
      rating: 4.2,
      imageUrl:
        'https://images.pexels.com/photos/1938358/pexels-photo-1938358.jpeg?auto=compress&cs=tinysrgb&w=1400'
    },
    {
      id: 'd-smash-cheese',
      restaurantId: 'r-smash-bros',
      name: 'Double Smash Cheeseburger',
      description: 'Two patties, cheddar, secret sauce, pickles.',
      category: 'Burger',
      price: 259,
      rating: 4.3,
      imageUrl:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=80',
      bestseller: true
    },
    {
      id: 'd-crispy-chicken',
      restaurantId: 'r-smash-bros',
      name: 'Crispy Chicken Burger',
      description: 'Crispy fried chicken, slaw, spicy mayo.',
      category: 'Burger',
      price: 239,
      rating: 4.1,
      imageUrl:
        'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'd-choco-lava',
      restaurantId: 'r-sweet-lab',
      name: 'Choco Lava Cake',
      description: 'Warm gooey center, vanilla bean scoop.',
      category: 'Desserts',
      price: 199,
      rating: 4.7,
      imageUrl:
        'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=1400&q=80',
      bestseller: true
    },
    {
      id: 'd-red-velvet',
      restaurantId: 'r-sweet-lab',
      name: 'Red Velvet Jar',
      description: 'Cream cheese, cocoa crumb, perfectly layered.',
      category: 'Desserts',
      price: 189,
      rating: 4.5,
      imageUrl:
        'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1400'
    },
    {
      id: 'd-masala-dosa',
      restaurantId: 'r-south-spice',
      name: 'Crispy Masala Dosa',
      description: 'Golden dosa, potato masala, coconut chutney.',
      category: 'South Indian',
      price: 159,
      rating: 4.2,
      imageUrl:
        'https://images.pexels.com/photos/4051022/pexels-photo-4051022.jpeg?auto=compress&cs=tinysrgb&w=1400',
      bestseller: true
    },
    {
      id: 'd-filter-coffee',
      restaurantId: 'r-south-spice',
      name: 'Filter Coffee',
      description: 'Strong, aromatic, perfectly foamy.',
      category: 'Drinks',
      price: 89,
      rating: 4.4,
      imageUrl:
        'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'd-hakka-noodles',
      restaurantId: 'r-wok-street',
      name: 'Veg Hakka Noodles',
      description: 'Wok-tossed noodles, veggies, garlic soy.',
      category: 'Chinese',
      price: 199,
      rating: 4.0,
      imageUrl:
        'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=1400'
    },
    {
      id: 'd-bubble-tea',
      restaurantId: 'r-wok-street',
      name: 'Mango Bubble Tea',
      description: 'Mango tea, tapioca pearls, chilled.',
      category: 'Drinks',
      price: 169,
      rating: 4.1,
      imageUrl:
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1400&q=80'
    }
  ];

  constructor() {}

  getRestaurant(id: string | null | undefined): Restaurant | undefined {
    if (!id) return undefined;
    return this.restaurants.find((r) => r.id === id);
  }

  getMenuForRestaurant(restaurantId: string | null | undefined): Dish[] {
    if (!restaurantId) return [];
    return this.dishes.filter((d) => d.restaurantId === restaurantId);
  }

  getTrendingRestaurants(): Restaurant[] {
    return [...this.restaurants]
      .sort((a, b) => (b.promoted === true ? 1 : 0) - (a.promoted === true ? 1 : 0))
      .slice(0, 4);
  }

  getFeaturedDishes(): Dish[] {
    return this.dishes.filter((d) => d.bestseller).slice(0, 6);
  }

  searchDishes(query: string, category?: FoodCategory | 'All'): Dish[] {
    const q = query.trim().toLowerCase();
    const byText = this.dishes.filter((d) => {
      if (!q) return true;
      const r = this.getRestaurant(d.restaurantId);
      return (
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        r?.name.toLowerCase().includes(q)
      );
    });
    const byCat =
      category && category !== 'All' ? byText.filter((d) => d.category === category) : byText;
    return byCat;
  }
}
