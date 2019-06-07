import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

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
import { KeysComponent } from './dashboard/keys/keys.component';
import { ConfigComponent } from './dashboard/config/config.component';

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
    ReposComponent,
    KeysComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  providers: [ApiService, SizePipe, ToCharsPipe, ImageNamePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
