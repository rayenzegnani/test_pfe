import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔑 Getting auth token:', { 
      hasToken: !!token, 
      tokenPreview: token ? token.substring(0, 20) + '...' : 'NO TOKEN' 
    });
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getProducts(): Observable<any> {
    console.log('📦 Fetching products...');
    return this.http.get(this.apiUrl);
  }

  getProductById(id: string): Observable<any> {
    console.log('📦 Fetching product by ID:', id);
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addProduct(product: any): Observable<any> {
    console.log('➕ Adding product:', product);
    return this.http.post(this.apiUrl, product, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
