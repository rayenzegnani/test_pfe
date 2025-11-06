import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  cartItemsCount = 1;

  categories = [
    { name: 'Living Room' },
    { name: 'Workspace' },
    { name: 'Outdoor Oasis' },
    { name: 'Wellness' },
    { name: 'Tech Essentials' },
    { name: 'Kitchen Classics' }
  ];

  products = [
    {
      name: 'Aurora Lounge Chair',
      category: 'Living Room',
      price: '$189.00',
      image: 'https://images.unsplash.com/photo-1616628182501-e2f6f8c6df5b?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Nordic Floor Lamp',
      category: 'Lighting',
      price: '$129.00',
      image: 'https://images.unsplash.com/photo-1505692794403-55b39f47b1a4?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Siena Ceramic Set',
      category: 'Kitchen',
      price: '$74.50',
      image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Willow Knit Throw',
      category: 'Textiles',
      price: '$58.00',
      image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Studio Desk Setup',
      category: 'Workspace',
      price: '$249.00',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Bloom Fragrance Diffuser',
      category: 'Wellness',
      price: '$42.00',
      image: 'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?auto=format&fit=crop&w=900&q=80'
    }
  ];

  addToCart(product: any) {
    console.log('Adding to cart:', product);
    this.cartItemsCount++;
  }
}

