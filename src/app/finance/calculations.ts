export function loanPayment(amount: number, annualRate: number, months: number, extra: number) {
  const rate = annualRate / 1200;
  const payment = rate === 0 ? amount / months : amount * rate / -Math.expm1(-months * Math.log1p(rate));
  let balance = amount;
  let interest = 0;
  const schedule = [];
  for (let month = 1; month <= months && balance > 0.000001; month++) {
    const charge = balance * rate;
    const paid = month === months ? balance + charge : Math.min(payment + extra, balance + charge);
    balance = Math.max(0, balance - (paid - charge));
    interest += charge;
    schedule.push({ month, paid, principal: paid - charge, interest: charge, balance });
  }
  return { payment, interest, total: amount + interest, months: schedule.length, schedule };
}

export function compoundGrowth(initial: number, monthly: number, annualRate: number, years: number) {
  let balance = initial;
  const points = [{ year: 0, balance, deposits: initial, interest: 0 }];
  for (let month = 1; month <= years * 12; month++) {
    balance = balance * (1 + annualRate / 1200) + monthly;
    if (month % 12 === 0) points.push({ year: month / 12, balance, deposits: initial + monthly * month, interest: balance - initial - monthly * month });
  }
  return points;
}

export type Subscription = { id: string; name: string; cost: number; cycle: 'monthly' | 'yearly'; renewal: string; cancel: boolean };
export const monthlyCost = (item: Subscription) => item.cycle === 'yearly' ? item.cost / 12 : item.cost;
export function validSubscription(value: unknown): value is Subscription {
  if (!value || typeof value !== 'object') return false;
  const item = value as Subscription;
  return typeof item.id === 'string' && typeof item.name === 'string' && item.name.trim().length > 0 && item.name.length <= 80 && Number.isFinite(item.cost) && item.cost > 0 && item.cost <= 1e6 && ['monthly', 'yearly'].includes(item.cycle) && typeof item.cancel === 'boolean' && typeof item.renewal === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.renewal) && item.renewal >= '1900-01-01' && item.renewal <= '9998-12-31' && Number.isFinite(Date.parse(item.renewal)) && new Date(item.renewal).toISOString().slice(0, 10) === item.renewal;
}
export function nextRenewal(item: Subscription, today: string) {
  const [year, month, day] = item.renewal.split('-').map(Number);
  const [currentYear, currentMonth] = today.split('-').map(Number);
  const step = item.cycle === 'monthly' ? 1 : 12;
  let offset = Math.max(0, Math.floor(((currentYear - year) * 12 + currentMonth - month) / step) * step);
  function dateAt(count: number) {
    const date = new Date(Date.UTC(year, month - 1 + count, 1));
    const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(day, lastDay));
    return date.toISOString().slice(0, 10);
  }
  while (dateAt(offset) < today) offset += step;
  return dateAt(offset);
}
