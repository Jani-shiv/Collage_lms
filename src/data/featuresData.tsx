import React from 'react';
import { Activity, Lock, Zap, Compass, LineChart, Shield } from 'lucide-react';

export const features = [
  {
    icon: <Activity className="h-6 w-6" />,
    title: "Real-time Analytics",
    description: "Monitor market movements with advanced charts and indicators updated in real-time."
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Bank-level Security",
    description: "Your assets are protected with military-grade encryption and multi-factor authentication."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Execution",
    description: "Execute trades in milliseconds with our high-performance trading engine."
  },
  {
    icon: <Compass className="h-6 w-6" />,
    title: "Smart Portfolio",
    description: "Optimize your crypto holdings with AI-powered portfolio suggestions."
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Price Alerts",
    description: "Never miss an opportunity with customizable price alerts and notifications."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Cold Storage",
    description: "Majority of assets stored in offline cold wallets for maximum security."
  }
];
