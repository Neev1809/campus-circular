const LATE_FEE_PER_DAY = 50
const PLATFORM_FEE_RATE = 0.10

export function computeSettlement({ deposit, daysLate = 0, damageDeduction = 0 }) {
  const lateFee = daysLate * LATE_FEE_PER_DAY
  const totalDeductions = lateFee + damageDeduction
  const refund = Math.max(0, deposit - totalDeductions)

  return {
    deposit,
    lateFee,
    daysLate,
    damageDeduction,
    totalDeductions,
    refund,
    breakdown: {
      depositLabel: 'Security Deposit',
      lateFeeLabel: `Late Fee (${daysLate} day${daysLate !== 1 ? 's' : ''} × ₹${LATE_FEE_PER_DAY})`,
      damageLabel: 'Damage Deduction',
      refundLabel: 'Refund Amount',
    },
  }
}

export function computePricing({ pricePerDay, duration = 1, deposit }) {
  const borrowingCharge = pricePerDay * duration
  const platformFee = Math.round(borrowingCharge * PLATFORM_FEE_RATE)
  const totalAmount = borrowingCharge + platformFee + deposit

  return {
    borrowingCharge,
    platformFee,
    deposit,
    totalAmount,
    duration,
    pricePerDay,
    breakdown: [
      { label: `Borrowing Charge (${duration} day${duration !== 1 ? 's' : ''} × ₹${pricePerDay})`, amount: borrowingCharge, type: 'charge' },
      { label: 'Platform Fee (10%)', amount: platformFee, type: 'fee' },
      { label: 'Security Deposit', amount: deposit, type: 'deposit', refundable: true },
      { label: 'Transaction Amount', amount: totalAmount, type: 'total' },
    ],
  }
}
