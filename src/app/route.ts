import { Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";

export const routes: Routes = [
  {
    path: "home",
    loadComponent: () =>
      import("./home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "about",
    loadComponent: () =>
      import("./about/about.component").then((m) => m.AboutComponent),
  },
  {
    path: "blog",
    loadComponent: () =>
      import("./blog/blog.component").then((m) => m.BlogComponent),
  },
  {
    path: "contact",
    loadComponent: () =>
      import("./contact/contact.component").then((m) => m.ContactComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "adminhome",
    loadComponent: () =>
      import("./admin/adminhome.component").then((m) => m.AdminhomeComponent),
    canActivate: [AuthGuard],
  },
  { path: "", redirectTo: "/home", pathMatch: "full" },
];
