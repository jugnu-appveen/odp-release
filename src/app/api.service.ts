import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

  }

  public get(baseUrl: string) {
    const self = this;
    const URL = 'api/' + baseUrl;
    return self.http.get(URL);
  }
}
