import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    http=inject(HttpClient);

    constructor() {}

    AddUser(userData: { fullName: string, email: string, hashedpassword: string }){
       // Map fullName to nom for backend compatibility
       const backendData = {
         nom: userData.fullName,
         email: userData.email,
         password: userData.hashedpassword
       };
       return this.http.post("http://localhost:3000/auth/register", backendData);
    }
}