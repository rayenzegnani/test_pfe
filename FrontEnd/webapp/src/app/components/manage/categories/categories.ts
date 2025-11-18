import { Component } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ViewChild } from '@angular/core';
import { CategoriesService } from '../../../service/categories';
import { inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports:[ MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatButtonModule,
    RouterLink
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories {

  displayedColumns: string[] = ['id', 'Name', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  categoryService=inject(CategoriesService);
row_id: any;
constructor() {
  this.dataSource = new MatTableDataSource<any>([]);

}
Delete(row_id:string){
  if (!row_id) {
    console.error('No ID provided for deletion');
    alert('Error: Category ID is missing');
    return;
  }
  
  console.log('Deleting category with ID:', row_id);
  
  this.categoryService.DeletCategory(row_id).subscribe({
    next: (data:any) => {
      console.log("Category deleted successfully", data);
      alert("Category Deleted");
      this.getServerData();
    },
    error: (error:any) => {
      console.error('Error deleting category:', error);
      alert(`Failed to delete category: ${error.error?.message || error.message}`);
    }
  });
}

ngOnInit(): void {
  this.getServerData();
}

private getServerData(): void {
  this.categoryService.getCategories().subscribe((data:any) => {
    this.dataSource.data = data;
  });
}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}


