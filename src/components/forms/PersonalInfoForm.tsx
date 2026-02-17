import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { cn } from "@/lib/utils"
import type { InfoFormProps } from '../type/types'
import { useLanguage } from '../additionals/scripts/i18n'

export default function PersonalInfoForm({ formData, errors, onChange }: InfoFormProps) {
  const { translate } = useLanguage();
  const [codigoInput, setCodigoInput] = useState(formData.codigo || '')

  // ✅ Sync local state when formData.codigo changes (for form reset)
  useEffect(() => {
    setCodigoInput(formData.codigo || '');
  }, [formData.codigo]);

  useEffect(() => {
    if (formData.origen === 'N') {
      onChange('pais_origen', 'Nacional')
    } else if (formData.origen === 'I' && formData.pais_origen === 'Nacional') {
      onChange('pais_origen', '')
    }
  }, [formData.origen])

  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    if (formData.origen === 'N') {
      // National codes: alphanumeric with dashes
      value = value.replace(/[^A-Za-z0-9\-]/g, '').toUpperCase()
      if (value.length > 20) value = value.slice(0, 20)
    } else {
      // Imported codes: flexible format
      value = value.replace(/[^A-Za-z0-9\-_.]/g, '')
    }

    setCodigoInput(value)
    onChange('codigo', value)
  }

  return (
    <>
      <div>
        <Label htmlFor="nombre">{translate('Form-Name')}</Label>
        <Input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={(e) => onChange('nombre', e.target.value)}
          required
          className={cn(errors.nombre && "border-red-500")}
          aria-invalid={errors.nombre ? "true" : "false"}
          aria-describedby="nombre-error"
        />
        {errors.nombre && (
          <p id="nombre-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.nombre}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="codigo">{translate('Form-ID')}</Label>
          <div className="flex">
            <NativeSelect
              name="origen"
              id="origen"
              value={formData.origen}
              onChange={(e) => onChange('origen', e.target.value)}
              className="w-[60px]"
            >
              <option value="N">N</option>
              <option value="I">I</option>
            </NativeSelect>
            <Input
              type="text"
              name="codigo"
              value={codigoInput}
              onChange={handleCodigoChange}
              className={cn("flex-grow ml-2", errors.codigo && "border-red-500")}
              aria-invalid={errors.codigo ? "true" : "false"}
              aria-describedby="codigo-error"
              placeholder="ABC-12345"
            />
          </div>
          {errors.codigo && (
            <p id="codigo-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.codigo}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="pais_origen">{translate('Form-N')}</Label>
          <Input
            type="text"
            id="pais_origen"
            name="pais_origen"
            value={formData.pais_origen || ''}
            onChange={(e) => onChange('pais_origen', e.target.value)}
            className={cn(errors.pais_origen && "border-red-500")}
            aria-invalid={errors.pais_origen ? "true" : "false"}
            aria-describedby="pais_origen-error"
            disabled={formData.origen === 'N'}
          />
          {errors.pais_origen && (
            <p id="pais_origen-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.pais_origen}
            </p>
          )}
        </div>
      </div>
    </>
  )
}