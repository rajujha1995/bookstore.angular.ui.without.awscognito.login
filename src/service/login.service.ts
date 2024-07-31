import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "https://your-api-url.com"; // Replace with your API URL
  private redirectUrl: string = "/home"; // Default redirect URL

  isLoggedIn$ = new BehaviorSubject<boolean>(this.checkToken());

  constructor(private http: HttpClient, private router: Router) {}

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  handleLogin(response: any) {
    localStorage.clear();
    localStorage.setItem("authToken", response.token);
    localStorage.setItem("username", response.user.username);

    this.isLoggedIn$.next(true);
    this.router.navigate([this.redirectUrl]);
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn$.next(false);
    this.router.navigate(["/login"]);
  }

  checkToken(): boolean {
    return !!localStorage.getItem("authToken");
  }
}
