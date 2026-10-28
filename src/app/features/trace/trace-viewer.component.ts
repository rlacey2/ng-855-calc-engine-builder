// features/trace/trace-viewer.component.ts
import { JsonPipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
 
@Component({
  selector: 'trace-viewer',
  standalone: true,
  templateUrl: './trace-viewer.component.html',
  imports: [JsonPipe, DecimalPipe]
})
export class TraceViewerComponent {
  @Input() trace: any[] = [];
}