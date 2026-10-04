'use client';

import { useEffect, useState } from 'react';
import { FinanceTool, Result, panel, input, button, money } from '../finance-tool';
import { monthlyCost, nextRenewal, validSubscription, type Subscription } from '../calculations';

const storageKey = 'devbox-finance-subscriptions-v1';
const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export default function SubscriptionTracker() {
  const [items, setItems] = useState<Subscription[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [renewal, setRenewal] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const saved: unknown = JSON.parse(raw);
          if (!Array.isArray(saved) || !saved.every(validSubscription)) throw new Error('Invalid data');
          setItems(saved);
        }
      } catch { setNotice('Saved entries could not be loaded. You can still use the tracker in this session.'); }
      setCurrentDate(today());
      setRenewal(today());
      setReady(true);
    }, 0);
    const timer = window.setInterval(() => setCurrentDate(today()), 60000);
    return () => { window.clearTimeout(restore); window.clearInterval(timer); };
  }, []);

  function save(next: Subscription[]) {
    setItems(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setNotice('Saved in this browser.'); }
    catch { setNotice('Browser storage is unavailable. Changes will only last for this session.'); }
  }
  function reset() { setName(''); setCost(''); setCycle('monthly'); setRenewal(today()); setEditing(null); }
  const total = items.reduce((sum, item) => sum + monthlyCost(item), 0);
  const savings = items.filter((item) => item.cancel).reduce((sum, item) => sum + monthlyCost(item), 0);
  const sorted = currentDate ? [...items].sort((a, b) => nextRenewal(a, currentDate).localeCompare(nextRenewal(b, currentDate))) : items;

  return (
    <FinanceTool title="Subscription Tracker" description="Track recurring costs, upcoming renewals, and potential savings from cancellations.">
      <form className={`${panel} space-y-4`} onSubmit={(event) => {
        event.preventDefault();
        const item: Subscription = { id: editing ?? crypto.randomUUID(), name: name.trim(), cost: Number(cost), cycle, renewal, cancel: items.find((entry) => entry.id === editing)?.cancel ?? false };
        if (!validSubscription(item)) { setNotice('Enter a name, positive cost, and valid renewal date.'); return; }
        save(editing ? items.map((entry) => entry.id === editing ? item : entry) : [...items, item]);
        reset();
      }}>
        <h2 className="text-lg font-semibold">{editing ? 'Edit subscription' : 'Add subscription'}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-gray-300">Name<input required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className={`${input} mt-2`} placeholder="e.g. Music streaming" /></label>
          <label className="block text-sm font-medium text-gray-300">Cost per billing cycle ($)<input required type="number" min="0.01" max="1000000" step="0.01" value={cost} onChange={(event) => setCost(event.target.value)} className={`${input} mt-2`} /></label>
          <label className="block text-sm font-medium text-gray-300">Billing cycle<select value={cycle} onChange={(event) => setCycle(event.target.value as 'monthly' | 'yearly')} className={`${input} mt-2`}><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></label>
          <label className="block text-sm font-medium text-gray-300">Next renewal<input required type="date" min="1900-01-01" max="9998-12-31" value={renewal} onChange={(event) => setRenewal(event.target.value)} className={`${input} mt-2 [color-scheme:dark]`} /></label>
        </div>
        <div className="flex gap-4">
          <button disabled={!ready} className={`${button} disabled:opacity-50`}>{editing ? 'Save changes' : 'Add subscription'}</button>
          {editing && <button type="button" onClick={reset} className="text-sm text-slate-300 hover:underline">Cancel edit</button>}
        </div>
        <p role="status" className="text-sm text-gray-400">{notice}</p>
      </form>
      <section className={`${panel} mt-6 space-y-4`} aria-label="Subscription totals">
        <div className="grid gap-4 sm:grid-cols-2">
          <Result label="Monthly equivalent" value={money(total)} />
          <Result label="Annual equivalent" value={money(total * 12)} />
          <Result label="Potential annual savings" value={money(savings * 12)} />
          <Result label="Monthly after cancellations" value={money(Math.max(0, total - savings))} />
        </div>
        <h2 className="text-lg font-semibold">Upcoming renewals</h2>
        {!ready ? <p className="text-sm text-gray-400">Loading saved subscriptions...</p> : !items.length ? <p className="text-sm text-gray-400">Add your first subscription to see your recurring costs.</p> : sorted.map((item) => {
          const date = nextRenewal(item, currentDate);
          const days = Math.round((Date.parse(date) - Date.parse(currentDate)) / 86400000);
          return <article key={item.id} className="p-4 bg-gray-800 rounded border border-gray-700 space-y-3">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-medium break-all">{item.name}</h3>
              <span className={`text-xs ${days <= 7 ? 'text-amber-300' : 'text-gray-400'}`}>{days === 0 ? 'Renews today' : `Renews ${date}`}</span>
            </div>
            <p className="text-sm text-gray-400">{money(item.cost)} / {item.cycle === 'monthly' ? 'month' : 'year'} ({money(monthlyCost(item))} monthly equivalent)</p>
            <div className="flex flex-wrap justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-gray-300"><input type="checkbox" checked={item.cancel} onChange={() => save(items.map((entry) => entry.id === item.id ? { ...entry, cancel: !entry.cancel } : entry))} className="accent-blue-500" />Consider canceling</label>
              <div className="flex gap-4">
                <button aria-label={`Edit ${item.name}`} onClick={() => { setEditing(item.id); setName(item.name); setCost(String(item.cost)); setCycle(item.cycle); setRenewal(item.renewal); }} className="text-blue-400 hover:underline">Edit</button>
                <button aria-label={`Remove ${item.name}`} onClick={() => { save(items.filter((entry) => entry.id !== item.id)); if (editing === item.id) reset(); }} className="text-red-400 hover:underline">Remove</button>
              </div>
            </div>
          </article>;
        })}
      </section>
      <p className="mt-6 text-xs text-gray-400">All amounts are in USD. Entries are saved in this browser only. Selecting a cancellation estimates savings; it does not cancel the service.</p>
    </FinanceTool>
  );
}
