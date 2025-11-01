import { motion } from 'framer-motion';
import amgenLogo from '@/assets/amgen-logo-new.png';

interface DashboardHeaderProps {
  lastUpdate: Date | null;
}

export const DashboardHeader = ({ lastUpdate }: DashboardHeaderProps) => {
  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-10 sm:mb-14"
  >
    {/* Centered Logo */}
    <div className="flex justify-center mb-6">
      <motion.img 
        src={amgenLogo}
        alt="Amgen Logo"
        className="h-14 sm:h-20 w-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />
    </div>

    {/* Title */}
    <motion.h1 
      className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight text-center mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      Cafeteria Occupancy
    </motion.h1>

    {/* Subtitle */}
    <motion.p 
      className="text-base sm:text-lg text-muted-foreground mb-6 font-medium text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      Happy Dining Experience!    </motion.p>

    {/* Live Badge + Time */}
    <motion.div 
      className="flex items-center justify-center text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border-2 border-border">
        <span className="px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wide">
          Live
        </span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-muted-foreground font-medium">
          Last updated: <span className="text-foreground font-semibold">{formatTime(lastUpdate)}</span>
        </span>
      </div>
    </motion.div>
  </motion.div>
);
};
