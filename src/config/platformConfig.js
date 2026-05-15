export const PLATFORM_CONFIG = {
  android: {
    enabled: true,
    packageId: 'com.vanadiumdigital.hireready',
    minSdkVersion: 24,
    compileSdkVersion: 36,
    targetSdkVersion: 36,
  },
  web: {
    previewEnabled: true,
    pwaEnabled: false,
  },
  safeArea: {
    top: 'env(safe-area-inset-top)',
    bottom: 'env(safe-area-inset-bottom)',
  },
  touchTargetMinPx: 44,
};
