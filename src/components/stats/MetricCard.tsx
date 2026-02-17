import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    className?: string;
}

export default function MetricCard({
    title,
    value,
    icon: Icon,
    description,
    className = '',
}: MetricCardProps) {
    return (
        <div
            className={`bg-card border border-border rounded-xl p-4 sm:p-6 stats-fade-in flex flex-col gap-2 ${className}`}
        >
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs sm:text-sm font-medium uppercase tracking-wide">
                    {title}
                </span>
                <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {value}
            </div>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
        </div>
    );
}
