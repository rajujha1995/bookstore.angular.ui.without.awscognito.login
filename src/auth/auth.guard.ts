import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { switchMap, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  readonly verifyUrl: string =
    "https://qzuu1aif99.execute-api.us-east-1.amazonaws.com/dev/verify"; // Update this with your actual verify URL

  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      this.router.navigate(["/login"]);
      return of(false);
    }

    // Check if the user is admin
    if (username !== "admin@bookstore.com") {
      this.router.navigate(["/home"]); // Redirect to home if not admin
      return of(false);
    }

    // Verify the token
    return this.http
      .post<{ verified: boolean }>(this.verifyUrl, { token })
      .pipe(
        switchMap((response) => {
          if (response.verified) {
            return of(true);
          } else {
            this.router.navigate(["/login"]); // Redirect to login if token is not verified
            return of(false);
          }
        }),
        catchError(() => {
          this.router.navigate(["/login"]); // Redirect to login on error
          return of(false);
        })
      );
  }
}
