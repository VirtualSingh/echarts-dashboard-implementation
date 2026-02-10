import { Component } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  imports: [NgxEchartsDirective, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  chartOption: EChartsOption = {
    // title: {
    //   text: 'Monthly Sales (Stacked Bar)',
    //   left: 'center',
      
    // },

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        // shadowStyle:{
        //   width:'30%'
        // }
      }
    },

    legend: {
      top: 10,
      right:10,
      orient: 'horizontal',
      icon:'circle'
      // data:['Accepted']
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
      type: 'value',
      axisLine: { show: true },
      axisTick: { show: false }
    },

    series: [
      {
        name: 'Accepted',
        type: 'bar',
        stack: 'total',
        barMinWidth: 30,
        barWidth:20,
        barMaxWidth: 40,
        barCategoryGap:'30%',
        emphasis: { focus: 'self' },
        label: {
          show: true,
          position: 'insideTop',
          fontSize: 12,
          color: '#fff',

        },
        data: [120, 200, 150, 80, 70],
        itemStyle: { color: '#3594CC' }
      },
      {
        name: 'Reprocess',
        type: 'bar',
        stack: 'total',
        barMinWidth: 30,
        barWidth:20,
        barMaxWidth: 40,
        barCategoryGap:'30%',
        emphasis: { focus: 'self' },
        label: {
          show: true,
          position: 'insideTop',
          fontSize: 12,
          color: '#fff',
          // fontWeight: 400
        },
        // labelLayout: { hideOverlap: true },
        data: [60, 100, 90, 140, 130],
        itemStyle: { color: '#9F0000' }
      },
      {
        name: 'Rescan',
        type: 'bar',
        stack: 'total',
        barMinWidth: 30,
        barWidth:20,
        barMaxWidth: 40,
        barCategoryGap:'30%',
        emphasis: { focus: 'self' },
        label: {
          show: true,
          position: 'insideTop',
          fontSize: 12,
          color: '#fff'
        },
        data: [180, 220, 160, 190, 210],
        itemStyle: { color: '#EB6A6A' }
      },
      {
        name: 'Failed',
        type: 'bar',
        stack: 'total',
        barMinWidth: 30,
        barWidth:20,
        barMaxWidth: 40,
        barCategoryGap:'30%',
        label: {
          show: true,
          position: 'insideTop',
          fontSize: 12,
          color: '#fff',
          formatter: (p) => Number(p.value) >= 26 ? `${p.value}` : ''
        },
        emphasis: {
          focus: 'self',
          label: {
            show: true,
            position:'right',
            color:'#000',
            formatter: (p) => Number(p.value) < 25 ? `${p.value}` : ''
          }
        },
        data: [120, 145, 23, 48, 90],
        itemStyle: { color: 'red' }
      },
      {
        name: 'Not Analyzed',
        type: 'bar',
        stack: 'total',
        barMinWidth: 30,
        barWidth:30,
        barMaxWidth: 40,
        barCategoryGap:'30%',
        emphasis: { focus: 'self' },
        label: {
          show: true,
          position: 'insideTop',
          fontSize: 12,
          color: '#fff',
        },
        data: [127, 44, 72, 69, 86],
        itemStyle: { color: '#B2B1BD', borderRadius: [8, 8, 0, 0] }
      }
    ]
  };

}
