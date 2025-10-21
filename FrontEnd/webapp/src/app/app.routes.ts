import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import {Categories} from './components/manage/categories/categories';
import {CategoryForm} from './components/manage/category-form/category-form';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';

export const routes: Routes = [

    {path:'',component:Home},
    {path:'admin/category',component:Categories},
      {path:'admin/category/add',component:CategoryForm},
         {path:'admin/category/:id',component:CategoryForm},
         {path:'login',component:Login},
         {path:'signup',component:Signup}

];
