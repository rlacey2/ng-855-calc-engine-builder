import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class t3FormFGService {

  fb: FormBuilder = new FormBuilder();

  // this is the form that the public would enter data into
  // simulating a form here
  form = this.fb.group({

    header: this.fb.group({

      //  Core totals
      subTotal: 0,
      vatTotal: 0,
      discountTotal: 0,
      discountTotalB: 0,
      commissionTotal: 0,
      grandTotal: 0,
      total: 0,

      // Optional metadata / rates (used in rules)
      vatRate: 0.2,
      discountRate: 0.09,
      commissionRate: 0.07
    }),

    details: this.fb.array([

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

    ])

  });

  

    // 1. Initialize the form group to satisfy the TypeScript compiler
  t3dataform = new FormGroup({
    current: new FormControl('')
  });


   

  getT3FormFG() {
    return this.form; // lots of controls i.e. replicating pattern of live inputs to public
  }

  get_t3dataform() { // single control, to allow cheap testing 
     return this.t3dataform
  }



}