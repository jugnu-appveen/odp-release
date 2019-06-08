import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.scss']
})
export class ReposComponent implements OnInit {

  @ViewChild('deleteRepoEle') deleteRepoEle: TemplateRef<HTMLElement>;
  @ViewChild('newImageEle') newImageEle: TemplateRef<HTMLElement>;
  selectedFileName: string;
  selectedFile: any;
  repos: Array<any>;
  data: any;
  selectedRepo: any;
  imageBuildData: any;
  branchList: Array<string>;
  private deleteRepoEleRef: NgbModalRef;
  private newImageEleRef: NgbModalRef;
  constructor(private apiService: ApiService,
    private ts: ToastrService,
    private modalService: NgbModal) {
    const self = this;
    self.repos = [];
    self.data = {};
    self.imageBuildData = {};
    self.branchList = [];
  }

  ngOnInit() {
    const self = this;
    self.getRepos();
  }

  getRepos() {
    const self = this;
    self.apiService.get('repos').subscribe((res: any) => {
      self.repos = res;
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to fetch Repos';
      self.ts.error(message, 'Error');
    });
  }

  getBranchList(repo: string) {
    const self = this;
    self.imageBuildData.repo = repo;
    self.apiService.get('repos/branch?id=' + repo).subscribe((res: any) => {
      self.branchList = res;
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to fetch Branch List';
      self.ts.error(message, 'Error');
    });
  }

  onUrlChange(url: string) {
    const self = this;
    if (url && url.trim()) {
      const seg = url.split('/');
      self.data.name = seg[seg.length - 1].replace('.git', '');
    }
  }

  saveRepo() {
    const self = this;
    self.apiService.post('repos', self.data).subscribe((res: any) => {
      self.data = {};
      self.getRepos();
      self.ts.success('Repo saved successfully', 'Success');
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to save Repo';
      self.ts.error(message, 'Error');
    });
  }

  deleteRepo(repo: any) {
    const self = this;
    self.selectedRepo = repo;
    self.deleteRepoEleRef = self.modalService.open(self.deleteRepoEle, { centered: true });
    self.deleteRepoEleRef.result.then(close => {
      self.selectedRepo = null;
    }, dismiss => {
      self.selectedRepo = null;
    });
  }

  triggerDelete(id: string) {
    const self = this;
    self.apiService.delete('repos?id=' + self.selectedRepo._id).subscribe((res: any) => {
      self.data = {};
      self.getRepos();
      self.deleteRepoEleRef.close(true);
      self.ts.success('Repo deleted successfully', 'Success');
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to delete Repo';
      self.ts.error(message, 'Error');
    });
  }

  newImage() {
    const self = this;
    self.newImageEleRef = self.modalService.open(self.newImageEle, { centered: true });
    self.newImageEleRef.result.then(close => {
      self.imageBuildData = {};
    }, dismiss => {
      self.imageBuildData = {};
    });
  }

  triggerNewImage() {
    const self = this;
    self.apiService.put('image/build', self.imageBuildData).subscribe(res => {
      self.newImageEleRef.close(true);
      self.ts.info('Image build request sent', 'Processing');
    }, err => {
      const message = err.error && err.error.message ? err.error.message : 'Unable to build new image';
      self.ts.error(message, 'Error');
    });
  }
}
