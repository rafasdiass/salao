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
   * @param userData Dados do usuário conforme o novo modelo.
   */
  async saveUserData(userId: string, userData: User): Promise<boolean> {
    try {
      const userDocRef = doc(this.firestore, this.usersCollection, userId);
      await setDoc(userDocRef, userData);
      console.log('Dados do usuário salvos com sucesso no Firestore.');
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados no Firestore:', error);
      return false;
    }
  }
}
