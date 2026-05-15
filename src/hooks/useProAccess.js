// HireReady is now independent of Base44 and Stripe.
// This compatibility hook keeps older UI code safe until the v2 credit system replaces Pro gating.

export function useProAccess() {
  return {
    isPro: false,
    loading: false,
    refresh: () => {},
  };
}
