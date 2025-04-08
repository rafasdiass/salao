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
  User as FirebaseUser,
} from 'firebase/auth';
import { User, ClientUser, Address, AdminUser } from '../models/models';
import { RegisterService } from './register.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = getAuth();

  // O sinal isLoggedIn é invocado como função para obter o valor booleano.
  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  constructor(
    private router: Router,
    private registerService: RegisterService,
    private userService: UserService
  ) {
    console.log('[AuthService] Initialized.');
    this.subscribeToAuthState();
  }

  // Retorna um endereço padrão.
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

  // Converte um FirebaseUser para um objeto ClientUser do domínio.
  private buildClientUser(
    firebaseUser: FirebaseUser,
    overrideName?: string
  ): ClientUser {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      name: overrideName || firebaseUser.displayName || '',
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
      address: this.getDefaultAddress(),
    };
  }

  // Monitora mudanças no estado de autenticação e atualiza o UserService.
  private subscribeToAuthState(): void {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log('[AuthService] Authenticated user:', firebaseUser.uid);
        const userData = this.buildClientUser(firebaseUser);
        this.userService.setUser(userData);
      } else {
        console.log('[AuthService] No authenticated user.');
        this.userService.clearUser();
      }
    });
  }

  // Registra um novo usuário e persiste seus dados usando o RegisterService.
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<ClientUser | null> {
    try {
      console.log(`[AuthService] Registering user with email: ${email}`);
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      if (!firebaseUser.email) {
        throw new Error('[AuthService] Firebase user email missing.');
      }

      await updateProfile(firebaseUser, { displayName: name });
      const newUser = this.buildClientUser(firebaseUser, name);

      const saved = await this.registerService.saveUserData(
        firebaseUser.uid,
        newUser
      );
      if (!saved) {
        throw new Error('[AuthService] Failed to save user data.');
      }

      await sendEmailVerification(firebaseUser);
      this.userService.setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('[AuthService] Error registering client:', error);
      return null;
    }
  }

  // Realiza o login e atualiza o estado do usuário.
  async login(email: string, password: string): Promise<User | null> {
    try {
      console.log(`[AuthService] Logging in user with email: ${email}`);
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      if (!firebaseUser.email) {
        throw new Error('[AuthService] Firebase user email missing.');
      }

      const userData = this.buildClientUser(firebaseUser);
      this.userService.setUser(userData);
      return userData;
    } catch (error) {
      console.error('[AuthService] Error logging in:', error);
      return null;
    }
  }

  // Envia um e-mail para redefinição de senha.
  async resetPassword(email: string): Promise<boolean> {
    try {
      console.log(`[AuthService] Sending password reset email to: ${email}`);
      await sendPasswordResetEmail(this.auth, email);
      console.log('[AuthService] Password reset email sent.');
      return true;
    } catch (error) {
      console.error('[AuthService] Error sending password reset email:', error);
      return false;
    }
  }

  // Realiza logout e limpa o estado do usuário.
  async logout(): Promise<void> {
    try {
      console.log('[AuthService] Logging out...');
      await signOut(this.auth);
      this.userService.clearUser();
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('[AuthService] Error logging out:', error);
    }
  }

  // Atualiza o perfil do usuário autenticado.
  async updateUserProfile(name: string): Promise<boolean> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      console.error('[AuthService] No current user found for profile update.');
      return false;
    }
    try {
      await updateProfile(currentUser, { displayName: name });
      const updatedUser = this.buildClientUser(currentUser, name);
      this.userService.setUser(updatedUser);
      console.log('[AuthService] Profile updated successfully.');
      return true;
    } catch (error) {
      console.error('[AuthService] Error updating profile:', error);
      return false;
    }
  }

  // Novo método: retorna o companyId do usuário autenticado se existir.
  getCompanyId(): string | null {
    const user = this.userService.getUser();
    // Se o usuário for do tipo AdminUser, espera-se que a propriedade companyId esteja definida.
    if (user && 'companyId' in user && (user as AdminUser).companyId) {
      return (user as AdminUser).companyId;
    }
    return null;
  }
}
