import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  data: any;
  constructor(private apiService: ApiService,
    private ts: ToastrService) {
    const self = this;
    self.data = {};
  }

  ngOnInit() {
    const self = this;
    self.getConfig();
  }

  getConfig() {
    const self = this;
    self.apiService.get('config/accessToken').subscribe(res => {
      self.data = res;
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to fetch Config';
      self.ts.error(message, 'Error');
    });
  }

  saveConfig() {
    const self = this;
    self.apiService.post('config/accessToken', self.data).subscribe(res => {
      self.ts.success('Details saved successfully', 'Success');
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to save Config';
      self.ts.error(message, 'Error');
    });
  }

}
