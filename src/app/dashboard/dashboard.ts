import { Component } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  imports: [NgxEchartsDirective,CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
chartOption:EChartsOption = {
  title: {
    text: 'Monthly Sales (Stacked Bar)',
    left: 'center'
  },

  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },

  legend: {
    top: 30
  },

  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },

  xAxis: {
    type: 'category',
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
  },

  yAxis: {
    type: 'value'
  },

  series: [
    {
      name: 'Electronics',
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      data: [120, 200, 150, 80, 70]
    },
    {
      name: 'Clothing',
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      data: [60, 100, 90, 140, 130]
    },
    {
      name: 'Grocery',
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      data: [180, 220, 160, 190, 210]
    }
  ]
};

}
