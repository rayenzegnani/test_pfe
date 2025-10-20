import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  cartItemsCount = 2;

  

  addToCart(product: any) {
    console.log('Adding to cart:', product);
    this.cartItemsCount++;
  }
}

