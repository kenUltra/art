import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavComponent } from '../../component/nav/nav.component';
import { Title } from '@angular/platform-browser';
import { BrowserStorageService } from '../../services/storage.service';

@Component({
  selector: 'auth-page',
  imports: [RouterOutlet, NavComponent],
  template: `
    <div class="wrapper">
      <nav-auth></nav-auth>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AuthPath {
  private readonly tokenValue: string = 'access';
  authService = inject<AuthService>(AuthService);
  storage = inject<BrowserStorageService>(BrowserStorageService);

  constructor(private router: Router, private title: Title) {
    this.authService.getContent().subscribe({
      next: (value: any) => {
        this.storage.updated(this.tokenValue, 'acToken', value.access);

        this.title.setTitle('Welcome to art | Art');
      },
      error: (error: any) => {
        console.error(error.name + ' ' + error.statusText);
        if (!error.ok) {
          this.authService.isLoggedIn.next(false);
          this.storage.remove(this.tokenValue);
          this.router.navigate(['/home'], { skipLocationChange: true });
        }
      },
    });
  }
}
