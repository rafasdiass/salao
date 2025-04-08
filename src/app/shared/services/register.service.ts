import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly firestore = getFirestore();
  private readonly usersCollection = 'users';

  /**
   * Salva os dados do usuário no Firestore.
   * @param userId UID do usuário.
   * @param userData Dados completos do usuário.
   * @returns true se os dados forem salvos com sucesso, false caso contrário.
   */
  async saveUserData(userId: string, userData: User): Promise<boolean> {
    try {
      const userDocRef = doc(this.firestore, this.usersCollection, userId);
      await setDoc(userDocRef, userData);
      console.log(
        `[RegisterService] User data for ${userId} saved successfully.`
      );
      return true;
    } catch (error) {
      console.error(
        `[RegisterService] Error saving user data for ${userId}:`,
        error
      );
      return false;
    }
  }
}
