export const googleTagManagerId =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || '';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

type GeneratePlotLabel = 'generate_plot_button';

export const sendGeneratePlot = (
    label: GeneratePlotLabel,
  ): void => {
    window.dataLayer.push({
      event: 'generate_plot',
      generate_plot_trigger: label,
    });
  };