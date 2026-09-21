export default function HeroBanner() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
        <span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Azmat Mobile Parts
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
          Fix Your Mobile with Trusted Spare Parts
        </h1>
        <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
          Quality GSM tools, LCDs, batteries, and accessories for professional repairs across
          Pakistan.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={() => scrollTo('catalog')}
            className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-orange-600"
          >
            Shop Now
          </button>
          <button
            onClick={() => scrollTo('categories')}
            className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-all hover:bg-white/20"
          >
            Browse All Products
          </button>
        </div>
      </div>
    </section>
  );
}
