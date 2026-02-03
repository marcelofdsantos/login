import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Services
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/api.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  carregando = false;

  // Inputs
  @ViewChild('reInput') reInput!: ElementRef<HTMLInputElement>;
  @ViewChild('senhaInput') senhaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('btnEntrar') btnEntrar!: ElementRef<HTMLButtonElement>;

  // 🎥 VÍDEO
  @ViewChild('logoVideo') logoVideo!: ElementRef<HTMLVideoElement>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      re: ['', [Validators.required]],
      senha: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Se já estiver logado, redireciona
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checklist']);
    }
  }

  // 🎥 AUTOPLAY + TOCAR A CADA 7s
  ngAfterViewInit(): void {
    const video = this.logoVideo?.nativeElement;
    if (!video) return;

    video.muted = true;
    video.currentTime = 0;

    // toca ao entrar
    setTimeout(() => {
      video.play().catch((err) => {
        console.warn('Autoplay bloqueado:', err);
      });
    }, 300);

    // toca de 7 em 7 segundos
    setInterval(() => {
      video.currentTime = 0;
      video.play();
    }, 7000);

    // Foco inicial no campo RE
    setTimeout(() => {
      this.reInput?.nativeElement.focus();
    }, 500);
  }

  irParaSenha(): void {
    if (this.loginForm.get('re')?.valid) {
      this.senhaInput.nativeElement.focus();
    }
  }

  irParaEntrar(): void {
    if (this.loginForm.valid) {
      this.btnEntrar.nativeElement.focus();
      this.submit();
    }
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.snackBar.open('⚠️ Preencha todos os campos', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.carregando = true;

    const loginRequest: LoginRequest = {
      re: this.loginForm.value.re,
      senha: this.loginForm.value.senha
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.carregando = false;
        this.snackBar.open(`✅ Bem-vindo, ${response.nomeCompleto}!`, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/checklist']);
      },
      error: (error) => {
        this.carregando = false;
        const mensagem = error.error?.message || 'Erro ao fazer login. Verifique suas credenciais.';
        this.snackBar.open(`❌ ${mensagem}`, 'Fechar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
}
