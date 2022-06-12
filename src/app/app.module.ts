import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { GraphViewerComponent } from './components/graph-viewer/graph-viewer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LyThemeModule, LY_THEME, LY_THEME_NAME, StyleRenderer, LyTheme2 } from '@alyle/ui';
import { MinimaLight } from '@alyle/ui/themes/minima';
import { CommonModule } from '@angular/common';
import { LyButtonModule } from '@alyle/ui/button';
import { LyFieldModule } from '@alyle/ui/field';
import { LyGridModule } from '@alyle/ui/grid';
import { LyIconModule } from '@alyle/ui/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormRouteComponent } from './components/form-route/form-route.component';
import { LyCheckboxModule } from '@alyle/ui/checkbox';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LySelectModule } from '@alyle/ui/select';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GraphViewerComponent,
    FormRouteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HammerModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    LyFieldModule,
    LyGridModule,
    LyButtonModule,
    LyIconModule,
    LyCheckboxModule,
    LyToolbarModule,
    LyTypographyModule,
    LySelectModule,
  ],
  providers: [StyleRenderer, LyTheme2, { provide: LY_THEME_NAME, useValue: 'minima-light' }, { provide: LY_THEME, useClass: MinimaLight, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
