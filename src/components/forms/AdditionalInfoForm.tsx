import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { cn } from "@/lib/utils"
import type { DesaparecidoData, InfoFormProps, TranslationKey } from '../type/types'
import { useLanguage } from '../additionals/scripts/i18n'

const estadosVenezuela = [
  "Distrito Capital", "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
  "Carabobo", "Cojedes", "Delta Amacuro", "Falcón", "Guárico", "Lara", "Mérida",
  "Miranda", "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo",
  "Vargas", "Yaracuy", "Zulia"
]

export default function AdditionalInfoForm({ formData, errors, onChange }: InfoFormProps) {
  const { translate } = useLanguage();

  const renderInput = (name: keyof DesaparecidoData, translationKey: TranslationKey, type: string = "text", min?: string, max?: string) => (
    <div key={name}>
      <Label htmlFor={name}>{translate(translationKey)}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        value={formData[name] || ''}
        onChange={(e) => {
          if (name === 'edad') {
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

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
        <div className="sm:col-span-1">
          {renderInput("edad", "Form-A", "text", "0", "125")}
        </div>
        <div className="sm:col-span-1 md:col-span-2">
          <Label htmlFor="sexo">{translate('Form-G')}</Label>
          <NativeSelect
            name="sexo"
            id="sexo"
            value={formData.sexo || 'Masculino'} // ✅ Controlled component
            onChange={(e) => onChange('sexo', e.target.value)}
            placeholder={translate('Form-GS')}
            className="w-full"
          >
            <option value="Masculino">{translate('Form-GS-M')}</option>
            <option value="Femenino">{translate('Form-GS-F')}</option>
          </NativeSelect>
        </div>
        <div className="sm:col-span-2 md:col-span-3">
          <Label htmlFor="estado">{translate('Form-L')}</Label>
          <NativeSelect
            name="estado"
            id="estado"
            value={formData.estado || ''} // ✅ Controlled component
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
        {renderInput("profesion", "Form-P")}
        {renderInput("etnia", "Form-E")}
      </div>

      {renderInput("condicion_de_salud", "Form-HC")}
      {renderInput("discapacidad", "Form-D")}
      {renderInput("lugar_de_confinamiento", "Form-PlaceC")}
      {renderInput("lugar_de_desaparicion", "Form-LD")}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderInput("fecha", "Form-DD", "date", "2010-01-01", currentDate)}
        {renderInput("hora", "Form-DT", "time")}
      </div>
    </>
  )
}