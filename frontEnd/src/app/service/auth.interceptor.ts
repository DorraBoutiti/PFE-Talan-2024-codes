import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); /* ?? '' */
  const router = new Router();

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error", error);
        console.log("status : ", error.status);
        
        if (error.status === 500 || error.status === 403) {
          router.navigateByUrl('/login');
          localStorage.removeItem('token');
        }
        return throwError(error);
      })
    );
  } else {
    return next(req);
  }

  /*req = req.clone({
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });
  return next(req);*/
};



