import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {

  containerList: Array<any>;
  expandContainerId: string;
  constructor(private apiService: ApiService) {
    const self = this;
    self.containerList = [];
  }

  ngOnInit() {
    const self = this;
    self.getContainers();
  }

  getContainers() {
    const self = this;
    self.apiService.get('container').subscribe((res: any) => {
      self.containerList = res;
    }, err => {

    });
  }

}
