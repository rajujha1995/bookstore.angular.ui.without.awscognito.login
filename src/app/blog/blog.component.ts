import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Book } from '../../_models/book.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class BlogComponent {
  readonly apiUrl: string =
    'https://82b8crgwq6.execute-api.us-east-1.amazonaws.com/prod/api/books';
  http = inject(HttpClient);
  books$ = this.getBooks();

  private getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      tap((books) => {
        books.sort((a, b) => (a.id || 0) - (b.id || 0)); // Sort by 'id'
      })
    );
  }
}
