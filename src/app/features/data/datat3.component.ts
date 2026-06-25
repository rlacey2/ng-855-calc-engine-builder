// features/test/test-runner.component.ts
import { Component, Input, signal } from '@angular/core';
 
import { JsonPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
 

@Component({
  selector: 'data-t3',
  standalone: true,
  templateUrl: './datat3.component.html',
  imports:  [JsonPipe  ],
  
})
export class DataT3Component {

 
  @Input() t3FormFG: FormGroup | undefined;

  output = signal<any>(null);

  testData = {
    // 🔴 should come from your t3FormData defaults

    // or specific test data if that is not available
  };

 
 t3data = { current: ''}

  constructor() {
    console.log('wire in data for specific event')
 
  }


  onNginit() {
   this.t3data.current = this.t3FormFG?.getRawValue()
   console.log(this.t3data.current)
  }
  
}