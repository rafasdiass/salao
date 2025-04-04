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
import { User, ClientUser, Address } from '../models/models';
import { RegisterService } from './register.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = getAuth();

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

  private getDefaultAddress(): Address {
    return {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil',
    };
  }

  /**
   * Monitora o estado de autenticação e atualiza o UserService.
   */
  private monitorAuthState(): void {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log('Usuário autenticado:', firebaseUser);
        const user: ClientUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          role: 'client',
          createdAt: new Date(),
          updatedAt: new Date(),
          address: this.getDefaultAddress(),
        };
        this.userService.setUser(user);
      } else {
        console.log('Nenhum usuário autenticado.');
        this.userService.clearUser();
      }
    });
  }

  /**
   * Registra um novo usuário cliente e salva os dados no Firestore.
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<ClientUser | null> {
    console.log(`Registrando cliente com email: ${email}`);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, { displayName: name });

      const newUser: ClientUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name,
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
        address: this.getDefaultAddress(),
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
      console.error('Erro ao registrar cliente:', error);
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

      const user: ClientUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
        address: this.getDefaultAddress(),
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
   * Atualiza o nome do perfil do usuário autenticado.
   */
  async updateUserProfile(name: string): Promise<boolean> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return false;

    try {
      await updateProfile(currentUser, { displayName: name });

      const updatedUser: ClientUser = {
        id: currentUser.uid,
        email: currentUser.email || '',
        name,
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
        address: this.getDefaultAddress(),
      };

      this.userService.setUser(updatedUser);
      console.log('Perfil atualizado com sucesso.');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }
  }
}
