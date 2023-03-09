import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { SquareComponent } from './../components/square/square.component';
import { PawnPromotionDialogComponent } from './../components/pawn-promotion-dialog/pawn-promotion-dialog.component';
import { CheckmateDialog } from 'src/components/checkmate-dialog/checkmate-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SquareComponent,
    CheckmateDialog,
    PawnPromotionDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
