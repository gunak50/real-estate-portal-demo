import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useState } from 'react';
import LazyImage from './LazyImage';

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const next = () => setActive((i) => (i + 1) % images.length);
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 md:h-[440px]">
        <div
          className="relative col-span-4 row-span-2 cursor-pointer overflow-hidden rounded-2xl md:col-span-2"
          onClick={() => setOpen(true)}
        >
          <LazyImage src={images[0]} alt={alt} ratio="aspect-[4/3] md:aspect-auto md:h-[440px]" />
          <button className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow">
            <Maximize2 className="h-3.5 w-3.5" /> View all
          </button>
        </div>
        {images.slice(1, 5).map((src, i) => (
          <div
            key={i}
            className="hidden md:block cursor-pointer overflow-hidden rounded-2xl"
            onClick={() => {
              setActive(i + 1);
              setOpen(true);
            }}
          >
            <LazyImage src={src} alt={`${alt} ${i + 2}`} ratio="aspect-square" />
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/95 p-4">
          <button
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setOpen(false)}
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={prev}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img src={images[active]} alt={alt} className="max-h-[80vh] max-w-[90vw] rounded-xl" />
          <button
            className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={next}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
            {active + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
