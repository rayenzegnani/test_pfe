import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/UserService';

interface UserData {
  id: string;
  nom: string;
  email: string;
  role: boolean;
  createdAt: any;
  updatedAt: any;
}

@Component({
  selector: 'app-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class User implements OnInit {
  userService = inject(UserService);
  users: UserData[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showAddAdminDialog: boolean = false;
  newAdminEmail: string = '';
  inviting: boolean = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.users = response.data;
          console.log('Users loaded:', this.users);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    });
  }

  deleteUser(userId: string, userName: string): void {
    if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      this.userService.deleteUser(userId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.successMessage = `User "${userName}" deleted successfully`;
            this.loadUsers(); // Reload the list
            
            // Clear success message after 3 seconds
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = `Failed to delete user "${userName}". Please try again.`;
          
          // Clear error message after 5 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore Timestamp object
    let date: Date;
    if (timestamp && timestamp._seconds) {
      date = new Date(timestamp._seconds * 1000);
    } else if (timestamp && timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeSinceLastLogin(timestamp: any): string {
    if (!timestamp) return 'Never';
    
    // Handle Firestore Timestamp object
    let loginDate: Date;
    if (timestamp && timestamp._seconds) {
      loginDate = new Date(timestamp._seconds * 1000);
    } else if (timestamp && timestamp.seconds) {
      loginDate = new Date(timestamp.seconds * 1000);
    } else {
      loginDate = new Date(timestamp);
    }
    
    const now = new Date();
    const diffMs = now.getTime() - loginDate.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return this.formatDate(timestamp);
  }

  getUserInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  get adminCount(): number {
    return this.users.filter(user => user.role).length;
  }

  get regularUserCount(): number {
    return this.users.filter(user => !user.role).length;
  }

  openAddAdminDialog(): void {
    this.showAddAdminDialog = true;
    this.newAdminEmail = '';
    this.errorMessage = '';
  }

  closeAddAdminDialog(): void {
    this.showAddAdminDialog = false;
    this.newAdminEmail = '';
    this.inviting = false;
  }

  inviteAdmin(): void {
    if (!this.newAdminEmail || !this.newAdminEmail.includes('@')) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.inviting = true;
    this.errorMessage = '';

    this.userService.inviteAdmin(this.newAdminEmail).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = `Admin invitation sent to ${this.newAdminEmail}. Password has been emailed.`;
          this.closeAddAdminDialog();
          this.loadUsers(); // Reload users list
          
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        }
        this.inviting = false;
      },
      error: (error) => {
        console.error('Error inviting admin:', error);
        this.errorMessage = error.error?.message || 'Failed to invite admin. Please try again.';
        this.inviting = false;
      }
    });
  }
}
