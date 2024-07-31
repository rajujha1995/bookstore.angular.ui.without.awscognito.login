import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  username: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
      });
  }

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem("authToken");
    this.isLoggedIn = !!token;
    this.username = localStorage.getItem("username");
  }

  logout(): void {
    localStorage.clear();
    this.cdr.detectChanges();
    this.isLoggedIn = false;
    this.username = null;
    this.router.navigate(["/login"]);
  }
}
