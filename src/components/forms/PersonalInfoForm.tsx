import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { cn } from "@/lib/utils"
import type { InfoFormProps } from '../type/types'
import { useLanguage } from '../additionals/scripts/i18n'

export default function PersonalInfoForm({ formData, errors, onChange }: InfoFormProps) {
  const { translate } = useLanguage();
  const [cedulaInput, setCedulaInput] = useState(formData.cedula || '')

  // ✅ Sync local state when formData.cedula changes (for form reset)
  useEffect(() => {
    setCedulaInput(formData.cedula || '');
  }, [formData.cedula]);

  useEffect(() => {
    if (formData.extranjero === 'V') {
      onChange('nacionalidad', 'Nacional')
    } else if (formData.extranjero === 'E' && formData.nacionalidad === 'Nacional') {
      onChange('nacionalidad', '')
    }
  }, [formData.extranjero])

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\./g, '')

    if (formData.extranjero === 'V') {
      value = value.replace(/\D/g, '')
      if (value.length > 8) value = value.slice(0, 8)

      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    setCedulaInput(value)
    onChange('cedula', value)
  }

  const handleCedulaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (formData.extranjero === 'V' && e.key === '.') {
      e.preventDefault()
    }
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
          <Label htmlFor="cedula">{translate('Form-ID')}</Label>
          <div className="flex">
            <NativeSelect
              name="extranjero"
              id="extranjero"
              value={formData.extranjero}
              onChange={(e) => onChange('extranjero', e.target.value)}
              className="w-[60px]"
            >
              <option value="V">V</option>
              <option value="E">E</option>
            </NativeSelect>
            <Input
              type="text"
              name="cedula"
              value={cedulaInput}
              onChange={handleCedulaChange}
              onKeyDown={handleCedulaKeyDown}
              className={cn("flex-grow ml-2", errors.cedula && "border-red-500")}
              aria-invalid={errors.cedula ? "true" : "false"}
              aria-describedby="cedula-error"
            />
          </div>
          {errors.cedula && (
            <p id="cedula-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.cedula}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="nacionalidad">{translate('Form-N')}</Label>
          <Input
            type="text"
            id="nacionalidad"
            name="nacionalidad"
            value={formData.nacionalidad || ''}
            onChange={(e) => onChange('nacionalidad', e.target.value)}
            className={cn(errors.nacionalidad && "border-red-500")}
            aria-invalid={errors.nacionalidad ? "true" : "false"}
            aria-describedby="nacionalidad-error"
            disabled={formData.extranjero === 'V'}
          />
          {errors.nacionalidad && (
            <p id="nacionalidad-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.nacionalidad}
            </p>
          )}
        </div>
      </div>
    </>
  )
}