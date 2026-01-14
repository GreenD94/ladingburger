export interface SafeAreaPadding {
  paddingLeft: string;
  paddingRight: string;
}

export const useSafeAreaPadding = (): SafeAreaPadding => {
  const horizontalPadding = `clamp(24px, 5vw, 48px)`;
  const safeAreaLeft = `env(safe-area-inset-left, 0px)`;
  const safeAreaRight = `env(safe-area-inset-right, 0px)`;
  const paddingLeft = `calc(${horizontalPadding} + ${safeAreaLeft})`;
  const paddingRight = `calc(${horizontalPadding} + ${safeAreaRight})`;

  return { paddingLeft, paddingRight };
};

