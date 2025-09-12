// pricingPlansData.ts

export const pricingPlans = [
  {
    name: "Basic",
    price: { monthly: "$0", annual: "$0" },
    description: "Perfect for beginners getting started with crypto trading.",
    features: [
      "Access to 20+ cryptocurrencies",
      "Basic charting tools",
      "Market data with 15-min delay",
      "Email support",
      "Mobile app access"
    ],
    buttonText: "Get Started"
  },
  {
    name: "Pro",
    price: { monthly: "$19", annual: "$15" },
    description: "Designed for active traders seeking advanced tools.",
    features: [
      "Access to 50+ cryptocurrencies",
      "Advanced charting tools",
      "Real-time market data",
      "Priority email support",
      "Reduced trading fees (0.1%)",
      "API access",
      "Portfolio analytics"
    ],
    highlighted: true,
    buttonText: "Start 7-Day Free Trial"
  },
  {
    name: "Enterprise",
    price: { monthly: "$49", annual: "$39" },
    description: "Comprehensive solution for professional traders.",
    features: [
      "Access to all cryptocurrencies",
      "Professional-grade charts",
      "Real-time market data",
      "24/7 dedicated support",
      "Zero trading fees",
      "Advanced API access",
      "Institutional-grade security",
      "Custom reporting",
      "Team management"
    ],
    buttonText: "Contact Sales"
  }
];
