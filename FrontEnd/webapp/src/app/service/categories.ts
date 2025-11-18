import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  http=inject(HttpClient);


  constructor() {
    
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  getCategories(){
    return this.http.get("http://localhost:3000/categories");
  }
  // Send plain JSON with category fields (backend expects JSON)
  createCategory(categoryData: { name: string }){
     return this.http.post("http://localhost:3000/categories", categoryData, { headers: this.getAuthHeaders() });
  }
  getCategoriesById(id:string){
    return this.http.get(`http://localhost:3000/categories/${id}`);
  }
    UpdateCategory(categoryData: { name: string,id:string }){
     const { id, name } = categoryData;
     return this.http.put(`http://localhost:3000/categories/${id}`, {
      name: name
     }, { headers: this.getAuthHeaders() });
  }
    DeletCategory(id:string ){
     
     return this.http.delete(`http://localhost:3000/categories/${id}`, { headers: this.getAuthHeaders() });
    }
    
  
}
