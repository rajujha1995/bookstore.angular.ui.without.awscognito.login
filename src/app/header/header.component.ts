import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Init } from "v8";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {
    alert("Test");
  }

  redirectToLogin() {
    // const url =
    //   'https://n01649102-authentication.auth.us-east-1.amazoncognito.com/login?client_id=24gpd336tlp3a2htsdvbgupd94&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2F127.0.0.1%3A8080%2Flogged_in.html';
    // window.location.href = url;
    alert();
  }
}
