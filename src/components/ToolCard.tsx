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
    <Link href={href}>
      <div className="group h-full p-6 bg-gray-900 border border-gray-800 rounded-lg hover:border-slate-600 transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
        {/* Icon */}
        <div className="mb-4 inline-flex p-2.5 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors duration-200">
          <Icon className="w-6 h-6 text-slate-300 group-hover:text-slate-100 transition-colors duration-200" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-white transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
