// GradSharp is now independent of the legacy hosted-platform and payment integrations.
// This compatibility hook keeps older UI code safe until the v2 credit system replaces Pro gating.

export function useProAccess() {
  return {
    isPro: false,
    loading: false,
    refresh: () => {},
  };
}
