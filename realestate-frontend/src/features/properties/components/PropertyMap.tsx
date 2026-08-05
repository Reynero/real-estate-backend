import { useMemo } from "react";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PropertySummaryDto } from "../types";

function formatShortPrice(price: number, listingType: string) {
  const short =
    price >= 1_000_000 ? `$${(price / 1_000_000).toFixed(1)}M` : `$${Math.round(price / 1000)}K`;
  return listingType === "ForRent" ? `${short}/mo` : short;
}

// Custom price-bubble pin instead of Leaflet's default marker icon.
// Turns amber when this pin is the one currently hovered/selected.
function createPinIcon(label: string, isActive: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${isActive ? "#E8A33D" : "#1E3A5F"};
      color:white;
      font-family:Inter, sans-serif;
      font-size:12px;
      font-weight:600;
      padding:4px 8px;
      border-radius:9999px;
      white-space:nowrap;
      box-shadow:0 1px 4px rgba(0,0,0,0.3);
      border:2px solid white;
    ">${label}</div>`,
    iconAnchor: [20, 15],
  });
}

interface PropertyMapProps {
  properties: PropertySummaryDto[];
  hoveredId: string | null;
  onHoverPin: (id: string | null) => void;
  onSelectPin: (id: string) => void;
}

export function PropertyMap({ properties, hoveredId, onHoverPin, onSelectPin }: PropertyMapProps) {
  // Only properties with coordinates can get a pin — some listings might not have them yet.
  const pinned = useMemo(
    () => properties.filter((p) => p.latitude != null && p.longitude != null),
    [properties]
  );

  const center: [number, number] =
    pinned.length > 0 ? [pinned[0].latitude!, pinned[0].longitude!] : [39.8283, -98.5795]; // fallback: center of the US

  return (
    <MapContainer center={center} zoom={pinned.length > 0 ? 12 : 4} className="h-full w-full" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pinned.map((property) => (
        <Marker
          key={property.id}
          position={[property.latitude!, property.longitude!]}
          icon={createPinIcon(formatShortPrice(property.price, property.listingType), hoveredId === property.id)}
          eventHandlers={{
            mouseover: () => onHoverPin(property.id),
            mouseout: () => onHoverPin(null),
            click: () => onSelectPin(property.id),
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13 }}>
              <strong>{formatShortPrice(property.price, property.listingType)}</strong>
              <div>
                {property.bedrooms} bd · {property.bathrooms} ba · {property.area.toLocaleString()} sqft
              </div>
              <div style={{ color: "#6B7280" }}>
                {property.city}, {property.state}
              </div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}