import { useMQTT } from '@/hooks/useMQTT';
import { MetricCard } from '@/components/MetricCard';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Users, Armchair, UtensilsCrossed, Clock } from 'lucide-react';

const Index = () => {
  const { data, lastUpdate } = useMQTT();

  const getOccupancyStatus = (occupancy: number | null) => {
    if (occupancy === null) return 'default';
    if (occupancy <= 266) return 'success';
    if (occupancy <= 372) return 'warning';
    return 'danger';
  };

  const getSeatingStatus = (seating: number | null) => {
    if (seating === null) return 'default';
    if (seating <= 104) return 'danger';
    if (seating <= 219) return 'warning';
    return 'success';
  };

  const getQueueStatus = (queue: number | null) => {
    if (queue === null) return 'default';
    if (queue <= 5) return 'success';
    if (queue <= 10) return 'warning';
    return 'danger';
  };

  const seatingAvailable = data.seatingAvailable;

  const formatWaitTime = (minutes: number | null) => {
    if (minutes === null) return 'Calculating...';
    if (minutes < 1) return '< 1 min';
    return `${Math.round(minutes)} min`;
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
        <DashboardHeader lastUpdate={lastUpdate} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          <MetricCard
            title="Cafeteria Total Occupancy"
            value={data.totalOccupancy !== null ? data.totalOccupancy : 'Awaiting data...'}
            icon={Users}
            subtitle="Current number of people"
            status={getOccupancyStatus(data.totalOccupancy)}
            delay={0.1}
            tooltip="Total current number of people in the cafeteria (max 486)"
            colorValue={true}
          />
          
          <MetricCard
            title="Seating Available (Approx)"
            value={seatingAvailable !== null ? seatingAvailable : 'Awaiting data...'}
            icon={Armchair}
            subtitle="Estimated available seats out of 486"
            status={getSeatingStatus(seatingAvailable)}
            delay={0.2}
            tooltip="Available seating estimate based on total capacity 486"
            colorValue={true}
          />
          
          <MetricCard
            title="Buffet Counter 3 Queue"
            value={data.queueOccupancy !== null ? data.queueOccupancy : 'Awaiting data...'}
            icon={UtensilsCrossed}
            subtitle="People waiting at BC3"
            status={getQueueStatus(data.queueOccupancy)}
            delay={0.3}
          />
          
          <MetricCard
            title="BC3 Queue Waiting Time"
            value={data.estimatedWait !== null ? data.estimatedWait : '—'}
            icon={Clock}
            subtitle="Estimated wait time"
            status={
              data.estimatedWait !== null 
                ? (typeof data.estimatedWait === 'number' && data.estimatedWait > 10 ? 'warning' : 'success')
                : 'default'
            }
            delay={0.4}
          />
        </div>

        <footer className="text-center mt-14 pb-6">
          <p className="text-sm text-muted-foreground font-medium">
            <span className="inline-block">Powered By IOTIQ</span>
            <span className="mx-2"></span>
            <span className="inline-block"></span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
