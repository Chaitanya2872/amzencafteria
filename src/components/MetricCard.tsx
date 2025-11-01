import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  status?: 'success' | 'warning' | 'danger' | 'default';
  delay?: number;
  tooltip?: string;
  colorValue?: boolean;
}

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  status = 'default',
  delay = 0,
  tooltip,
  colorValue = false,
}: MetricCardProps) => {

  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'bg-gradient-to-br from-success/5 via-card to-card border-success/30 hover:border-success/50';
      case 'warning':
        return 'bg-gradient-to-br from-warning/5 via-card to-card border-warning/30 hover:border-warning/50';
      case 'danger':
        return 'bg-gradient-to-br from-danger/5 via-card to-card border-danger/30 hover:border-danger/50';
      default:
        return 'bg-gradient-card border-border hover:border-primary/30';
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'danger':
        return 'text-danger bg-danger/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const getValueColor = () => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'danger':
        return 'text-danger';
      default:
        return 'text-card-foreground';
    }
  };

  const getStatusRing = () => {
    switch (status) {
      case 'success':
        return 'ring-2 ring-success/20';
      case 'warning':
        return 'ring-2 ring-warning/20';
      case 'danger':
        return 'ring-2 ring-danger/20 animate-pulse-glow';
      default:
        return '';
    }
  };

  const isNumeric = typeof value === 'number';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="h-full"
    >
      <Card
        className={`p-6 ${getStatusStyles()} ${getStatusRing()} transition-all duration-300 hover:shadow-card-hover cursor-pointer h-full border-2`}
        title={tooltip}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 leading-tight">
              {title}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${getIconColor()} transition-all duration-300`}>
            <Icon className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-2">
          {/* Instant Value Update with Fade */}
          <div className={`text-4xl sm:text-5xl font-bold tracking-tight ${colorValue ? getValueColor() : 'text-card-foreground'}`}>
            <motion.span
              key={value} // triggers reanimation on update
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {isNumeric ? Number(value).toLocaleString() : value}
            </motion.span>
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
