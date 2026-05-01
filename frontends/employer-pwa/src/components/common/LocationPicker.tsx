import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
// @ts-expect-error - Leaflet icon internals
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lon: number, address: string, city: string) => void;
  initialPos?: { lat: number, lon: number };
}

function MapEvents({ onLocationSelect, setMarkerPos, setIsDetecting }: { 
    onLocationSelect: (lat: number, lon: number, address: string, city: string) => void,
    setMarkerPos: (pos: [number, number]) => void,
    setIsDetecting: (val: boolean) => void
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPos([lat, lng]);
      reverseGeocode(lat, lng, onLocationSelect, setIsDetecting);
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const reverseGeocode = async (
    lat: number, 
    lon: number, 
    onLocationSelect: (lat: number, lon: number, addr: string, city: string) => void, 
    setIsDetecting: (val: boolean) => void
) => {
    setIsDetecting(true);
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
        );
        const data = await response.json();
        const addr = data.address;
        const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "";
        const displayAddr = data.display_name || "Custom Location";
        onLocationSelect(lat, lon, displayAddr, city);
    } catch (err) {
        console.error("Reverse geocoding failed:", err);
        onLocationSelect(lat, lon, "Custom Selected Location", "");
    } finally {
        setIsDetecting(false);
    }
};

export function LocationPicker({ onLocationSelect, initialPos }: LocationPickerProps) {
  const [markerPos, setMarkerPos] = useState<[number, number]>(initialPos ? [initialPos.lat, initialPos.lon] : [28.6139, 77.2090]); // Delhi default
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (initialPos && (initialPos.lat !== markerPos[0] || initialPos.lon !== markerPos[1])) {
        setMarkerPos([initialPos.lat, initialPos.lon]);
    }
  }, [initialPos, markerPos]);

  const handleDetect = () => {
    if (navigator.geolocation) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMarkerPos([latitude, longitude]);
          reverseGeocode(latitude, longitude, onLocationSelect, setIsDetecting);
        },
        (err) => {
          console.error(err);
          setIsDetecting(false);
          alert("Location detection failed. Please select manually.");
        }
      );
    }
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#FACD15]" />
          Precise Deployment Hub
        </label>
        <button 
          type="button"
          onClick={handleDetect}
          disabled={isDetecting}
          className="flex items-center gap-2 bg-[#FACD15] text-[#1F3F34] px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#FACD15]/20 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50"
        >
          {isDetecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
          Locate Me
        </button>
      </div>

      <div className="h-72 rounded-[2.5rem] overflow-hidden border-2 border-[#EFEEE9] relative shadow-inner group">
        <MapContainer 
          center={markerPos} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPos} />
          <MapEvents onLocationSelect={onLocationSelect} setMarkerPos={setMarkerPos} setIsDetecting={setIsDetecting} />
          <ChangeView center={markerPos} />
        </MapContainer>
        
        {isDetecting && (
            <div className="absolute inset-0 bg-[#F5F4EF]/60 backdrop-blur-[4px] z-1000 flex items-center justify-center">
                <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-4 animate-bounce">
                    <Loader2 className="w-6 h-6 text-[#1F3F34] animate-spin opacity-20" />
                    <span className="text-[10px] font-black text-[#1F3F34] uppercase tracking-[0.2em]">Triangulating...</span>
                </div>
            </div>
        )}
      </div>
      <p className="text-[9px] font-black text-[#1F3F34]/30 uppercase tracking-widest italic px-4">
        Deploy the tactical pin or use auto-triangulation for high-precision mission targeting.
      </p>
    </div>
  );
}
