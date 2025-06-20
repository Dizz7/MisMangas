// src/app/guards/auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('session') === 'active';

  if (!isLoggedIn) {
    router.navigate(['/login']); // redirige al login si no está logueado
    return false;
  }

  return true; // permite la navegación
};