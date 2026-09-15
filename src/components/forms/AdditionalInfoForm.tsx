import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"
import type { ObjetoData, InfoFormProps, TranslationKey } from '../type/types'
import { useLanguage } from '../additionals/scripts/i18n'
import LocationPickerModal from "./LocationPickerModal"

const estadosVenezuela = [
  "Distrito Capital", "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
  "Carabobo", "Cojedes", "Delta Amacuro", "Falcón", "Guárico", "Lara", "Mérida",
  "Miranda", "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo",
  "Vargas", "Yaracuy", "Zulia"
]

const CATEGORIAS = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D'];
const CLASIFICACIONES = ['Clase A', 'Clase B', 'Clase C', 'Clase D'];

/**
 * ✅ Tag Pill Component — clickable visual tags instead of boring dropdowns
 */
function TagPills({ options, selected, onChange, label }: {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 mt-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
              "hover:scale-105 active:scale-95",
              selected === option
                ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25"
                : "bg-gray-800/50 text-gray-300 border-gray-600/50 hover:border-blue-400/50 hover:text-white"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function AdditionalInfoForm({ formData, errors, onChange }: InfoFormProps) {
  const { translate } = useLanguage();

  const renderInput = (name: keyof ObjetoData, translationKey: TranslationKey, type: string = "text", min?: string, max?: string) => (
    <div key={name}>
      <Label htmlFor={name}>{translate(translationKey)}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        value={formData[name] || ''}
        onChange={(e) => {
          if (name === 'antiguedad') {
            const value = e.target.value.replace(/\D/g, '');
            onChange(name, value);
          } else {
            onChange(name, e.target.value);
          }
        }}
        className={cn(errors[name] && "border-red-500")}
        aria-invalid={errors[name] ? "true" : "false"}
        aria-describedby={`${name}-error`}
        min={min}
        max={max}
      />
      {errors[name] && (
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1" role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  )

  const [locationModalTarget, setLocationModalTarget] = useState<'ubicacion_actual' | 'ultimo_lugar_conocido' | null>(null);

  const handleLocationSelected = (address: string, state?: string) => {
    if (locationModalTarget) {
      onChange(locationModalTarget, address);
      if (state && (!formData.estado || formData.estado === '')) {
        onChange('estado', state);
      }
    }
  };

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
        <div className="sm:col-span-1">
          {renderInput("antiguedad", "Form-A", "text", "0", "200")}
        </div>
        <div className="sm:col-span-1 md:col-span-2">
          <TagPills
            options={CATEGORIAS}
            selected={formData.categoria || ''}
            onChange={(val) => onChange('categoria', val)}
            label={translate('Form-G')}
          />
        </div>
        <div className="sm:col-span-2 md:col-span-3">
          <Label htmlFor="estado">{translate('Form-L')}</Label>
          <NativeSelect
            name="estado"
            id="estado"
            value={formData.estado || ''}
            onChange={(e) => onChange('estado', e.target.value)}
            placeholder={translate('Form-LS')}
            className="w-full"
          >
            <option value="">Seleccione un estado</option>
            {estadosVenezuela.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderInput("tipo_objeto", "Form-P")}
        <TagPills
          options={CLASIFICACIONES}
          selected={formData.clasificacion || ''}
          onChange={(val) => onChange('clasificacion', val)}
          label={translate('Form-E')}
        />
      </div>

      {renderInput("condicion", "Form-HC")}
      {renderInput("estado_conservacion", "Form-D")}

      {/* Ubicación Actual con Selector de Mapa */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="ubicacion_actual">{translate('Form-PlaceC')}</Label>
          <button
            type="button"
            onClick={() => setLocationModalTarget('ubicacion_actual')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" /> Seleccionar en Mapa
          </button>
        </div>
        <div className="relative flex items-center">
          <Input
            type="text"
            id="ubicacion_actual"
            name="ubicacion_actual"
            value={formData.ubicacion_actual || ''}
            onChange={(e) => onChange('ubicacion_actual', e.target.value)}
            className={cn("pr-24", errors.ubicacion_actual && "border-red-500")}
            placeholder="Ej: Almacén Central, Galpón 4, Caracas"
          />
          <button
            type="button"
            onClick={() => setLocationModalTarget('ubicacion_actual')}
            className="absolute right-1.5 px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs rounded border border-blue-500/30 flex items-center gap-1 transition-all"
          >
            <MapPin className="w-3 h-3" /> Mapa
          </button>
        </div>
        {errors.ubicacion_actual && (
          <p className="text-red-500 text-sm mt-1">{errors.ubicacion_actual}</p>
        )}
      </div>

      {/* Último Lugar Conocido con Selector de Mapa */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="ultimo_lugar_conocido">{translate('Form-LD')}</Label>
          <button
            type="button"
            onClick={() => setLocationModalTarget('ultimo_lugar_conocido')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" /> Seleccionar en Mapa
          </button>
        </div>
        <div className="relative flex items-center">
          <Input
            type="text"
            id="ultimo_lugar_conocido"
            name="ultimo_lugar_conocido"
            value={formData.ultimo_lugar_conocido || ''}
            onChange={(e) => onChange('ultimo_lugar_conocido', e.target.value)}
            className={cn("pr-24", errors.ultimo_lugar_conocido && "border-red-500")}
            placeholder="Ej: Sede Puerto Cabello, Muelle 12"
          />
          <button
            type="button"
            onClick={() => setLocationModalTarget('ultimo_lugar_conocido')}
            className="absolute right-1.5 px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs rounded border border-blue-500/30 flex items-center gap-1 transition-all"
          >
            <MapPin className="w-3 h-3" /> Mapa
          </button>
        </div>
        {errors.ultimo_lugar_conocido && (
          <p className="text-red-500 text-sm mt-1">{errors.ultimo_lugar_conocido}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderInput("fecha_registro", "Form-DD", "date", "2010-01-01", currentDate)}
        {renderInput("hora_registro", "Form-DT", "time")}
      </div>

      {/* Modal de Mapa Interactivo */}
      <LocationPickerModal
        isOpen={locationModalTarget !== null}
        onClose={() => setLocationModalTarget(null)}
        onSelectLocation={handleLocationSelected}
        currentValue={locationModalTarget ? (formData[locationModalTarget] || '') : ''}
        title={locationModalTarget === 'ubicacion_actual' ? "Ubicación Actual en Mapa" : "Último Lugar Conocido en Mapa"}
      />
    </>
  )
}