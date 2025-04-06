import {
  Injectable,
  inject,
  signal,
  computed,
  runInInjectionContext,
  EnvironmentInjector,
} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { EmployeeUser } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProfessionalService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);
  private readonly injector = inject(EnvironmentInjector);
  private readonly path = 'users';

  private readonly _professionals = signal<EmployeeUser[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly professionals = computed(() => this._professionals());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());

  /** Carrega todos os profissionais (usuários com role: 'employee') */
  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      await runInInjectionContext(this.injector, async () => {
        const refCollection = collection(this.firestore, this.path);
        const q = query(refCollection, where('role', '==', 'employee'));
        const data = await collectionData(q, { idField: 'id' }).toPromise();
        this._professionals.set(data as EmployeeUser[]);
      });
    } catch (err) {
      console.error(
        '[ProfessionalService] Erro ao carregar profissionais:',
        err
      );
      this._error.set('Erro ao carregar profissionais');
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Realiza o upload da imagem de perfil para o Firebase Storage
   * @param file Arquivo de imagem (JPEG, PNG, etc)
   * @returns URL pública da imagem
   */
  async uploadProfileImage(file: File): Promise<string> {
    const timestamp = Date.now();
    const filePath = `profile-images/${timestamp}-${file.name}`;
    const storageRef = ref(this.storage, filePath);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
  }

  /**
   * Cria um novo profissional no Firestore
   * @param professional Dados do profissional (sem ID)
   * @param imageFile (opcional) Arquivo de imagem de perfil
   */
  async create(
    professional: Omit<EmployeeUser, 'id'>,
    imageFile?: File | null
  ): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      let profileImageUrl = professional.profileImageUrl || '';

      if (imageFile) {
        profileImageUrl = await this.uploadProfileImage(imageFile);
      }

      const refCollection = collection(this.firestore, this.path);
      const docRef = await addDoc(refCollection, {
        ...professional,
        profileImageUrl,
        role: 'employee',
      });

      this._professionals.update((list) => [
        ...list,
        { ...professional, id: docRef.id, profileImageUrl, role: 'employee' },
      ]);
    } catch (err) {
      console.error('[ProfessionalService] Erro ao criar profissional:', err);
      this._error.set('Erro ao criar profissional');
    } finally {
      this._loading.set(false);
    }
  }

  /** Remove um profissional do Firestore e do estado local */
  async delete(id: string): Promise<void> {
    try {
      const refDoc = doc(this.firestore, `${this.path}/${id}`);
      await deleteDoc(refDoc);
      this._professionals.update((list) => list.filter((p) => p.id !== id));
    } catch (err) {
      console.error('[ProfessionalService] Erro ao excluir profissional:', err);
    }
  }

  /** Atualiza um profissional no Firestore e no estado local */
  async update(id: string, data: Partial<EmployeeUser>): Promise<void> {
    try {
      const refDoc = doc(this.firestore, `${this.path}/${id}`);
      await updateDoc(refDoc, data);
      this._professionals.update((list) =>
        list.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
    } catch (err) {
      console.error(
        '[ProfessionalService] Erro ao atualizar profissional:',
        err
      );
    }
  }

  /** Busca um profissional pelo ID */
  getById(id: string): EmployeeUser | undefined {
    return this._professionals().find((p) => p.id === id);
  }
}
