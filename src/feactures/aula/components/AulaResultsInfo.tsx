import { Info } from 'lucide-react';

interface AulaResultsInfoProps {
  totalCount: number;
  startIndex: number;
  endIndex: number;
}

export default function AulaResultsInfo({
  totalCount,
  startIndex,
  endIndex
}: AulaResultsInfoProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-base-200/60 rounded-md border border-base-300/50 text-sm">
      <Info size={14} className="text-primary/70" />
      <span className="text-base-content/70">
        Mostrando <span className="font-medium text-base-content">{totalCount === 0 ? 0 : startIndex + 1}-{endIndex}</span> de <span className="font-medium text-base-content">{totalCount}</span> {totalCount === 1 ? 'aula' : 'aulas'}
      </span>
    </div>
  );
}