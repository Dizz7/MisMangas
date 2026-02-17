import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  return true; // permite siempre la navegación (sin validación de sesión)
};