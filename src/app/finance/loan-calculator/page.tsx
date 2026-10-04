'use client';

import { useState } from 'react';
import { FinanceTool, Field, Result, panel, button, money } from '../finance-tool';
import { loanPayment } from '../calculations';

export default function LoanCalculator() {
  const [amount, setAmount] = useState('25000');
  const [rate, setRate] = useState('6');
  const [months, setMonths] = useState('60');
  const [extra, setExtra] = useState('0');
  const [result, setResult] = useState<{ loan: ReturnType<typeof loanPayment>; baseline: ReturnType<typeof loanPayment> } | null>(null);
  const change = (setter: (value: string) => void) => (value: string) => { setter(value); setResult(null); };

  return (
    <FinanceTool title="Loan Calculator" description="Calculate monthly payments, total interest, and savings from extra payments.">
      <form className={`${panel} space-y-4`} onSubmit={(event) => {
        event.preventDefault();
        setResult({ loan: loanPayment(Number(amount), Number(rate), Number(months), Number(extra)), baseline: loanPayment(Number(amount), Number(rate), Number(months), 0) });
      }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Loan amount ($)" value={amount} onChange={change(setAmount)} min={0.01} max={1e9} />
          <Field label="Annual interest rate (%)" value={rate} onChange={change(setRate)} max={100} />
          <Field label="Loan term (months)" value={months} onChange={change(setMonths)} min={1} max={600} step={1} />
          <Field label="Extra monthly payment ($)" value={extra} onChange={change(setExtra)} max={1e9} />
        </div>
        <button className={button}>Calculate</button>
      </form>
      {result && <section className={`${panel} mt-6 space-y-4`} aria-live="polite">
        <h2 className="text-lg font-semibold">Results</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Result label="Required monthly payment" value={money(result.loan.payment)} />
          <Result label="Total interest with extra payments" value={money(result.loan.interest)} />
          <Result label="Total repaid" value={money(result.loan.total)} />
          <Result label="Payoff time" value={`${result.loan.months} months`} />
        </div>
        <p className="text-sm text-gray-300">Extra payments save {money(Math.max(0, result.baseline.interest - result.loan.interest))} in interest and shorten repayment by {result.baseline.months - result.loan.months} months.</p>
        <details><summary className="cursor-pointer text-sm text-slate-300">Repayment schedule</summary>
          <div className="mt-4 max-h-80 overflow-auto"><table className="w-full text-right text-sm">
            <caption className="sr-only">Monthly repayment schedule including extra payments</caption>
            <thead><tr>{['Month', 'Payment', 'Principal', 'Interest', 'Balance'].map((label) => <th scope="col" key={label} className="p-2 text-gray-400">{label}</th>)}</tr></thead>
            <tbody>{result.loan.schedule.map((row) => <tr key={row.month} className="border-t border-gray-800"><th scope="row" className="p-2">{row.month}</th>{[row.paid, row.principal, row.interest, row.balance].map((value, index) => <td key={index} className="p-2 whitespace-nowrap">{money(value)}</td>)}</tr>)}</tbody>
          </table></div>
        </details>
      </section>}
      <p className="mt-6 text-xs text-gray-400">Assumes a fixed interest rate and monthly payments. Excludes fees, taxes, insurance, and prepayment penalties. Actual lender rounding may differ.</p>
    </FinanceTool>
  );
}
