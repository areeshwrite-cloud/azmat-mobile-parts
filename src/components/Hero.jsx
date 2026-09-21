import { ShieldCheck, Truck, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-hero-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14 flex flex-col gap-4">
        <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight max-w-2xl">
          Genuine Mobile Repair Parts & Tools, Delivered Fast
        </h1>
        <p className="text-brand-50/90 max-w-xl text-sm sm:text-base">
          Charging flex, ICs, batteries, displays & microscopes — order directly on WhatsApp with live pricing and stock.
        </p>

        <div className="flex flex-wrap gap-3 mt-2 text-sm">
          <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full backdrop-blur">
            <ShieldCheck size={16} /> Genuine Parts
          </span>
          <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full backdrop-blur">
            <Zap size={16} /> Live Pricing
          </span>
          <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full backdrop-blur">
            <Truck size={16} /> Fast Order via WhatsApp
          </span>
        </div>
      </div>
    </section>
  );
}
