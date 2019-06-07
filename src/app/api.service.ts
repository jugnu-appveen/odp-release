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

  public put(baseUrl: string, data: any) {
    const self = this;
    const URL = 'api/' + baseUrl;
    return self.http.put(URL, data);
  }

  public post(baseUrl: string, data: any) {
    const self = this;
    const URL = 'api/' + baseUrl;
    return self.http.post(URL, data);
  }

  public delete(baseUrl: string) {
    const self = this;
    const URL = 'api/' + baseUrl;
    return self.http.delete(URL);
  }

  public upload(baseUrl: string, data: FormData) {
    const self = this;
    const URL = 'api/' + baseUrl;
    return self.http.post(URL, data);
  }
}
