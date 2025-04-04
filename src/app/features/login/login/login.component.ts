import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;
  returnUrl: string = '/';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    }) as FormGroup<{
      email: FormControl<string>;
      password: FormControl<string>;
    }>;

    // Garante que returnUrl seja sempre uma string usando o operador de coalescência nula
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/';
  }

  get email(): FormControl<string> {
    return this.loginForm.get('email') as FormControl<string>;
  }

  get password(): FormControl<string> {
    return this.loginForm.get('password') as FormControl<string>;
  }

  async login(): Promise<void> {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.loginForm.valid) {
      this.errorMessage = 'Preencha todos os campos corretamente.';
      return;
    }

    // Desestruturação com fallback para garantir que email e password sejam strings
    const { email = '', password = '' } = this.loginForm.value;

    try {
      console.log('Iniciando login com:', { email, password });
      const user = await this.authService.login(email, password);
      if (user) {
        console.log('Login bem-sucedido:', user);
        // Redireciona conforme o papel do usuário
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user.role === 'employee') {
          this.router.navigate(['/employee']);
        } else if (user.role === 'client') {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Papel de usuário desconhecido.';
        }
      } else {
        this.errorMessage = 'E-mail ou senha inválidos.';
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      this.errorMessage = 'Erro ao realizar login. Tente novamente.';
    }
  }

  async forgotPassword(): Promise<void> {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.email.valid) {
      this.errorMessage = 'Insira um e-mail válido para recuperar a senha.';
      return;
    }
    try {
      const success = await this.authService.resetPassword(this.email.value);
      if (success) {
        this.successMessage =
          'E-mail de recuperação enviado. Verifique sua caixa de entrada.';
      } else {
        this.errorMessage = 'Erro ao enviar o e-mail de recuperação.';
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação:', error);
      this.errorMessage = 'Erro ao enviar o e-mail de recuperação.';
    }
  }

  goToRegister(): void {
    this.router.navigate(['/create-user']);
  }
}
