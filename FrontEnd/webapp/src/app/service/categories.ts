import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  http=inject(HttpClient);


  constructor() {
    
  }
  getCategories(){
    return this.http.get("http://localhost:3000/category");
  }
  createCategory(categoryData: FormData){
     return this.http.post("http://localhost:3000/category", categoryData);
  }
  getCategoriesById(id:string){
    return this.http.get("http://localhost:3000/category+'/'+id);");
  }
  
}
