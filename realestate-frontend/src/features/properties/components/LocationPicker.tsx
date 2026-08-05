import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="
    background:#E8A33D;
    width:16px;
    height:16px;
    border-radius:50%;
    border:3px solid white;
    box-shadow:0 1px 4px rgba(0,0,0,0.4);
  "></div>`,
  iconAnchor: [8, 8],
});

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

// Listens for map clicks and reports the coordinates back up.
// This has to be a child of MapContainer to access the map instance,
// which is why it's a separate small component instead of inline code.
function ClickListener({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => onChange(e.latlng.lat, e.latlng.lng),
  });
  return null;
}

export function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  // Defaults to a central US view until the owner clicks somewhere specific.
  const [center] = useState<[number, number]>(
    latitude != null && longitude != null ? [latitude, longitude] : [39.8283, -98.5795]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="h-64 w-full overflow-hidden rounded-card border border-line">
        <MapContainer center={center} zoom={latitude != null ? 13 : 4} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickListener onChange={onChange} />
          {latitude != null && longitude != null && (
            <Marker position={[latitude, longitude]} icon={pinIcon} />
          )}
        </MapContainer>
      </div>
      <p className="text-xs text-mute">
        {latitude != null && longitude != null
          ? `Pin set at ${latitude.toFixed(5)}, ${longitude.toFixed(5)} — click elsewhere to move it`
          : "Click on the map to drop a pin at the property's location"}
      </p>
    </div>
  );
}