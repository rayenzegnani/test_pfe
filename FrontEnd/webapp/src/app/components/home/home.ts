import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
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

