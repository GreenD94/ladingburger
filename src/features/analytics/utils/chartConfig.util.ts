import { ChartOptions, ChartTypeRegistry } from 'chart.js';

export interface ChartConfigOptions {
  title?: string;
  height?: number;
  showLegend?: boolean;
  responsive?: boolean;
}

export function getDefaultChartOptions<T extends keyof ChartTypeRegistry = 'bar'>(options: ChartConfigOptions = {}): ChartOptions<T> {
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
  } as ChartOptions<T>;
}

export function getMobileChartOptions<T extends keyof ChartTypeRegistry = 'bar'>(baseOptions: ChartOptions<T>): ChartOptions<T> {
  return {
    ...baseOptions,
    plugins: {
      ...(baseOptions?.plugins),
      legend: {
        ...(baseOptions?.plugins?.legend),
        position: 'bottom' as const,
      },
    },
  } as ChartOptions<T>;
}

