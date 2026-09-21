import { Phone, Truck, MessageCircle } from 'lucide-react';
import { whatsappNumber } from '../lib/whatsapp.js';

export default function TopBar() {
  const number = whatsappNumber();
  const displayNumber = number ? `+${number}` : 'N/A';

  return (
    <div className="hidden sm:block bg-black text-slate-200 text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-emerald-400" />
          <span>Wholesale pricing for repair shops across Pakistan | Helpline: 0319-7900202</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${number}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
          >
            <MessageCircle size={14} />
            {displayNumber}
          </a>
          <a
            href={`tel:${number}`}
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
          >
            <Phone size={14} />
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
}
