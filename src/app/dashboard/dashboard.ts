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
  imageInfo:any={
    accepted:[120, 200, 150, 80, 70],
    reprocess:[60, 100, 90, 140, 130],
    rescan:[180, 220, 160, 190, 210],
    failed:[120, 145, 23, 48, 90],
    notAnalyzed:[127, 44, 72, 69, 86]
  }
  colors={
    accepted:'#3594CC',
    reprocess:'#9F0000',
    rescan:'#EB6A6A',
    failed:'red',
    notAnalyzed:'#B2B1BD'
  }
  private sumCache: Record<string, number> = {};
  stackedBarChartOption: EChartsOption = {
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
      bottom: 0,
      left:'center',
      orient: 'horizontal',
      icon:'circle'
      // data:['Accepted']
    },

    grid: {
      top:10,
      left: 10,
      right: 10,
      bottom: 40,
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
        data: this.imageInfo.accepted,
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
        data: this.imageInfo.reprocess,
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
        data: this.imageInfo.rescan,
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
        data: this.imageInfo.failed,
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
        data: this.imageInfo.notAnalyzed,
        itemStyle: { color: '#B2B1BD', borderRadius: [8, 8, 0, 0] }
      }
    ]
  };

  groupedBarChartOption: EChartsOption = {
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
      bottom: 0,
      left:'center',
      orient: 'horizontal',
      icon:'circle'
      // data:['Accepted']
    },

    grid: {
      top:10,
      left: 10,
      right: 10,
      bottom: 40,
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
        name: 'Reprocess',
        type: 'bar',      
        barMinWidth: 30,
        barWidth:20,
        barMaxWidth: 40,
        barCategoryGap:'30%',
        emphasis: { focus: 'self' },
        label: {
          show: true,
          position: 'insideBottom',
          fontSize: 12,
          color: '#fff',
          // fontWeight: 400
        },
        // labelLayout: { hideOverlap: true },
        data: this.imageInfo.reprocess,
        itemStyle: { color: '#9F0000' ,borderRadius:[8,8,0,0]}
      },
      {
        name: 'Rescan',
        type: 'bar',
        barMinWidth: 30,
        barWidth:20,
        barMaxWidth: 40,
        barCategoryGap:'30%',
        emphasis: { focus: 'self' },
        label: {
          show: true,
          position: 'insideBottom',
          fontSize: 12,
          color: '#fff'
        },
        data: this.imageInfo.rescan,
        itemStyle: { color: '#EB6A6A', borderRadius:[8,8,0,0] }
      },

    ]
  };
  halfDoughnutRoseChartOption:EChartsOption={
    tooltip:{
      trigger:'item',
      // axisPointer:{
      //   type:'shadow'
      // },
    },
    legend: {
      bottom: 0,
      left:'center',
      orient: 'horizontal',
      icon:'circle'
      // data:['Accepted']
    },
    grid: {
      top:10,
      left: 10,
      right: 10,
      bottom: 40,
      containLabel: true
    },

    series:[
      {
        name:'Overall Analysis',
        type:'pie',
        roseType: 'radius',
        radius:['20%','90%'],
        center: ['50%', '80%'],
        avoidLabelOverlap: false,
        startAngle: 180,
        endAngle: 360,
        itemStyle:{
          borderRadius:8,
          borderColor:'#fff',
          borderWidth:2
        },
        label:{show:true, formatter: '{b}: {c}'},
        data:[
          {name:'Accepted', value:this.sum('accepted'),itemStyle:{color:this.colors.accepted}},
          {name:'Reprocess', value:this.sum('reprocess'),itemStyle:{color:this.colors.reprocess}},
          {name:'Rescan', value:this.sum('rescan'),itemStyle:{color:this.colors.rescan}},
          {name:'Failed', value:this.sum('failed'),itemStyle:{color:this.colors.failed}},
          {name:'Not Analyzed', value:this.sum('notAnalyzed'),itemStyle:{color:this.colors.notAnalyzed}},
        ].sort(function (a, b) {
          return a.value - b.value;
        })

      }

    ]
  }
  fullDoughnutRoseChartOption:EChartsOption={
    tooltip:{
      trigger:'item',
      // axisPointer:{
      //   type:'shadow'
      // },
    },
    legend: {
      bottom: 0,
      left:'center',
      orient: 'horizontal',
      icon:'circle'
      // data:['Accepted']
    },
    grid: {
      top:10,
      left: 10,
      right: 10,
      bottom: 40,
      containLabel: true
    },

    series:[
      {
        name:'Overall Analysis',
        type:'pie',
        roseType: 'radius',
        radius: '60%',
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        // startAngle: 180,
        // endAngle: 360,
        itemStyle:{
          // borderRadius:8,
          borderColor:'#fff',
          borderWidth:2
        },
        label:{show:true, formatter: '{b}: {c}'},
        data:[
          {name:'Accepted', value:this.sum('accepted'),itemStyle:{color:this.colors.accepted}},
          {name:'Reprocess', value:this.sum('reprocess'),itemStyle:{color:this.colors.reprocess}},
          {name:'Rescan', value:this.sum('rescan'),itemStyle:{color:this.colors.rescan}},
          {name:'Failed', value:this.sum('failed'),itemStyle:{color:this.colors.failed}},
          {name:'Not Analyzed', value:this.sum('notAnalyzed'),itemStyle:{color:this.colors.notAnalyzed}},
        ].sort(function (a, b) {
          return a.value - b.value;
        })

      }

    ]
  }
  fullDoughnutChartOption:EChartsOption={
    tooltip:{
      trigger:'item',
      // axisPointer:{
      //   type:'shadow'
      // },
    },
    legend: {
      bottom: 0,
      left:'center',
      orient: 'horizontal',
      icon:'circle'
      // data:['Accepted']
    },
    grid: {
      top:10,
      left: 10,
      right: 10,
      bottom: 40,
      containLabel: true
    },

    series:[
      {
        name:'Overall Analysis',
        type:'pie',
        // roseType: 'radius',
        radius:['40%','70%'],
        // center: ['50%', '80%'],
        avoidLabelOverlap: false,
        // startAngle: 180,
        // endAngle: 360,
        itemStyle:{
          borderRadius:8,
          borderColor:'#fff',
          borderWidth:2
        },
        label:{show:true, formatter: '{b}: {c}'},
        data:[
          {name:'Accepted', value:this.sum('accepted'),itemStyle:{color:this.colors.accepted}},
          {name:'Reprocess', value:this.sum('reprocess'),itemStyle:{color:this.colors.reprocess}},
          {name:'Rescan', value:this.sum('rescan'),itemStyle:{color:this.colors.rescan}},
          {name:'Failed', value:this.sum('failed'),itemStyle:{color:this.colors.failed}},
          {name:'Not Analyzed', value:this.sum('notAnalyzed'),itemStyle:{color:this.colors.notAnalyzed}},
        ]

      }

    ]
  }
  private sum(key:string):number {  
    const arr = this.imageInfo[key] ?? [];
    if(key in this.sumCache && this.sumCache[key] !== undefined) return this.sumCache[key];
    const sum =  arr.reduce((acc:number,curr:number):number=> acc+curr,0);
    this.sumCache[key] = sum
    return sum;  
  }
}
