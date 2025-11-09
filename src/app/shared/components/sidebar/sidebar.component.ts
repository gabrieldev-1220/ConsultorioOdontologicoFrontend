import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  sidebarActive: boolean = true;
  rol: string = '';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.rol = this.authService.getRol();
  }

  logout() {
    this.authService.logout();
  }

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }
}