export const VIDEO_PATHS = {
  HERO_BACKGROUND: '/media/videos/hero-background.mp4',
  ABOUT_US: '/media/videos/about-us.mp4',
  MAKING_PROCESS: '/media/videos/making-process.mp4',
} as const;

export type VideoPath = typeof VIDEO_PATHS[keyof typeof VIDEO_PATHS];

