import { useEffect, useRef, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { toast } from '@/hooks/use-toast';

interface MQTTData {
  totalOccupancy: number | null;
  seatingAvailable: number | null;
  queueOccupancy: number | null;
  estimatedWait: string | null; // ✅ changed to string to support "2 Mins", "Ready to Serve"
}

const MQTT_CONFIG = {
  url: 'wss://eade8d7e7a05492ba062f6eb2dc8ba58.s1.eu.hivemq.cloud:8884/mqtt',
  username: 'Amgen',
  password: 'Acs@2025',
  topic: 'my-topic',
};

export const useMQTT = () => {
  const [data, setData] = useState<MQTTData>({
    totalOccupancy: null,
    seatingAvailable: null,
    queueOccupancy: null,
    estimatedWait: null,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const clientRef = useRef<MqttClient | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const reconnect = () => {
    if (clientRef.current) {
      clientRef.current.end(true);
    }
    setIsConnected(false);
    setData({
      totalOccupancy: null,
      seatingAvailable: null,
      queueOccupancy: null,
      estimatedWait: null,
    });
  };

  useEffect(() => {
    const connect = () => {
      console.log('Connecting to MQTT broker...');

      const client = mqtt.connect(MQTT_CONFIG.url, {
        username: MQTT_CONFIG.username,
        password: MQTT_CONFIG.password,
        reconnectPeriod: 5000,
        connectTimeout: 30000,
      });

      client.on('connect', () => {
        console.log('✅ Connected to HiveMQ Cloud');
        setIsConnected(true);
        toast({
          title: '🟢 Connected',
          description: 'Connected to Amgen MQTT Cloud',
        });

        // Subscribe to topic
        client.subscribe(MQTT_CONFIG.topic, (err) => {
          if (err) {
            console.error(`❌ Failed to subscribe to ${MQTT_CONFIG.topic}:`, err);
          } else {
            console.log(`📡 Subscribed to ${MQTT_CONFIG.topic}`);
          }
        });
      });

      client.on('message', (topic, message) => {
        console.log(`📥 Received message on ${topic}:`, message.toString());

        try {
          const payload = JSON.parse(message.toString());

          // ✅ Updated: no clamping, proper string support for estimatedWait
          setData({
            totalOccupancy:
              payload['Cafeteria Total Occupancy'] !== undefined
                ? Number(payload['Cafeteria Total Occupancy'])
                : null,
            seatingAvailable:
              payload['Seating Available (Approx)'] !== undefined
                ? Number(payload['Seating Available (Approx)'])
                : null,
            queueOccupancy:
              payload['Buffet Counter 3 Queue'] !== undefined
                ? Number(payload['Buffet Counter 3 Queue'])
                : null,
            estimatedWait:
              payload['BC3 Queue Waiting Time'] !== undefined
                ? String(payload['BC3 Queue Waiting Time'])
                : '—',
          });

          setLastUpdate(new Date());
        } catch (error) {
          console.error('⚠️ Failed to parse MQTT message:', error);
        }
      });

      client.on('error', (error) => {
        console.error('🚨 MQTT Error:', error);
        setIsConnected(false);
        toast({
          title: '🔴 Connection Error',
          description: 'Connection lost. Retrying...',
          variant: 'destructive',
        });
      });

      client.on('offline', () => {
        console.log('⚠️ MQTT Client offline');
        setIsConnected(false);
      });

      client.on('reconnect', () => {
        console.log('🔁 Reconnecting to MQTT broker...');
      });

      clientRef.current = client;
    };

    connect();

    // Cleanup
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, []);

  return { data, isConnected, lastUpdate, reconnect };
};
