import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import {ProductDetailsPage} from '../product-details/product-details';

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})

export class ProductsByCategoryPage {
  WooCommerce: any;
  products: any[];
  page: number;
  category: any;

constructor(public navCtrl: NavController, public navParams: NavParams) {
  this.page = 1 ;
  this.category = this.navParams.get("category");

this.WooCommerce = WC ({
  url: "http://localhost/wordpress/",
  consumerKey:  "ck_b265e4f2e144757a361b0ce7fc0017e9e7e29b9c",
  consumerSecret: "cs_cdbde1b9c578a4cd8d9287b826b67ccdaf2b04c9"
});

  this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then((data)=> {
  console.log(JSON.parse (data.body));
  this.products = JSON.parse (data.body).products;
  }, (err)=> {
  console.log(err)
  })
  }

  ionViewDidLoad() {
  console.log('ionViewDidLoad ProductsByCategoryPage');
  }

loadMoreProducts(event){
  this.page++;
  console.log("Getting page" + this.page);
  this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + this.page).then((data)=> {
  let temp: any[] = JSON.parse(data.body).products;
   
  this.products = this.products.concat(JSON.parse (data.body).products)
  console.log(this.products);
  event.complete();
  if (temp.length < 10)
  event.enable(false);
  })
  }
openProductPage(product){
  this.navCtrl.push(ProductDetailsPage, {"product": product});
  } 
}
