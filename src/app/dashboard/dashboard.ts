import { Component } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [NgxEchartsDirective,CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
chartOption:any;
}
