import { ArrowLeft, ArrowRight, Camera, Check, MapPin, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/Stepper';
import { PickerMap } from '../components/PropertyMap';
import { ALL_AMENITIES, ALL_CITIES } from '../lib/seed';
import { useStore } from '../lib/store';
import { fileToDataURL, formatINR } from '../lib/utils';
import type { Category, ListingType } from '../types';

const STEPS = ['Basics', 'Location', 'Media', 'Features', 'Pricing'];

export default function AddProperty() {
  const me = useStore((s) => s.currentUser());
  const addProperty = useStore((s) => s.addProperty);
  const toast = useStore((s) => s.toast);
  const nav = useNavigate();

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    title: '',
    description: '',
    category: 'apartment' as Category,
    listingType: 'buy' as ListingType,
    address: '',
    city: ALL_CITIES[0] ?? 'Mumbai',
    lat: 20.5937,
    lng: 78.9629,
    images: [] as string[],
    amenities: [] as string[],
    beds: 1,
    baths: 1,
    area: 800,
    price: 5000000,
    ownerName: me?.name ?? '',
    ownerEmail: me?.email ?? '',
    ownerPhone: me?.phone ?? '',
  });

  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const onUpload = async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 8);
    const urls = await Promise.all(arr.map((f) => fileToDataURL(f)));
    set('images', [...data.images, ...urls].slice(0, 12));
  };

  const validate = (): string | null => {
    if (step === 0) {
      if (!data.title.trim() || data.title.length < 8) return 'Title must be at least 8 characters';
      if (!data.description.trim() || data.description.length < 20) return 'Description must be at least 20 characters';
    }
    if (step === 1) {
      if (!data.address.trim()) return 'Please enter an address';
    }
    if (step === 4) {
      if (data.price <= 0) return 'Price must be greater than 0';
      if (!data.ownerName || !data.ownerEmail) return 'Contact name and email are required';
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) {
      toast(err, 'error');
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
    else submit();
  };

  const submit = () => {
    const created = addProperty({
      title: data.title,
      description: data.description,
      category: data.category,
      listingType: data.listingType,
      price: data.price,
      beds: data.beds,
      baths: data.baths,
      area: data.area,
      address: data.address,
      city: data.city,
      lat: data.lat,
      lng: data.lng,
      images: data.images.length ? data.images : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70'],
      amenities: data.amenities,
      ownerPhone: data.ownerPhone,
      ownerName: data.ownerName,
      ownerEmail: data.ownerEmail,
    });
    nav(`/property/${created.slug}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">List your property</h1>
        <p className="mt-2 text-slate-500">Reach 1M+ verified buyers and renters. Free until your home is sold.</p>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <Stepper steps={STEPS} current={step} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Listing type</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(['buy', 'rent'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => set('listingType', t)}
                    className={`rounded-xl border p-4 text-left transition ${
                      data.listingType === t
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold capitalize">{t === 'buy' ? 'For sale' : 'For rent'}</div>
                    <div className="text-xs text-slate-500">{t === 'buy' ? 'One-time purchase' : 'Monthly rental'}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Property type</label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(['apartment', 'house', 'villa', 'plot'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => set('category', c)}
                    className={`rounded-xl border p-3 text-center capitalize ${
                      data.category === c ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Title</label>
              <input
                value={data.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Sunlit 3BHK with skyline views"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Description</label>
              <textarea
                rows={5}
                value={data.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Tell buyers what makes this home special — layout, lighting, neighborhood, recent upgrades…"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Street address</label>
                <input
                  value={data.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="123 Lakeview Avenue"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">City</label>
                <select
                  value={data.city}
                  onChange={(e) => set('city', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  {ALL_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-500">
                <MapPin className="h-3.5 w-3.5" /> Drop a pin (click map or drag the marker)
              </label>
              <PickerMap lat={data.lat} lng={data.lng} onChange={(la, ln) => setData((d) => ({ ...d, lat: la, lng: ln }))} />
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  <span className="text-slate-500">Lat:</span> {data.lat.toFixed(4)}
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  <span className="text-slate-500">Lng:</span> {data.lng.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-10 hover:border-brand-600 dark:border-slate-700"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onUpload(e.dataTransfer.files);
              }}
            >
              <input type="file" multiple accept="image/*" hidden onChange={(e) => onUpload(e.target.files)} />
              <Upload className="h-8 w-8 text-slate-400" />
              <div className="text-sm font-semibold">Drag & drop photos / videos</div>
              <div className="text-xs text-slate-500">Up to 12 images. JPEG/PNG/WebP recommended.</div>
              <span className="mt-2 rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white">Choose files</span>
            </label>
            {data.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {data.images.map((src, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-lg">
                    <img src={src} alt="" className="aspect-square w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => set('images', data.images.filter((_, j) => j !== i))}
                      className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-red-600 shadow opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {data.images.length === 0 && (
              <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                <Camera className="mr-1 inline h-3.5 w-3.5" />
                You can skip and we'll use a default photo for now — you can upload later.
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <NumberInput label="Bedrooms" value={data.beds} onChange={(v) => set('beds', v)} />
              <NumberInput label="Bathrooms" value={data.baths} onChange={(v) => set('baths', v)} />
              <NumberInput label="Area (sqft)" value={data.area} onChange={(v) => set('area', v)} step={50} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Amenities</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_AMENITIES.map((a) => {
                  const on = data.amenities.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() =>
                        set('amenities', on ? data.amenities.filter((x) => x !== a) : [...data.amenities, a])
                      }
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                        on
                          ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {on && <Check className="h-3 w-3" />}
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Asking {data.listingType === 'rent' ? 'monthly rent' : 'price'} (₹)
              </label>
              <input
                type="number"
                value={data.price}
                onChange={(e) => set('price', Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg font-semibold"
              />
              <div className="mt-1 text-sm text-slate-500">{formatINR(data.price)}</div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Contact name</label>
                <input
                  value={data.ownerName}
                  onChange={(e) => set('ownerName', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Email</label>
                <input
                  type="email"
                  value={data.ownerEmail}
                  onChange={(e) => set('ownerEmail', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Phone</label>
                <input
                  value={data.ownerPhone}
                  onChange={(e) => set('ownerPhone', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <strong>Heads up:</strong> Listings go to <em>Pending</em> status until an admin approves them.
              Use <kbd className="rounded bg-white px-1.5 py-0.5 text-xs dark:bg-slate-700">Login as Admin</kbd> from the sign-in page to instantly approve.
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold disabled:opacity-50 dark:border-slate-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={next}
          className="flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
        >
          {step === STEPS.length - 1 ? 'Submit listing' : 'Continue'} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase text-slate-500">{label}</label>
      <div className="mt-1 flex overflow-hidden rounded-lg border border-slate-300">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - step))}
          className="grid w-10 place-items-center bg-slate-50 dark:bg-slate-800"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="flex-1 bg-transparent px-3 py-2 text-center"
        />
        <button
          type="button"
          onClick={() => onChange(value + step)}
          className="grid w-10 place-items-center bg-slate-50 dark:bg-slate-800"
        >
          +
        </button>
      </div>
    </div>
  );
}
