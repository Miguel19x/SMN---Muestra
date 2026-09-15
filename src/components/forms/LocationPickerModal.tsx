import { useState } from 'react';
import { MapPin, Search, Check, X, Building2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LocationPreset {
  name: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
}

const VENEZUELA_PRESETS: LocationPreset[] = [
  {
    name: "Almacén Central La Yaguara",
    state: "Distrito Capital",
    address: "Zona Industrial La Yaguara, Calle 3, Galpón 12, Caracas",
    lat: 10.4852,
    lng: -66.9748
  },
  {
    name: "Sede Central Los Cortijos",
    state: "Miranda",
    address: "Av. Francisco de Miranda, Edif. DataTracker, Los Cortijos, Caracas",
    lat: 10.4891,
    lng: -66.8285
  },
  {
    name: "Terminal Logístico Puerto Cabello",
    state: "Carabobo",
    address: "Zona Portuaria, Muelle 22, Puerto Cabello",
    lat: 10.4833,
    lng: -68.0167
  },
  {
    name: "Depósito Regional Valencia",
    state: "Carabobo",
    address: "Zona Industrial Castillito, Parcela 45, Valencia",
    lat: 10.1802,
    lng: -67.9542
  },
  {
    name: "Centro Logístico Maracaibo",
    state: "Zulia",
    address: "Av. 5 de Julio con Calle 72, Sector Bella Vista, Maracaibo",
    lat: 10.6558,
    lng: -71.6292
  },
  {
    name: "Hangar Técnico Charallave",
    state: "Miranda",
    address: "Aeropuerto Caracas Óscar Machado Zuloaga, Charallave",
    lat: 10.2882,
    lng: -66.8155
  },
  {
    name: "Planta Industrial Barquisimeto",
    state: "Lara",
    address: "Zona Industrial III, Carrera 5 entre Calles 22 y 23, Barquisimeto",
    lat: 10.0647,
    lng: -69.3570
  },
  {
    name: "Sede Tecnológica Mérida",
    state: "Mérida",
    address: "Av. Las Américas, Complejo Científico La Hechicera, Mérida",
    lat: 8.6295,
    lng: -71.1578
  },
  {
    name: "Almacén Minero Puerto Ordaz",
    state: "Bolívar",
    address: "Zona Industrial Unare II, Av. Guayana, Puerto Ordaz",
    lat: 8.2934,
    lng: -62.7486
  }
];

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (formattedAddress: string, state?: string) => void;
  currentValue?: string;
  title?: string;
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  currentValue = '',
  title = "Seleccionar Ubicación en Mapa"
}: LocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLat, setSelectedLat] = useState<number>(10.4806);
  const [selectedLng, setSelectedLng] = useState<number>(-66.9036);
  const [selectedAddress, setSelectedAddress] = useState(currentValue || 'Caracas, Distrito Capital');
  const [selectedState, setSelectedState] = useState('Distrito Capital');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: LocationPreset) => {
    setSelectedLat(preset.lat);
    setSelectedLng(preset.lng);
    setSelectedAddress(preset.address);
    setSelectedState(preset.state);
  };

  const handleConfirm = () => {
    // Sanitizar dirección
    const sanitized = selectedAddress.replace(/[<>]/g, '').trim();
    onSelectLocation(sanitized, selectedState);
    onClose();
  };

  // Filtrar presets por búsqueda
  const filteredPresets = VENEZUELA_PRESETS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{title}</h3>
              <p className="text-xs text-slate-400">Establece coordenadas y dirección física geolocalizada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar almacén, ciudad o centro logístico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Interactive Map Visual Simulation with OpenStreetMap Embed */}
          <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-inner bg-slate-950 h-64 sm:h-72">
            <iframe
              title="Mapa de Ubicación"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedLng - 0.05}%2C${selectedLat - 0.04}%2C${selectedLng + 0.05}%2C${selectedLat + 0.04}&layer=mapnik&marker=${selectedLat}%2C${selectedLng}`}
              className="w-full h-full opacity-90 contrast-105 border-0"
              loading="lazy"
            />
            
            {/* Map Overlay info badge */}
            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-slate-200 shadow-md flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>Lat: {selectedLat.toFixed(4)}, Lng: {selectedLng.toFixed(4)}</span>
            </div>

            {/* Quick State Badge */}
            <div className="absolute bottom-3 right-3 bg-blue-600/90 backdrop-blur-md border border-blue-400/30 px-3 py-1 rounded-md text-xs font-semibold text-white shadow-md">
              {selectedState}
            </div>
          </div>

          {/* Address Editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Dirección Seleccionada (Editable):
            </label>
            <Input
              type="text"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="bg-slate-950/80 border-slate-700 text-white font-medium"
              placeholder="Escriba o ajuste la dirección..."
            />
          </div>

          {/* Hubs / Presets List */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" /> Centros y Almacenes Predefinidos:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-2.5 rounded-lg border transition-all duration-150 flex items-start gap-2.5 ${
                    selectedAddress === preset.address
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-white">{preset.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{preset.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/25"
          >
            <Check className="w-4 h-4" />
            Confirmar Ubicación
          </Button>
        </div>

      </div>
    </div>
  );
}
