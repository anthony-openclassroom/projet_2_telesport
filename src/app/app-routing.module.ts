import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryComponent } from './pages/country/country.component';
import { APP_ROUTES } from './app-routes';

const routes: Routes = [
  {
    path: APP_ROUTES.HOME,
    component: HomeComponent,
  },
  {
    path: `${APP_ROUTES.COUNTRY}/:id`,
    component: CountryComponent,
  },
  {
    path: APP_ROUTES.NOT_FOUND,
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: APP_ROUTES.NOT_FOUND,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
