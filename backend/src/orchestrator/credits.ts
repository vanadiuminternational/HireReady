export type CreditReservation = {
  reservationId: string;
  creditsReserved: number;
  status: 'reserved' | 'charged' | 'refunded';
};

export function reserveCredits(actionId: string, credits: number): CreditReservation {
  return {
    reservationId: `mock_${actionId}_${Date.now()}`,
    creditsReserved: credits,
    status: 'reserved',
  };
}

export function chargeCredits(reservation: CreditReservation): CreditReservation {
  return { ...reservation, status: 'charged' };
}

export function refundCredits(reservation: CreditReservation): CreditReservation {
  return { ...reservation, status: 'refunded' };
}
