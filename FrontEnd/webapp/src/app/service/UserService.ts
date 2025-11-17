import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    http=inject(HttpClient);
    private apiUrl = 'http://localhost:3000';

    constructor() {}

    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      });
    }

    AddUser(userData: { fullName: string, email: string, password: string }){
       // Map fullName to nom for backend compatibility
       const backendData = {
         nom: userData.fullName,
         email: userData.email,
         password: userData.password
       };
       return this.http.post(`${this.apiUrl}/auth/register`, backendData);
    }
    
    loginUser(userData:{ email: string, password: string }) {
      return this.http.post(`${this.apiUrl}/auth/login`,userData);
    }

    getAllUsers() {
      return this.http.get(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() });
    }

    getUserById(id: string) {
      return this.http.get(`${this.apiUrl}/users/${id}`, { headers: this.getAuthHeaders() });
    }

    deleteUser(id: string) {
      return this.http.delete(`${this.apiUrl}/users/${id}`, { headers: this.getAuthHeaders() });
    }

 
}