import { useEffect, useRef, useState } from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  ratio?: string;
}

export default function LazyImage({ src, alt, ratio = 'aspect-[4/3]', className = '', ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden ${ratio} ${className}`}>
      {!loaded && <div className="skeleton absolute inset-0" />}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`lazy-fade absolute inset-0 h-full w-full object-cover ${loaded ? 'loaded' : ''}`}
          {...rest}
        />
      )}
    </div>
  );
}
