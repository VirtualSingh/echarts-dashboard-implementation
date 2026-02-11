import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Dashboard } from './app/dashboard/dashboard';
import {  provideEchartsCore } from 'ngx-echarts';
// import echarts core
import * as echarts from 'echarts/core';
// import necessary echarts components
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([BarChart, GridComponent, CanvasRenderer, LegendComponent, TitleComponent, TooltipComponent, PieChart]);

@Component({
  selector: 'app-root',
  template: `<app-dashboard/>`,
  imports:[Dashboard],
  providers:[provideEchartsCore({echarts})]
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
