import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export default function ToolCard({ title, description, href, icon: Icon }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group block h-full rounded-xl border border-gray-700 bg-gray-900/80 p-5 shadow-sm shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-500"
    >
      <div className="mb-4 inline-flex rounded-lg bg-gray-800 p-2.5 transition-colors duration-200 group-hover:bg-gray-700">
        <Icon className="h-6 w-6 text-slate-300 transition-colors duration-200 group-hover:text-slate-100" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-100 transition-colors duration-200 group-hover:text-white">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-gray-400 transition-colors duration-200 group-hover:text-gray-300">
        {description}
      </p>
    </Link>
  );
}
