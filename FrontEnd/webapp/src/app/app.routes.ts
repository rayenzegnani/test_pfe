import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Categories } from './components/manage/categories/categories';
import { CategoryForm } from './components/manage/category-form/category-form';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { AdminLayout } from './components/manage/admin-layout/admin-layout';
import { Product } from './components/manage/product/product';
import { ProductForm } from './components/manage/product-form/product-form';
import { Dashbord } from './components/manage/dashbord/dashbord';
import { Income } from './components/manage/income/income';
import { User } from './components/manage/user/user';
import { Settings } from './components/manage/settings/settings';
import { Collections } from './components/collections/collections';
import { Cart } from './components/cart/cart';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'collections', component: Collections },
    { path: 'cart', component: Cart },
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashbord}, // Using Categories as dashboard for now
            { path: 'category', component: Categories },
            { path: 'category/add', component: CategoryForm },
            { path: 'category/:id', component: CategoryForm },
            { path: 'product', component: Product },
            { path: 'product/add', component: ProductForm },
            { path: 'product/:id', component: ProductForm },
            { path: 'income', component: Income }, // Placeholder - will create Income component later
            { path: 'users', component: User }, // Placeholder - will create Users component later
            { path: 'settings', component: Settings } // Placeholder - will create Settings component later
        ]
    }
];
