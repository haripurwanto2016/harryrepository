import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';

import * as WC from 'woocommerce-api';
import {ProductsByCategoryPage} from '../products-by-category/products-by-category'

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  homePage: Component;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCtrl: NavController;
  loggedIn: boolean;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController) {
    this.homePage = HomePage 
    this.categories =[];
    this.user = {};

    this.WooCommerce = WC ({
  url: "http://localhost/wordpress/",
  consumerKey:  "ck_b265e4f2e144757a361b0ce7fc0017e9e7e29b9c",
  consumerSecret: "cs_cdbde1b9c578a4cd8d9287b826b67ccdaf2b04c9"
});

this.WooCommerce.getAsync("products/categories").then((data) => {
  console.log(JSON.parse(data.body).product_categories);
  let temp: any[] = JSON.parse(data.body).product_categories;

 for (let i = 0; i< temp.length; i ++ ) {
   if (temp[i].parent == 0){
   if (temp[i].slug == "novel"){
      temp[i].icon = "book";
   }
   if (temp[i].slug == "baju"){
      temp[i].icon = "shirt";
   }
     this.categories.push(temp[i]);
   }
 }    
}, (err)=> {console.log(err)
})
}

  ionViewDidEnter() {
    this.storage.ready().then(()=> {
      this.storage.get("userLoginInfro").then((userloginInfo) => {
        if(userloginInfo != null){

          console.log("User logged in");
          this.user = userloginInfo.user;
          console.log(this.user);
        }
        else {
          console.log("No user found");
          this.user = {};
          this.loggedIn = false;
        }
      })
    })
  }

  openCategoryPage(category){

    this.childNavCtrl.setRoot(ProductsByCategoryPage,{"category": category});
  }
  openPage(pageName: string){
    if(pageName == "signup"){
      this.navCtrl.push(SignupPage);
    }
    if(pageName == "login"){
      this.navCtrl.push(LoginPage);
    }
    if(pageName == 'logout'){
      this.storage.remove("userLoginInfo").then(()=>{
        this.user = {};
        this.loggedIn = false;
      })
    }
    if(pageName == 'cart'){
        let modal = this.modalCtrl.create(CartPage);
        modal.present();    
  }
}
}