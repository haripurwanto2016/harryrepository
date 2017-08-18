import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  newUser: any = {};
  billing_shipping_same: boolean;
  WooCommerce: any
  products: any[];


  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController) {

    this.newUser.billing_address = {};
    this.newUser.shipping_address = {};
    this.billing_shipping_same = false;

    this.WooCommerce = WC({
      url: "http://localhost/wordpress/",
      consumerKey: "ck_b265e4f2e144757a361b0ce7fc0017e9e7e29b9c",
      consumerSecret: "cs_cdbde1b9c578a4cd8d9287b826b67ccdaf2b04c9"
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;
  }

  checkEmail() {
    let validEmail = false;
    let reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (reg.test(this.newUser.email)) {

      this.WooCommerce.getAsync('customers/email/' + this.newUser.email).then((data) => {
        let res = (JSON.parse(data.body));
        if (res.errors) {
          validEmail = true;

          this.toastCtrl.create({
            message: "Congrats. Email is good, please continue",
            duration: 5000
          }).present();

        } else {
          validEmail = false;

          this.toastCtrl.create({
            message: "Email is already registered",
            showCloseButton: true
          }).present();


        }
        console.log(validEmail);
      })


    } else {
      validEmail = false;

      this.toastCtrl.create({
        message: "Invalid Email",
        showCloseButton: true
      }).present();
      console.log(validEmail);
    }


  }

  signup() {
    let customerData = {
      customer: {}
    }
    customerData.customer = {
      "email": this.newUser.email,
      "first_name": this.newUser.first_name,
      "last_name": this.newUser.last_name,
      "username": this.newUser.username,
      "password": this.newUser.password,
      "billing_address": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": "",
        "address_1": this.newUser.billing_address.address_1,
        "address_2": this.newUser.billing_address.address_2,
        "city": this.newUser.billing_address.city,
        "state": this.newUser.billing_address.state,
        "postcode": this.newUser.billing_address.postcode,
        "country": this.newUser.billing_address.country,
        "email": this.newUser.email,
        "phone": this.newUser.billing_address.phone
      },
      "shipping_address": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": "",
        "address_1": this.newUser.shipping_address.address_1,
        "address_2": this.newUser.shipping_address.address_2,
        "city": this.newUser.shipping_address.city,
        "state": this.newUser.shipping_address.state,
        "postcode": this.newUser.shipping_address.postcode,
        "country": this.newUser.shipping_address.country,
      }
    }
    if (this.billing_shipping_same) {
      this.newUser.shipping_address = this.newUser.shipping_address;

    }

    this.WooCommerce.getAsync('customers' + customerData).then((data) => {
      let response = (JSON.parse(data.body));
      if (response.customer){
        this.alertCtrl.create({
          title: "Account Created",
          message: "Your account has been created succesfully",
          buttons: [{
            text: "Login",
            handler: ()=> {
              //to do
            }
          }]
        }).present();
      } else if (response.errors){
        this.toastCtrl.create({
          message: response.errors[0].message,
          showCloseButton: true
        }).present();
      }
    })
  }
}
