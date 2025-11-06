import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../service/product';
import { inject } from '@angular/core';

@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './product.html',
  styleUrl: './product.scss'
})
export class Product {
  displayedColumns: string[] = ['id', 'image', 'name', 'price', 'discount', 'featured', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  productService = inject(ProductService);

  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.getServerData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private getServerData(): void {
    this.productService.getProducts().subscribe((data: any) => {
      this.dataSource.data = data;
    });
  }

  Delete(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: (data: any) => {
          console.log('deleted', data);
          alert('Product deleted successfully');
          this.getServerData();
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete product');
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
