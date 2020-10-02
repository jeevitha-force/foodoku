import { Injectable } from "@angular/core";
import { HttpClient, HttpRequest, HttpResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { AppSettings } from "../../app/app.settings";
import { map } from "rxjs/operators";

import { User } from "../_models";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(AppSettings.API_ENDPOINT + `/authenticate`, {
        email: email,
        password: password
      })
      .pipe(
        map(user => {
          // login successful if there's a user obj in the response
          if (user) {
            // store user details in local storage to keep user logged in between page refreshes
            user.token = 'jwt-token'
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
