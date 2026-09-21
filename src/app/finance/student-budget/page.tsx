import type { Metadata } from 'next';
import StudentBudget from './student-budget';

const title = 'Student Budget Calculator';
const description = 'Plan your monthly student budget. Compare income with rent, groceries, transport, school costs, and savings to see how much money is left.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/finance/student-budget' },
  openGraph: { title, description, url: '/finance/student-budget' },
  twitter: { card: 'summary', title, description },
};

export default function Page() {
  return <StudentBudget />;
}
