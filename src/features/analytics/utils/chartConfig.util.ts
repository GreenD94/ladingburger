import { ChartOptions } from 'chart.js';

export interface ChartConfigOptions {
  title?: string;
  height?: number;
  showLegend?: boolean;
  responsive?: boolean;
}

export function getDefaultChartOptions(options: ChartConfigOptions = {}): ChartOptions {
  const {
    title = '',
    height = 400,
    showLegend = true,
    responsive = true,
  } = options;

  return {
    responsive,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
      },
      title: {
        display: title !== '',
        text: title,
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
  };
}

export function getMobileChartOptions(baseOptions: ChartOptions): ChartOptions {
  return {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins?.legend,
        position: 'bottom' as const,
      },
    },
  };
}

