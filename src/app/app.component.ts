import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, ConfirmModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'PokerRvd';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // Recarrega permissões do usuário (evita ficar com permissões antigas no localStorage)
    this.auth.refreshCurrentUser().subscribe();
  }
}
