import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocationServiceService} from './location-service.service';
import * as moment from 'moment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'weather-app';
  panelOpenState = false;
  weatherData: any;
  private CurrentLat: any;
  private CurrentLon: any;
  weatherDetail: any = [];
  firstDayWeather: any = [];
  secondDayWeather: any = [];
  thirdDayWeather: any = [];
  fourthDayWeather: any = [];
  fifthDayWeather: any = [];
  weatherPerDay: any = [];
  day1 = moment();
  day2 = moment().add(1, 'days');
  day3 = moment().add(2, 'days');
  day4 = moment().add(3, 'days');
  day5 = moment().add(4, 'days');

  constructor(private http: HttpClient, private userLoc: LocationServiceService) {
  }

  ngOnInit(): void {
    this.getLocation();
  }

  // tslint:disable-next-line:typedef
  getLocation() {
    this.userLoc.getLocationService().then(resp => {
      this.CurrentLat = resp.lat_val;
      this.CurrentLon = resp.lon_val;
      this.getWeatherInfo();

    });
  }

  // tslint:disable-next-line:typedef
  getWeatherInfo() {
    // this.setWeatherInfo(data);
    this.http
      .get<any>(`http://api.openweathermap.org/data/2.5/forecast?lat=${this.CurrentLat}&lon=${this.CurrentLon}&appid=5efd3d4f51e332e7f8269e8990faf8fd`)
      .subscribe({
        next: data => {
          this.setWeatherData(data);
        },
        error: error => {
          console.error('There was an error!', error);
        }
      });
  }

  // tslint:disable-next-line:typedef
  private setWeatherData(data: any) {
    this.weatherData = data;

    const sunRise = new Date(this.weatherData.city.sunrise * 1000);
    this.weatherData.sun_rise = sunRise.toLocaleTimeString();
    const sunSet = new Date(this.weatherData.city.sunset * 1000);
    this.weatherData.sun_set = sunSet.toLocaleTimeString();

    const unix = moment.utc().unix();

    this.firstDayWeather = this.weatherData.list.filter((d1: any) => d1.dt_txt.includes(this.day1.format('YYYY-MM-DD')));
    for (const [index, item] of this.firstDayWeather.entries()) {
      if (unix - item.dt > 0) {
        this.weatherDetail.push(item);
        break;
      }
      if (index === this.firstDayWeather.length - 1) {
        this.weatherDetail.push(this.firstDayWeather[this.firstDayWeather.length - 1]);
      }
    }


    this.secondDayWeather = this.weatherData.list.filter((d2: any) => d2.dt_txt.includes(this.day2.format('YYYY-MM-DD')));
    this.weatherDetail.push(this.secondDayWeather[0]);

    this.thirdDayWeather = this.weatherData.list.filter((d3: any) => d3.dt_txt.includes(this.day3.format('YYYY-MM-DD')));
    this.weatherDetail.push(this.thirdDayWeather[0]);

    this.fourthDayWeather = this.weatherData.list.filter((d4: any) => d4.dt_txt.includes(this.day4.format('YYYY-MM-DD')));
    this.weatherDetail.push(this.fourthDayWeather[0]);

    this.fifthDayWeather = this.weatherData.list.filter((d5: any) => d5.dt_txt.includes(this.day5.format('YYYY-MM-DD')));
    this.weatherDetail.push(this.fifthDayWeather[0]);
  }

  convertTocelcius(value: number): string {
    return (value - 273.15).toFixed(0);
  }

  convertToKM(value: number): number {
    return (value / 100);
  }

  receiveWeather(values: any, index: number): void {
    this.weatherPerDay = [];
    const date = moment(values.dt_txt).format('YYYY-MM-DD');
    this.weatherPerDay = this.weatherData.list.filter((d: any) => d.dt_txt.includes(date));
  }
}
