import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../model/product';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient: HttpClient, private oidcSecurityService: OidcSecurityService) {}

  // Method to get the Authorization header
  private getAuthHeader(): Observable<HttpHeaders> {
    return this.oidcSecurityService.getAccessToken().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return [headers];
      })
    );
  }

  // Fetch products with the authorization header
  getProducts(): Observable<Array<Product>> {
    return this.getAuthHeader().pipe(
      switchMap(headers => {
        return this.httpClient.get<Array<Product>>('http://localhost:9000/api/product', { headers });
      })
    );
  }

  // Create a product with the authorization header
  createProduct(product: Product): Observable<Product> {
    return this.getAuthHeader().pipe(
      switchMap(headers => {
        return this.httpClient.post<Product>('http://localhost:9000/api/product', product, { headers });
      })
    );
  }
}
