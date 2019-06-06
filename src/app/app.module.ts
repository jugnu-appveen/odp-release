import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImagesComponent } from './dashboard/images/images.component';
import { ContainersComponent } from './dashboard/containers/containers.component';
import { ApiService } from './api.service';
import { SizePipe } from './pipes/size.pipe';
import { ToCharsPipe } from './pipes/to-chars.pipe';
import { ImageNamePipe } from './pipes/image-name.pipe';
import { from } from 'rxjs';
import { ReleaseComponent } from './dashboard/release/release.component';
import { HotfixComponent } from './dashboard/hotfix/hotfix.component';
import { ReposComponent } from './dashboard/repos/repos.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ImagesComponent,
    ContainersComponent,
    SizePipe,
    ToCharsPipe,
    ImageNamePipe,
    ReleaseComponent,
    HotfixComponent,
    ReposComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [ApiService, SizePipe, ToCharsPipe, ImageNamePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
