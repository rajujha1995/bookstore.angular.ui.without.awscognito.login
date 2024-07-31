import { CommonModule } from "@angular/common";
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from "@angular/common/http";
import { Component, inject, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { catchError, Observable, of, switchMap, tap } from "rxjs";
import { Book } from "../../_models/book.model";
import { ReactiveFormsModule } from "@angular/forms";

interface ValidationResponse {
  verified: boolean;
  message: string;
  error?: {
    name: string;
    message: string;
    expiredAt?: string;
  };
}

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrl: "./blog.component.css",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class BlogComponent implements OnInit {
  readonly apiUrl: string =
    "https://82b8crgwq6.execute-api.us-east-1.amazonaws.com/prod/api/books";
  readonly validationUrl: string =
    "https://qzuu1aif99.execute-api.us-east-1.amazonaws.com/dev/verify";

  http = inject(HttpClient);
  books$: Observable<Book[]> | null = null;
  errorMessage: string | null = null;
  ngOnInit() {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    if (token && username) {
      this.validateToken(username, token)
        .pipe(
          switchMap((isValid) => {
            if (isValid) {
              return this.getBooks();
            } else {
              this.errorMessage = "You need to login to access this content.";
              return of(null);
            }
          }),
          catchError((error) => {
            this.errorMessage = "An error occurred. Please try again later.";
            return of(null);
          })
        )
        .subscribe((books) => {
          this.books$ = books ? of(books) : null;
        });
    } else {
      this.errorMessage = "You need to login to access this content.";
    }
  }

  private validateToken(username: string, token: string): Observable<boolean> {
    const payload = { username, token };

    return this.http.post<ValidationResponse>(this.validationUrl, payload).pipe(
      tap((response) => {
        if (!response.verified) {
          if (response.error?.name === "TokenExpiredError") {
            this.errorMessage = "Your session has expired. Please login again.";
          } else {
            this.errorMessage = "Invalid token. Please login again.";
          }
        }
      }),
      catchError((error) => {
        this.errorMessage = "Token validation failed. Please login again.";
        return of({ verified: false });
      }),
      switchMap((response) => of(response.verified))
    );
  }

  private getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      tap((books) => {
        books.sort((a, b) => (a.id || 0) - (b.id || 0)); // Sort by 'id'
      })
    );
  }
}
