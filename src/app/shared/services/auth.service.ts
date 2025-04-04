import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  updateProfile,
  Auth,
} from 'firebase/auth';
import { User } from '../models/models';
import { RegisterService } from './register.service';
import { UserService } from './user.service';
import { from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = getAuth();

  // Removemos a inicialização de propriedades que dependem do userService
  // e usamos getters para expor valores computados.
  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  constructor(
    private router: Router,
    private registerService: RegisterService,
    private userService: UserService
  ) {
    console.log('AuthService inicializado.');
    this.monitorAuthState();
  }

  /**
   * Monitora o estado de autenticação e atualiza o UserService.
   */
  private monitorAuthState(): void {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log('Usuário autenticado:', firebaseUser);
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          role: 'client', // Valor padrão; ajuste conforme necessário
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.userService.setUser(user);
      } else {
        console.log('Nenhum usuário autenticado.');
        this.userService.clearUser();
      }
    });
  }

  /**
   * Registra um novo usuário e salva os dados no Firestore.
   * @param email Email do usuário.
   * @param password Senha do usuário.
   * @param name Nome do usuário.
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<User | null> {
    console.log(`Registrando usuário com email: ${email}`);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      console.log('Usuário registrado no Firebase Auth:', firebaseUser);
      await updateProfile(firebaseUser, { displayName: name });
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: name,
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const success = await this.registerService.saveUserData(
        firebaseUser.uid,
        newUser
      );
      if (success) {
        await sendEmailVerification(firebaseUser);
        this.userService.setUser(newUser);
        return newUser;
      }
      return null;
    } catch (error) {
      console.error('Erro ao registrar o usuário:', error);
      return null;
    }
  }

  /**
   * Realiza login para um usuário existente.
   */
  async login(email: string, password: string): Promise<User | null> {
    console.log(`Iniciando login para o email: ${email}`);
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      console.log('Login bem-sucedido:', firebaseUser);
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.userService.setUser(user);
      return user;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return null;
    }
  }

  /**
   * Envia um e-mail para redefinição de senha.
   */
  async resetPassword(email: string): Promise<boolean> {
    console.log(`Enviando e-mail para redefinição de senha: ${email}`);
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('E-mail de redefinição enviado com sucesso.');
      return true;
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição:', error);
      return false;
    }
  }

  /**
   * Realiza logout do usuário atual.
   */
  async logout(): Promise<void> {
    console.log('Realizando logout...');
    try {
      await signOut(this.auth);
      this.userService.clearUser();
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  }

  /**
   * Atualiza o perfil do usuário autenticado.
   */
  async updateUserProfile(name: string): Promise<boolean> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName: name });
        const updatedUser: User = {
          id: currentUser.uid,
          email: currentUser.email || '',
          name: name,
          role: 'client',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.userService.setUser(updatedUser);
        console.log('Perfil do usuário atualizado com sucesso.');
        return true;
      } catch (error) {
        console.error('Erro ao atualizar o perfil do usuário:', error);
        return false;
      }
    } else {
      console.warn('Nenhum usuário autenticado para atualizar o perfil.');
      return false;
    }
  }
}
