import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Representa uma foto retornada pela API do Google Places.
 */
export interface GooglePlacePhoto {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

/**
 * Representa os dados de um estabelecimento retornado pela API do Google Places.
 */
export interface GooglePlaceResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  icon: string;
  id: string;
  name: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: GooglePlacePhoto[];
  place_id: string;
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
  rating?: number;
  reference: string;
  scope: string;
  types: string[];
  vicinity: string;
}

/**
 * Representa a resposta da busca de estabelecimentos da API do Google Places.
 */
export interface GooglePlacesResponse {
  html_attributions: string[];
  next_page_token?: string;
  results: GooglePlaceResult[];
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class GooglePlacesService {
  private readonly apiKey: string = 'AIzaSyDoXMqCvfHsT4A6kXZybvSFvq8kjBIOhQg';
  private readonly baseUrl: string =
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  constructor(private http: HttpClient) {}

  /**
   * Realiza a busca de estabelecimentos próximos com base na localização e nos parâmetros fornecidos.
   *
   * @param lat Latitude da localização do usuário.
   * @param lng Longitude da localização do usuário.
   * @param radius Raio de busca em metros (padrão: 5000).
   * @param type Tipo de estabelecimento (padrão: 'hair_salon').
   * @returns Observable com a resposta tipada da API do Google Places.
   */
  public searchPlaces(
    lat: number,
    lng: number,
    radius: number = 5000,
    type: string = 'hair_salon'
  ): Observable<GooglePlacesResponse> {
    const params = new HttpParams()
      .set('location', `${lat},${lng}`)
      .set('radius', radius.toString())
      .set('type', type)
      .set('key', this.apiKey);

    return this.http.get<GooglePlacesResponse>(this.baseUrl, { params });
  }
}
