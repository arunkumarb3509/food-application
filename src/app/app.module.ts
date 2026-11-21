import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CategoryChipsComponent } from './shared/category-chips/category-chips.component';
import { RestaurantCardComponent } from './shared/restaurant-card/restaurant-card.component';
import { FoodCardComponent } from './shared/food-card/food-card.component';
import { RatingStarsComponent } from './shared/rating-stars/rating-stars.component';
import { FloatingCartComponent } from './shared/floating-cart/floating-cart.component';
import { TiltDirective } from './shared/tilt.directive';
import { HomeComponent } from './pages/home/home.component';
import { RestaurantListComponent } from './pages/restaurant-list/restaurant-list.component';
import { RestaurantDetailsComponent } from './pages/restaurant-details/restaurant-details.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    CategoryChipsComponent,
    RestaurantCardComponent,
    FoodCardComponent,
    RatingStarsComponent,
    FloatingCartComponent,
    TiltDirective,
    HomeComponent,
    RestaurantListComponent,
    RestaurantDetailsComponent,
    SearchResultsComponent,
    CartComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
