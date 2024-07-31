import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  readonly apiUrl: string =
    "https://qzuu1aif99.execute-api.us-east-1.amazonaws.com/dev";

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  notificationMessage: string = "";
  notificationClass: string = "";
  currentTab: "login" | "register" = "login";

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group(
      {
        name: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatcher }
    );
  }

  passwordMatcher(group: FormGroup) {
    const password = group.get("password")?.value;
    const confirmPassword = group.get("confirmPassword")?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      const payload = {
        name: this.registerForm.get("name")?.value,
        username: this.registerForm.get("email")?.value,
        password: this.registerForm.get("password")?.value,
      };
      this.http.post(`${this.apiUrl}/register`, payload).subscribe({
        next: () => {
          this.registerForm.reset();
          this.notificationMessage = "Registration successful!";
          this.notificationClass = "alert-success";
        },
        error: (error) => {
          if (error.error.message === "User already exists") {
            this.notificationMessage =
              "User already exists. Please use a different email.";
            this.notificationClass = "alert-danger";
          } else {
            this.notificationMessage =
              "Something went wrong. Please try again.";
            this.notificationClass = "alert-danger";
          }
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      const payload = {
        username: this.loginForm.get("email")?.value,
        password: this.loginForm.get("password")?.value,
      };
      this.http.post(`${this.apiUrl}/login`, payload).subscribe({
        next: (response: any) => {
          localStorage.clear();

          localStorage.setItem("authToken", response.token);
          localStorage.setItem("username", response.user.username);

          this.loginForm.reset();
          this.notificationMessage = `Login successful. Welcome ${response.user.name} 😊 `;
          this.notificationClass = "alert-success";

          this.router.navigate(["/blog"]);
        },
        error: (error) => {
          this.notificationMessage = error.error.message;
          this.notificationClass = "alert-danger";
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  handleTabChange(tab: "login" | "register") {
    this.currentTab = tab;
    this.resetFormErrors();
  }

  resetFormErrors() {
    if (this.currentTab === "login") {
      this.loginForm.reset();
      this.loginForm.markAsUntouched();
    } else {
      this.registerForm.reset();
      this.registerForm.markAsUntouched();
    }
  }
}
