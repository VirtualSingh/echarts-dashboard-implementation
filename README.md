# 📊 Analytics Dashboard - ECharts Implementation

A professional, responsive analytics dashboard built with **Angular 21** and **Apache ECharts**, showcasing comprehensive image processing metrics through interactive data visualizations.

![Angular](https://img.shields.io/badge/Angular-21.0-DD0031?style=flat&logo=angular)
![ECharts](https://img.shields.io/badge/ECharts-6.0-AA344D?style=flat&logo=apache-echarts)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)

## ✨ Features

### 📈 **8 Interactive Chart Types**
- **Stacked Bar Chart** - Monthly processing status visualization
- **Stacked Area Chart** - Trend analysis over time
- **Combo Chart** - Combined bar and area analysis for scanner performance
- **Grouped Bar Chart** - Side-by-side comparison of issues
- **Doughnut Chart** - Status distribution overview
- **Rose Chart (Full)** - Proportional status breakdown
- **Rose Chart (Semi)** - Half-circle overall analysis
- **Bubble/Scatter Chart** - Data point distribution analysis

### 🎨 **Professional Design**
- Modern card-based layout with smooth animations
- Responsive grid system (desktop, tablet, mobile)
- Clean color scheme with consistent branding
- Glassmorphism effects and subtle shadows
- Interactive hover states and transitions

### 📱 **Fully Responsive**
- Optimized for desktop (1600px+)
- Tablet-friendly (768px - 1200px)
- Mobile-ready (< 768px)
- Dynamic chart sizing and grid adaptation

### 📊 **Real-time Statistics**
- Total processed images counter
- Success rate calculation
- Status breakdown across 5 categories
  - ✅ Accepted (#3594CC)
  - 🔄 Reprocess (#9F0000)
  - 🔍 Rescan (#EB6A6A)
  - ❌ Failed (red)
  - ⏳ Not Analyzed (#B2B1BD)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The application will be available at `http://localhost:4200`

## 🛠️ Tech Stack

- **Framework:** Angular 21 (Standalone Components)
- **Charting Library:** Apache ECharts 6.0 with ngx-echarts
- **Language:** TypeScript 5.9
- **Styling:** CSS3 with modern features (Grid, Flexbox, Animations)
- **Build Tool:** Angular CLI with Vite

## 📁 Project Structure

```
src/
├── app/
│   └── dashboard/
│       ├── dashboard.ts        # Main component with chart configurations
│       ├── dashboard.html       # Dashboard template
│       ├── dashboard.css        # Component styles
│       └── scatterData.ts       # Bubble chart data
├── global_styles.css            # Global styles and reset
├── index.html                   # Entry HTML
└── main.ts                      # Bootstrap configuration
```

## 🎯 Key Technical Highlights

### Chart Configuration
- Custom ECharts options for each visualization type
- Optimized legend placement and tooltips
- Smooth animations and transitions
- Responsive sizing with `autoResize`

### Performance Optimizations
- Memoization for aggregate calculations
- Efficient data transformation pipelines
- Lazy loading of chart instances
- Minimal re-renders

### Code Quality
- TypeScript strict mode
- Component-based architecture
- Separation of concerns (data, logic, presentation)
- Clean, maintainable code structure

## 📝 Technical Notes

### ECharts Module Integration
This project uses Angular 21's native ESM support with ECharts. The `skipLibCheck: true` option in `tsconfig.json` resolves type compatibility between ECharts' CommonJS exports and Angular's ESM target.

## 🎨 Color Palette

```css
Primary Blue:    #3594CC  /* Accepted status */
Dark Red:        #9F0000  /* Reprocess status */
Light Red:       #EB6A6A  /* Rescan status */
Error Red:       red      /* Failed status */
Neutral Gray:    #B2B1BD  /* Not Analyzed status */
```

## 📸 Screenshots

The dashboard features:
- A prominent header with gradient background and key metrics
- Grid layout adapting from 2-3 columns to single column on mobile
- Each chart in its own card with title and subtitle
- Consistent spacing and professional typography

## 🤝 Contributing

This is a portfolio/demonstration project. Feel free to fork and adapt for your own use cases.

## 📄 License

MIT License - feel free to use this project as a reference for your own implementations.

---

**Built with ❤️ using Angular and ECharts**
