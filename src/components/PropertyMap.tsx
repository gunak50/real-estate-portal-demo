import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import type { Property } from '../types';
import { formatINR } from '../lib/utils';

// Fix default marker icons (Leaflet bundling quirk)
const icon = L.divIcon({
  className: 'estately-marker',
  html: '<div style="background:#2563eb;color:#fff;border:2px solid #fff;border-radius:9999px;padding:6px 10px;font-weight:700;font-size:12px;box-shadow:0 4px 12px rgba(0,0,0,0.25);white-space:nowrap;">●</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function priceIcon(label: string) {
  return L.divIcon({
    className: 'estately-marker',
    html: `<div style="background:#2563eb;color:#fff;border:2px solid #fff;border-radius:9999px;padding:4px 10px;font-weight:700;font-size:11px;box-shadow:0 4px 12px rgba(0,0,0,0.25);white-space:nowrap;">${label}</div>`,
    iconSize: [60, 24],
    iconAnchor: [30, 12],
  });
}

function FitBounds({ properties }: { properties: Property[] }) {
  const map = useMap();
  useEffect(() => {
    if (properties.length === 0) return;
    const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [properties, map]);
  return null;
}

export default function PropertyMap({ properties }: { properties: Property[] }) {
  const center: [number, number] = properties.length
    ? [properties[0].lat, properties[0].lng]
    : [20.5937, 78.9629];
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <MapContainer center={center} zoom={5} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds properties={properties} />
        {properties.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={priceIcon(formatINR(p.price))}>
            <Popup>
              <Link to={`/property/${p.slug}`} className="block w-56">
                <img src={p.images[0]} alt="" className="mb-2 h-24 w-full rounded object-cover" />
                <div className="font-semibold text-slate-800">{formatINR(p.price)}</div>
                <div className="line-clamp-1 text-sm">{p.title}</div>
                <div className="text-xs text-slate-500">{p.city}</div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export function SingleMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div className="h-72 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <MapContainer center={[lat, lng]} zoom={14} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={icon} />
      </MapContainer>
    </div>
  );
}

export function PickerMap({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  function ClickCatcher() {
    const map = useMap();
    useEffect(() => {
      const handler = (e: L.LeafletMouseEvent) => onChange(e.latlng.lat, e.latlng.lng);
      map.on('click', handler);
      return () => {
        map.off('click', handler);
      };
    }, [map]);
    return null;
  }
  return (
    <div className="h-72 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <MapContainer center={[lat, lng]} zoom={12} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickCatcher />
        <Marker position={[lat, lng]} icon={icon} draggable eventHandlers={{ dragend: (e) => {
          const m = e.target as L.Marker;
          const ll = m.getLatLng();
          onChange(ll.lat, ll.lng);
        } }} />
      </MapContainer>
    </div>
  );
}
