export type MortgageInput = {
  price: number;
  down: number;
  rate: number;
  years: number;
  tax: number;
  insurance: number;
  hoa: number;
  pmi: number;
};

export function calculateMortgage(input: MortgageInput) {
  if (Object.values(input).some(value => !Number.isFinite(value) || value < 0)) {
    throw new Error('Enter a finite, non-negative number in every field.');
  }
  const { price, down, rate, years, tax, insurance, hoa, pmi } = input;
  if (price <= 0 || price > 1e9) throw new Error('Home price must be greater than $0 and at most $1 billion.');
  if (down > price) throw new Error('Down payment cannot exceed the home price.');
  if (rate > 100) throw new Error('Annual interest rate must be between 0% and 100%.');
  if (!Number.isInteger(years) || years < 1 || years > 50) throw new Error('Loan term must be a whole number from 1 to 50 years.');
  if ([tax, insurance, hoa, pmi].some(value => value > 1e7)) throw new Error('Each tax, insurance, HOA, or PMI amount must be at most $10 million.');

  const loan = price - down;
  const months = years * 12;
  const monthlyRate = rate / 1200;
  // P * r / (1 - (1 + r)^-n), stable even for very small positive rates.
  const payment = loan === 0 ? 0 : monthlyRate === 0 ? loan / months
    : loan * monthlyRate / -Math.expm1(-months * Math.log1p(monthlyRate));
  const schedule: { year: number; principal: number; interest: number; balance: number }[] = [];
  let balance = loan;
  let totalInterest = 0;
  for (let year = 1; year <= years; year++) {
    let principal = 0;
    let interest = 0;
    for (let month = 1; month <= 12; month++) {
      const monthlyInterest = balance * monthlyRate;
      const paidPrincipal = year === years && month === 12 ? balance
        : Math.min(balance, Math.max(0, payment - monthlyInterest));
      balance = Math.max(0, balance - paidPrincipal);
      principal += paidPrincipal;
      interest += monthlyInterest;
    }
    totalInterest += interest;
    schedule.push({ year, principal, interest, balance });
  }
  const monthlyTax = tax / 12;
  const monthlyInsurance = insurance / 12;
  const monthlyTotal = payment + monthlyTax + monthlyInsurance + hoa + pmi;
  const totalPaid = loan + totalInterest;
  if (![payment, monthlyTotal, totalInterest, totalPaid].every(Number.isFinite)) {
    throw new Error('These values are too large to calculate.');
  }
  return { loan, payment, monthlyTax, monthlyInsurance, hoa, pmi, monthlyTotal, totalInterest, totalPaid, schedule };
}
