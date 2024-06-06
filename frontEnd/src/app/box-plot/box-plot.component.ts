import { Component, Input, SimpleChanges } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-box-plot',
  standalone: true,
  imports: [],
  templateUrl: './box-plot.component.html',
  styleUrl: './box-plot.component.scss',
  animations: [
    trigger('circleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(1) translate(-1000%, -50%)' }),
        animate('1300ms ease-out', style({ opacity: 1, transform: 'scale(1) translate(-50%, -50%)' }))
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'scale(1) translate(positionLeft, -50%)' }))
      ])
    ])
  ]
})
export class BoxPlotComponent {
  @Input() min!: number;
  @Input() q1!: number;
  @Input() median!: number;
  @Input() q3!: number;
  @Input() max!: number;
  @Input() employeeValue!: number;

  fixedWidth: number = 400;
  minMaxWidth!: number;
  q1q3Left!: number;
  q1q3Width!: number;
  medianLeft!: number;
  positionLeft!: number;

  ngOnInit(): void {
    this.calculatePositions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['min'] || changes['q1'] || changes['median'] || changes['q3'] || changes['max'] || changes['employeeValue']) {
      this.calculatePositions();
    }
  }

  private calculatePositions(): void {
    if (this.max !== undefined && this.min !== undefined && this.min !== this.max) {
      this.minMaxWidth = this.max - this.min;
      this.q1q3Left = ((this.q1 - this.min) / this.minMaxWidth) * this.fixedWidth;
      this.q1q3Width = ((this.q3 - this.q1) / this.minMaxWidth) * this.fixedWidth;
      this.medianLeft = ((this.median - this.min) / this.minMaxWidth) * this.fixedWidth;
      this.positionLeft = ((this.employeeValue - this.min) / this.minMaxWidth) * this.fixedWidth;
    }
  }
}
