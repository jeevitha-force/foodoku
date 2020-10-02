import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';

// used to create backend
import { backendProvider } from './_helpers';

import { AppRoutingModule } from './app.routing';
import { JwtInterceptor } from './_helpers';
import { ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { DonateComponent } from './_components/donate';
import { HomeComponent } from './_components/home';
import { LoginComponent } from './_components/login';
import { RegisterComponent } from './_components/register';
import { AlertComponent } from './_components/alert';

import { FoodComponent } from './_components/food';
import { FoodListComponent } from './_components/food-list';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgxPaginationModule,
        DataTablesModule
    ],
    declarations: [
        AppComponent,
        DonateComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent,
        FoodListComponent,
        FoodComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create backend
        backendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };