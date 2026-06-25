// features/test/test-runner.component.ts
import { ChangeDetectorRef, Component, inject, Input, signal } from '@angular/core';

import { JsonPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { t3FormFGService } from '../../shared/t3FormFGService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'data-t3',
  standalone: true,
  templateUrl: './datat3.component.html',
    imports: [JsonPipe, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
})

export class DataT3Component {

  @Input() t3FormFG: FormGroup | undefined;

  output = signal<any>(null);

   t3FormFGService = inject(t3FormFGService)

  testData = {
    // 🔴 should come from your t3FormData defaults

    // or specific test data if that is not available
  };


  t3data = ''

  t3dataform: FormGroup =   this.t3FormFGService.get_t3dataform()

  cd = inject(ChangeDetectorRef)

 

  constructor() {
    console.log('wire in data for specific event')

  }


  ngOnInit() {
    /*
  const rawData = this.t3FormFG?.getRawValue();
  // The parameters (null, 2) format the JSON with 2-space indentation

  alert(JSON.stringify(rawData, null, 2))
  this.t3data.current = JSON.stringify(rawData, null, 2); 
 // not needed in this function this.cd.detectChanges();
*/

   

  }

  ngAfterViewInit(): void {
    // setTimeout pushes the execution to the next tick

    setTimeout(() => {
       this.t3dataform = this.t3FormFGService.get_t3dataform()
      const rawData = this.t3FormFG?.getRawValue();
      this.t3data = JSON.stringify(rawData, null, 2);
      this.t3dataform.patchValue({ current: this.t3data }, { emitEvent: false })

      console.log(this.t3dataform.getRawValue())
      this.cd.detectChanges();
    });

  }

  patch() {
    console.log('patch')
    let newCurrent = this.t3dataform.get('current')?.getRawValue()
  // let newJSON = JSON.parse(newCurrent)
    this.t3dataform.patchValue({ current: newCurrent }, { emitEvent: false })
  }

}