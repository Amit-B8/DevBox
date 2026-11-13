'use client';

import { useState } from 'react';
import { FinanceTool, Field, Result, panel, button, money } from '../finance-tool';
import { calculateMortgage, type MortgageInput } from './calculations';

const fields: { key: keyof MortgageInput; label: string; min?: number; max: number; step?: number }[] = [
  { key: 'price', label: 'Home price ($)', min: 0.01, max: 1e9 },
  { key: 'down', label: 'Down payment ($)', max: 1e9 },
  { key: 'rate', label: 'Annual interest rate (%)', max: 100 },
  { key: 'years', label: 'Loan term (years)', min: 1, max: 50, step: 1 },
  { key: 'tax', label: 'Annual property tax ($)', max: 1e7 },
  { key: 'insurance', label: 'Annual homeowners insurance ($)', max: 1e7 },
  { key: 'hoa', label: 'Monthly HOA dues ($)', max: 1e7 },
  { key: 'pmi', label: 'Monthly PMI ($)', max: 1e7 },
];

export default function MortgageCalculator() {
  const [values, setValues] = useState<Record<keyof MortgageInput, string>>({
    price: '350000', down: '70000', rate: '6.5', years: '30',
    tax: '4200', insurance: '1500', hoa: '0', pmi: '0',
  });
  const [result, setResult] = useState<ReturnType<typeof calculateMortgage> | null>(null);
  const [error, setError] = useState('');

  return (
    <FinanceTool title="Mortgage Calculator" description="Estimate your fixed-rate mortgage payment, monthly housing costs, and yearly loan balance.">
      <form noValidate className={`${panel} space-y-4`} onSubmit={event => {
        event.preventDefault();
        setError('');
        setResult(null);
        try {
          const input = {} as MortgageInput;
          for (const field of fields) {
            const raw = values[field.key];
            if (!raw.trim() || !Number.isFinite(Number(raw))) throw new Error(`Enter a valid number for ${field.label}. Use 0 for costs that do not apply.`);
            input[field.key] = Number(raw);
          }
          setResult(calculateMortgage(input));
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : 'Please check your inputs.');
        }
      }}>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(field => <Field key={field.key} label={field.label} value={values[field.key]} min={field.min} max={field.max} step={field.step ?? 'any'} onChange={value => {
            setValues(current => ({ ...current, [field.key]: value }));
            setResult(null);
            setError('');
          }} />)}
        </div>
        <p className="text-sm text-gray-400">All amounts are in USD. Enter tax and insurance per year; HOA and PMI per month. Use 0 for costs that do not apply. PMI is entered manually and is not automatically removed as your balance falls.</p>
        <button type="submit" className={button}>Calculate mortgage</button>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      </form>

      <div aria-live="polite">
        {result && <section className={`${panel} mt-6 space-y-5`}>
          <h2 className="text-lg font-semibold">Estimated payment</h2>
          <Result label="Total estimated monthly payment" value={money(result.monthlyTotal)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Result label="Loan amount" value={money(result.loan)} />
            <Result label="Monthly principal + interest" value={money(result.payment)} />
            <Result label="Monthly property tax" value={money(result.monthlyTax)} />
            <Result label="Monthly homeowners insurance" value={money(result.monthlyInsurance)} />
            <Result label="Monthly HOA" value={money(result.hoa)} />
            <Result label="Monthly PMI" value={money(result.pmi)} />
            <Result label="Total interest over the loan" value={money(result.totalInterest)} />
            <Result label="Total paid over the loan (principal + interest)" value={money(result.totalPaid)} />
          </div>
          <p className="text-sm text-gray-400">Loan totals exclude the down payment, tax, insurance, HOA, PMI, and closing costs. Monthly estimates assume these ongoing costs stay constant.</p>
          <h2 className="text-lg font-semibold">Yearly amortization summary</h2>
          <div className="max-h-96 overflow-auto rounded border border-gray-800" role="region" aria-label="Yearly amortization table" tabIndex={0}>
            <table className="w-full text-right text-sm">
              <caption className="sr-only">Principal and interest paid each year, with the remaining loan balance. Excludes ongoing housing costs.</caption>
              <thead><tr>{['Year', 'Principal paid', 'Interest paid', 'Remaining balance'].map(label => <th key={label} scope="col" className="p-3 text-gray-400">{label}</th>)}</tr></thead>
              <tbody>{result.schedule.map(row => <tr key={row.year} className="border-t border-gray-800">
                <th scope="row" className="p-3">{row.year}</th>
                {[row.principal, row.interest, row.balance].map((value, index) => <td key={index} className="whitespace-nowrap p-3">{money(value)}</td>)}
              </tr>)}</tbody>
            </table>
          </div>
        </section>}
      </div>
      <p className="mt-6 text-xs leading-relaxed text-gray-400">For educational estimates only, not financial advice or a lender quote. Assumes a fixed rate, monthly payments, and no extra payments. Actual payments, fees, taxes, insurance, PMI eligibility, and lender rounding may differ.</p>
    </FinanceTool>
  );
}
