import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class t3FormFGService {

 
  fb: FormBuilder = new FormBuilder();

  // this is the form that the public would enter data into
  // simulating a form here
  form = this.generateForm(this.alpha())




  getT3FormFG() {
    return this.form; // lots of controls i.e. replicating pattern of live inputs to public
  }


  generateForm(data: any) {

    let form = this.fb.group({

      header: this.fb.group(data.header),

      details: this.fb.array([
/*
        this.fb.group({
          qty: 2,
          price: 10.99,
          // row-level calculated fields
          subTotal: 0,
          discount: 0,
          vat: 0,
          total: 0,
          string1: 'alpha',
          string2: 'beta',
          result: ''
        }),

        this.fb.group({
          qty: 5,
          price: 6.88,
          // row-level calculated fields
          subTotal: 0,
          discount: 0,
          vat: 0,
          total: 0,
          string1: 'alpha',
          string2: 'alpha',
          result: ''
        })
        */

      ])

    });


    const fDetails: any = form.get('details')

    for (const item of data.details) {

        let y = this.fb.group(item)

        fDetails.push(y)

    }
 
    console.log(form.getRawValue())

    this.form = form
 
    return form;
  }
 
  alpha() {
    return {
      "header": {
        "subTotal": 0,
        "vatTotal": 0,
        "discountTotal": 0,
        "discountTotalB": 0,
        "commissionTotal": 0,
        "grandTotal": 0,
        "total": 0,
        "vatRate": 0.2,
        "discountRate": 0.09,
        "commissionRate": 0.07
      },
      "details": [
        {
          "qty": 2,
          "price": 10.99,
          "subTotal": 0,
          "discount": 0,
          "vat": 0,
          "total": 0,
          "string1": "alpha",
          "string2": "beta",
          "result": ""
        },
        {
          "qty": 5,
          "price": 6.88,
          "subTotal": 0,
          "discount": 0,
          "vat": 0,
          "total": 0,
          "string1": "alpha",
          "string2": "alpha",
          "result": ""
        }
      ]
    }

  }

}