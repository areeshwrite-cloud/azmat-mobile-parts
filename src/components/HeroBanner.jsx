import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHomeBanners } from '../hooks/useHomeBanners.js';

const FALLBACK = {
  title: 'Fix Your Mobile with Trusted Spare Parts',
  description: 'Quality GSM tools, LCDs, batteries, and accessories for professional repairs across Pakistan.',
  buttonText: 'Shop Now',
  buttonUrl: '#catalog',
  theme: 'Navy',
};
const themes = { Navy: 'from-slate-950 via-slate-900 to-slate-800', 'Dark Red': 'from-red-950 to-red-800', 'Black Slate': 'from-black to-slate-800', Orange: 'from-orange-700 to-orange-500' };

export default function HeroBanner({ config }) {
  const banners = useHomeBanners();
  const slides = banners.length ? banners : [FALLBACK];
  const [index, setIndex] = useState(0);
  const slide = slides[index] || slides[0];
  useEffect(() => { setIndex(0); }, [banners.length]);
  useEffect(() => { if (slides.length < 2) return undefined; const timer = setInterval(() => setIndex((current) => (current + 1) % slides.length), 5000); return () => clearInterval(timer); }, [slides.length]);
  const go = (url) => { if (!url) return; if (url.startsWith('#')) document.getElementById(url.slice(1))?.scrollIntoView({ behavior: 'smooth' }); else window.location.href = url; };
  return <section className={`relative overflow-hidden bg-gradient-to-br text-white ${themes[slide.theme] || themes.Navy}`} style={slide.desktopImage ? { backgroundImage: `linear-gradient(90deg, rgba(2,6,23,.9), rgba(2,6,23,.35)), url(${slide.desktopImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}><div className="mx-auto flex min-h-[360px] max-w-7xl items-center px-4 py-14 sm:min-h-[430px] sm:py-20"><div className="max-w-2xl"><span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-wide">{config?.store_name || 'Azmat Mobile Parts'}</span><h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">{slide.title}</h1><p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">{slide.description || config?.tagline}</p><button onClick={() => go(slide.buttonUrl || '#catalog')} className="mt-7 rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold shadow-lg hover:bg-orange-600">{slide.buttonText || 'Shop Now'}</button></div></div>{slides.length > 1 && <><button onClick={() => setIndex((index - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 rounded-full bg-black/30 p-2 hover:bg-black/50"><ChevronLeft size={20} /></button><button onClick={() => setIndex((index + 1) % slides.length)} className="absolute right-3 top-1/2 rounded-full bg-black/30 p-2 hover:bg-black/50"><ChevronRight size={20} /></button><div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">{slides.map((item, dot) => <button key={item.id || dot} onClick={() => setIndex(dot)} className={`h-2 w-2 rounded-full ${dot === index ? 'bg-orange-500' : 'bg-white/50'}`} />)}</div></>}</section>;
}
