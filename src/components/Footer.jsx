import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from 'lucide-react';
import { buildWhatsappLink, whatsappNumber } from '../lib/whatsapp.js';

const COMPANY_LINKS = ['About Us', 'Contact Us', 'Privacy Policy', 'Terms & Conditions', 'Return Policy'];
const SERVICE_LINKS = ['My Account', 'My Orders', 'Track Order', 'Shipping Information', 'FAQs', 'Support'];
const SHOP_LINKS = ['LCD & Displays', 'Batteries', 'Charging Ports', 'ICs', 'Tools', 'Accessories'];

export default function Footer() {
  const number = whatsappNumber();

  return (
    <footer className="bg-[#071426] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-white">
              Customer Service
            </h3>
            <ul className="space-y-2 text-sm">
              {SERVICE_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-white">Shop</h3>
            <ul className="space-y-2 text-sm">
              {SHOP_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-white">Contact Us</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-emerald-400" />
                <a href="tel:923197900202" className="hover:text-white">
                  0319-7900202
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={14} className="shrink-0 text-emerald-400" />
                <a
                  href={buildWhatsappLink('Salam! I have a question regarding Azmat Mobile Parts products.')}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  0319-7900202
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-emerald-400" />
                <a href="mailto:noreply@azmatmobileparts.com" className="hover:text-white">
                  noreply@azmatmobileparts.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                <span>
                  NEW MADYAN ROAD QADRIA MARKET SHOP NO 21 22 AZMAT MOBILE PARTS MINGORA SWAT.
                </span>
              </li>
            </ul>

            <div className="mt-4 flex gap-2">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Youtube size={16} />
              </a>
              <a
                href={`https://wa.me/${number}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-5 text-xs sm:flex-row sm:justify-between">
          <p className="flex flex-wrap items-center gap-1.5 text-slate-400">
            <span className="rounded-full bg-white/10 px-2.5 py-1">We accept</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1">JazzCash</span>
            <span>|</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1">Easypaisa</span>
            <span>|</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1">Bank Transfer</span>
            <span>|</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1">Card</span>
          </p>
          <p className="text-slate-400">© {new Date().getFullYear()} Azmat Mobile Parts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
