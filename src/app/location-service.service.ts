import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationServiceService {
  constructor(private http: HttpClient) { }
  getLocationService(): Promise <any>{
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({lat_val: resp.coords.latitude, lon_val: resp.coords.longitude});
      });
    });
  }
}
