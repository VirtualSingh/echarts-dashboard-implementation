import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import type { EChartsOption } from 'echarts';
import { scatterData } from './scatterData';
import * as echarts from 'echarts/core';

interface DashboardCard {
  id: string;
  title: string;
  subtitle: string;
  option: EChartsOption;
  span: 1 | 2 | 3;
  expanded: boolean;
  order: number;
}


@Component({
  selector: 'app-dashboard',
  imports: [NgxEchartsDirective, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  cards: DashboardCard[] = [];
  private chartInstances = new Map<string, any>();

  @ViewChildren('chartGridItem')
  chartGridItems!: QueryList<ElementRef<HTMLElement>>;

  private cdr = inject(ChangeDetectorRef);

  imageInfo:any={
    accepted:[120, 200, 150, 80, 70],
    reprocess:[60, 100, 90, 140, 130],
    rescan:[180, 220, 160, 190, 210],
    failed:[120, 145, 23, 48, 90],
    notAnalyzed:[127, 44, 72, 69, 86]
  }
  colors:any={
    accepted:'#3594CC',
    reprocess:'#9F0000',
    rescan:'#EB6A6A',
    failed:'red',
    notAnalyzed:'#B2B1BD'
  }
  private sumCache: Record<string, number> = {};

  ngOnInit(): void {
    this.cards = this.createCards();
  }

  private createCards(): DashboardCard[] {
    return [
      {
        id: 'stacked-bar',
        title: 'Monthly Processing Status',
        subtitle: 'Stacked Bar View',
        option: this.stackedBarChartOption,
        span: 3,
        expanded: true,
        order: 1
      },
      {
        id: 'stacked-area',
        title: 'Trends Over Time',
        subtitle: 'Area Chart Analysis',
        option: this.stackedAreaChartOption,
        span: 1,
        expanded: false,
        order: 2
      },
      {
        id: 'full-doughnut',
        title: 'Status Distribution',
        subtitle: 'Doughnut Chart',
        option: this.fullDoughnutChartOption,
        span: 1,
        expanded: false,
        order: 3
      },
      {
        id: 'grouped-bar',
        title: 'Issue Comparison',
        subtitle: 'Reprocess vs Rescan',
        option: this.groupedBarChartOption,
        span: 1,
        expanded: false,
        order: 4
      },
      {
        id: 'stacked-combo',
        title: 'Scanner Performance Overview',
        subtitle: 'Combined Bar & Area Analysis',
        option: this.stackedComboChartOption,
        span: 2,
        expanded: false,
        order: 5
      },
      {
        id: 'full-doughnut-rose',
        title: 'Status Breakdown',
        subtitle: 'Rose Chart View',
        option: this.fullDoughnutRoseChartOption,
        span: 1,
        expanded: false,
        order: 6
      },
      {
        id: 'half-doughnut-rose',
        title: 'Overall Analysis',
        subtitle: 'Semi-Circle Rose Chart',
        option: this.halfDoughnutRoseChartOption,
        span: 1,
        expanded: false,
        order: 7
      },
      {
        id: 'bubble-chart',
        title: 'Data Point Distribution',
        subtitle: 'Scatter Plot Analysis',
        option: this.bubbleChartOption,
        span: 2,
        expanded: false,
        order: 8
      }
    ];
  }

  async onExpand(card: DashboardCard): Promise<void> {
    let isNowExpanded = false;

    await this.runFlip(() => {
      isNowExpanded = this.toggleExpand(card);
      this.repackCards();
    });

    this.queueChartResize(card.id);

    if (isNowExpanded) {
      this.focusCard(card.order);
    }
  }

  onChartInit(cardId: string, chart: any): void {
    this.chartInstances.set(cardId, chart);
  }

  private toggleExpand(card: DashboardCard): boolean {
    card.expanded = !card.expanded;
    return card.expanded;
  }

  private repackCards(): void {
    const expanded = this.cards.filter(card => card.expanded).sort((a, b) => a.order - b.order);
    const normal = this.cards.filter(card => !card.expanded).sort((a, b) => a.order - b.order);

    const result: DashboardCard[] = [];
    let normalIndex = 0;

    while (normalIndex < normal.length || expanded.length) {
      if (expanded.length) {
        result.push(expanded.shift()!);
        continue;
      }

      result.push(normal[normalIndex++]);

      if (normalIndex < normal.length) {
        result.push(normal[normalIndex++]);
      }
    }

    this.cards = [...result];

    if (this.cards.every(card => !card.expanded)) {
      this.cards.sort((a, b) => a.order - b.order);
    }
  }

  private runFlip(mutator: () => void): Promise<void> {
    return new Promise(resolve => {
      const firstRects = new Map<HTMLElement, DOMRect>();

      this.chartGridItems.forEach(item => {
        firstRects.set(item.nativeElement, item.nativeElement.getBoundingClientRect());
      });

      mutator();
      this.cdr.detectChanges();

      requestAnimationFrame(() => {
        this.chartGridItems.forEach(item => {
          const el = item.nativeElement;
          const first = firstRects.get(el);
          const last = el.getBoundingClientRect();

          if (!first) {
            return;
          }

          const deltaX = Math.round(first.left - last.left);
          const deltaY = Math.round(first.top - last.top);

          if (deltaX || deltaY) {
            el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            el.style.transition = 'transform 0s';

            requestAnimationFrame(() => {
              el.style.transition = 'transform 300ms ease';
              el.style.transform = '';
            });
          }
        });

        resolve();
      });
    });
  }

  private queueChartResize(cardId: string): void {
    const chart = this.chartInstances.get(cardId);

    if (!chart) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        chart.resize({ silent: true });
      });
    });
  }

  private focusCard(id: number | string): void {
    const element = this.chartGridItems
      .find(ref => ref.nativeElement.dataset['id'] == id)
      ?.nativeElement;

    if (!element) {
      return;
    }

    const previousTransform = element.style.transform;
    element.style.transform = 'none';
    const rect = element.getBoundingClientRect();
    element.style.transform = previousTransform;

    const topVisible = rect.top >= 0 && rect.top <= window.innerHeight;
    const bottomVisible = rect.bottom <= window.innerHeight;
    const fullyVisible = topVisible && bottomVisible;

    if (!fullyVisible) {
      const absoluteTop = window.scrollY + rect.top;
      const offset = 16;

      window.scrollTo({
        top: absoluteTop - offset,
        behavior: 'smooth'
      });
    }

    element.classList.add('focused');
    setTimeout(() => {
      element.classList.remove('focused');
    }, 700);
  }
  
  // Calculate statistics for header
  get totalProcessed(): number {
    return this.sum('accepted') + this.sum('reprocess') + this.sum('rescan') + 
           this.sum('failed') + this.sum('notAnalyzed');
  }
  
  get successRate(): number {
    const accepted = this.sum('accepted');
    const total = this.totalProcessed;
    return total > 0 ? Math.round((accepted / total) * 100) : 0;
  }
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

  stackedAreaChartOption: EChartsOption = {
    // title: {
    //   text: 'Monthly Sales (Stacked Bar)',
    //   left: 'center',
      
    // },

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
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
      boundaryGap: false,
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
        type: 'line',
        stack: 'total',
        areaStyle:{},
        smooth: true,
        // barMinWidth: 30,
        // barWidth:20,
        // barMaxWidth: 40,
        // barCategoryGap:'30%',
        emphasis: { focus: 'series' },
        // label: {
        //   show: true,
        //   position: 'insideTop',
        //   fontSize: 12,
        //   color: '#000',

        // },
        data: this.imageInfo.accepted,
        itemStyle: { color: '#3594CC' }
      },
      {
        name: 'Reprocess',
        type: 'line',
        stack: 'total',
        areaStyle:{},
        smooth: true,
        // barMinWidth: 30,
        // barWidth:20,
        // barMaxWidth: 40,
        // barCategoryGap:'30%',
        emphasis: { focus: 'series' },
        // label: {
        //   show: true,
        //   position: 'insideTop',
        //   fontSize: 12,
        //   color: '#000',
        //   // fontWeight: 400
        // },
        // labelLayout: { hideOverlap: true },
        data: this.imageInfo.reprocess,
        itemStyle: { color: '#9F0000' }
      },
      {
        name: 'Rescan',
        type: 'line',
        stack: 'total',
        areaStyle:{},
        smooth: true,
        // barMinWidth: 30,
        // barWidth:20,
        // barMaxWidth: 40,
        // barCategoryGap:'30%',
        emphasis: { focus: 'series' },
        // label: {
        //   show: true,
        //   position: 'insideTop',
        //   fontSize: 12,
        //   color: '#000'
        // },
        data: this.imageInfo.rescan,
        itemStyle: { color: '#EB6A6A' }
      },
      {
        name: 'Failed',
        type: 'line',
        stack: 'total',
        areaStyle:{},
        smooth: true,
        // barMinWidth: 30,
        // barWidth:20,
        // barMaxWidth: 40,
        // barCategoryGap:'30%',
        // label: {
        //   show: true,
        //   position: 'insideTop',
        //   fontSize: 12,
        //   color: '#000',
        //   formatter: (p) => Number(p.value) >= 26 ? `${p.value}` : ''
        // },
        emphasis: {
          focus: 'series',
          // label: {
          //   show: true,
          //   position:'right',
          //   color:'#000',
          //   formatter: (p) => Number(p.value) < 25 ? `${p.value}` : ''
          // }
        },
        data: this.imageInfo.failed,
        itemStyle: { color: 'red' }
      },
      {
        name: 'Not Analyzed',
        type: 'line',
        stack: 'total',
        smooth: true,
        // barMinWidth: 30,
        // barWidth:30,
        // barMaxWidth: 40,
        // barCategoryGap:'30%',
        areaStyle:{},
        emphasis: { focus: 'series' },
        // label: {
        //   show: true,
        //   position: 'insideTop',
        //   fontSize: 12,
        //   color: '#000',
        // },
        data: this.imageInfo.notAnalyzed,
        itemStyle: { color: '#B2B1BD', borderRadius: [8, 8, 0, 0] }
      }
    ]
  };

  stackedComboChartOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      // axisPointer: { type: 'shadow' }
    },
  
    legend: {
      bottom: 0,
      left: 'center',
      icon: 'circle'
    },
  
    grid: {
      top: 10,
      left: 0,
      right: 0,
      bottom: 40,
      containLabel: true
    },
  
    xAxis: {
      type: 'category',
      data: ['Scanner 1', 'Scanner 2', 'Scanner 3', 'Scanner 4', 'Scanner 5'],
      boundaryGap: true   // ✔ Center bars & dots
    },
  
    yAxis: {
      type: 'value'
    },
  
    series: [
      // ==== AREA (BACKGROUND) ====
      {
        name: 'Accepted',
        type: 'line',
        stack: 'area',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.2 ,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: this.colors.accepted },
          { offset: 1, color: 'rgba(255,255,255,0)' }
        ])},
        data: this.imageInfo.accepted,
        itemStyle: { color: this.colors.accepted },
        z: 1
      },
      {
        name: 'Reprocess',
        type: 'line',
        stack: 'area',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.2,    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: this.colors.reprocess },
          { offset: 1, color: 'rgba(255,255,255,0)' }
        ]) },
        data: this.imageInfo.reprocess,
        itemStyle: { color: this.colors.reprocess },
        z: 1
      },
      {
        name: 'Rescan',
        type: 'line',
        stack: 'area',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.2 ,    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: this.colors.rescan },
          { offset: 1, color: 'rgba(255,255,255,0)' }
        ])},
        data: this.imageInfo.rescan,
        itemStyle: { color: this.colors.rescan },
        z: 1
      },
      {
        name: 'Failed',
        type: 'line',
        stack: 'area',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.2 ,    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: this.colors.failed },
          { offset: 1, color: 'rgba(255,255,255,0)' }
        ])},
        data: this.imageInfo.failed,
        itemStyle: { color: this.colors.failed },
        z: 1
      },
      {
        name: 'Not Analyzed',
        type: 'line',
        stack: 'area',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.2,    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: this.colors.notAnalyzed },
          { offset: 1, color: 'rgba(255,255,255,0)' }
        ]) },
        data: this.imageInfo.notAnalyzed,
        itemStyle: { color: this.colors.notAnalyzed },
        z: 1
      },
  
      // ==== BAR (FOREGROUND) ====
      {
        name: 'Accepted',
        type: 'bar',
        stack: 'bar',
        barWidth: 28,
        data: this.imageInfo.accepted,
        // emphasis:{focus:'self'},
        itemStyle: { color: this.colors.accepted },
        z: 10
      },
      {
        name: 'Reprocess',
        type: 'bar',
        stack: 'bar',
        barWidth: 28,
        data: this.imageInfo.reprocess,
        itemStyle: { color: this.colors.reprocess },
        z: 10
      },
      {
        name: 'Rescan',
        type: 'bar',
        stack: 'bar',
        barWidth: 28,
        data: this.imageInfo.rescan,
        itemStyle: { color: this.colors.rescan },
        z: 10
      },
      {
        name: 'Failed',
        type: 'bar',
        stack: 'bar',
        barWidth: 28,
        data: this.imageInfo.failed,
        itemStyle: { color: this.colors.failed },
        z: 10
      },
      {
        name: 'Not Analyzed',
        type: 'bar',
        stack: 'bar',
        barWidth: 28,
        data: this.imageInfo.notAnalyzed,
        itemStyle: { color: this.colors.notAnalyzed },
        z: 10
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
  bubbleChartOption:EChartsOption={
    tooltip:{
      trigger:'item'
    },
    grid: {
      left: 10,
      right: 10,
      top:20,
      // bottom: 15
    },    
    legend:{
      data: ['accepted', 'failed', 'rescan', 'reprocess', 'notAnalyzed']
    },
    xAxis:{
      type:'value',
      axisTick:{show:false}
    },
    yAxis:{
      axisTick:{show:false},
      type:'value',
      interval: 500
    },
    series:this.getScatterSeries()
  }

  getScatterSeries() {
    return Object.keys(this.colors).map(status => ({
      name: status,
      type: 'scatter' as const,
      symbolSize: 10,
      itemStyle: {
        color: this.colors[status]
      },
      data: scatterData
        .filter(point => point.status === status)
        .map(point => point.value)
    }));
  }
  
}
