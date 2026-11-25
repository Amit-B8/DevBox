import Link from 'next/link';
import { ArrowUpRight, LucideIcon, Star } from 'lucide-react';

interface ToolCardProps {
  id?: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export default function ToolCard({
  id,
  title,
  description,
  href,
  icon: Icon,
  isFavorite = false,
  onToggleFavorite,
}: ToolCardProps) {
  return (
    <div className="group relative h-full rounded-xl border border-gray-700 bg-gray-900/80 shadow-sm shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-500 focus-within:border-blue-400 focus-within:bg-gray-800">
    <Link
      href={href}
      className="block h-full rounded-xl p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="inline-flex rounded-lg bg-gray-800 p-2.5 transition-colors duration-200 group-hover:bg-gray-700">
          <Icon className="h-6 w-6 text-slate-300 transition-colors duration-200 group-hover:text-slate-100" />
        </div>

        <div className="flex items-center gap-1.5">
          <ArrowUpRight
            aria-hidden="true"
            className="h-5 w-5 text-gray-500 transition-colors group-hover:text-blue-300 group-focus-within:text-blue-300"
          />
        </div>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-100 transition-colors duration-200 group-hover:text-white">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-gray-400 transition-colors duration-200 group-hover:text-gray-300">
        {description}
      </p>
    </Link>
    {onToggleFavorite && id && (
      <button
        type="button"
        onClick={() => onToggleFavorite(id)}
        aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
        aria-pressed={isFavorite}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        className="absolute right-12 top-4 flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-800 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
      >
        <Star aria-hidden="true" className={`h-5 w-5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
      </button>
    )}
    </div>
  );
}
