import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchDesaparecidoDetails } from '../../lib/api/databaseOperations'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFormValidation } from '../forms/validation'
import ImageUpload from '../forms/ImageUpload'
import type { ExpandedRowPanelProps, ObjetoData, TranslationKey } from '../type/types'
import { useTranslation } from '../additionals/scripts/i18n'

export default function Component({
  item,
  getAntiguedadStage,
  getCondicionEstado,
  renderValue,
  isEditing,
  editedData,
  onInputChange,
  errors,
  setErrors,
  onImageDelete
}: ExpandedRowPanelProps) {
  const { t } = useTranslation();
  const { validateForm } = useFormValidation();
  const [localDetails, setLocalDetails] = useState<ObjetoData | null>(null)
  const [resetImage, setResetImage] = useState(false)

  const { data: details, isLoading, error } = useQuery({
    queryKey: ['objeto', item.id],
    queryFn: () => fetchDesaparecidoDetails(item.id as string),
    enabled: !!item.id,
    staleTime: 0,
  })

  useEffect(() => {
    if (details) {
      setLocalDetails(details)
    }
  }, [details])

  useEffect(() => {
    if (editedData) {
      setLocalDetails(prevDetails => ({ ...prevDetails, ...editedData }))
    }
  }, [editedData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onInputChange(e)

    const newErrors = validateForm({ ...localDetails, [name]: value } as ObjetoData)
    setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }))
  }

  const handleSelectChange = (name: keyof ObjetoData, value: string) => {
    onInputChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>)
  }

  const handleImageChange = async (name: string, value: string | null) => {
    if (value) {
      try {
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: value }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload image to R2');
        }

        const { url } = await response.json();
        onInputChange({ target: { name, value: url } } as React.ChangeEvent<HTMLInputElement>);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      onInputChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
    }
  }

  const handleRemoveImage = () => {
    if (editedData?.imagen) {
      onImageDelete(editedData.imagen)
    }
    handleImageChange('imagen', null)
    setResetImage(true)
  }

  const renderEditableField = (name: keyof ObjetoData, label: TranslationKey, type: string = "text", value?: string | number, additionalInfo?: string) => {
    if (isEditing) {
      if (name === 'categoria') {
        return (
          <div className="space-y-1">
            <Label htmlFor={name} className="dark:text-gray-200">{t(label)} {additionalInfo && `(${additionalInfo})`}</Label>
            <Select name={name} onValueChange={(value) => handleSelectChange(name, value)} value={editedData?.[name] as string}>
              <SelectTrigger id={name} className="w-full dark:bg-gray-700 dark:text-gray-200">
                <SelectValue placeholder={t('Form-GS')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tipo A">Tipo A</SelectItem>
                <SelectItem value="Tipo B">Tipo B</SelectItem>
                <SelectItem value="Tipo C">Tipo C</SelectItem>
                <SelectItem value="Tipo D">Tipo D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      } else if (name === 'imagen') {
        return (
          <div className="space-y-2">
            <Label htmlFor={name} className="dark:text-gray-200">{t(label)}</Label>
            {editedData?.imagen ? (
              <div className="flex items-center space-x-2">
                <img src={editedData.imagen} alt="Imagen actual" className="w-20 h-20 object-cover rounded" />
                <Button onClick={handleRemoveImage} variant="destructive">{t('B-Delete')}</Button>
              </div>
            ) : (
              <ImageUpload onChange={handleImageChange} resetImage={resetImage} />
            )}
          </div>
        )
      } else {
        return (
          <div className="space-y-1">
            <Label htmlFor={name} className="dark:text-gray-200">{t(label)} {additionalInfo && `(${additionalInfo})`}</Label>
            <Input
              type={type}
              id={name}
              name={name}
              value={editedData?.[name] || ''}
              onChange={handleInputChange}
              className={cn(errors[name] && "border-red-500", "dark:bg-gray-700 dark:text-gray-200")}
              aria-invalid={errors[name] ? "true" : "false"}
              aria-describedby={`${name}-error`}
              max={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
            />
            {errors[name] && (
              <p id={`${name}-error`} className="text-red-500 text-sm mt-1" role="alert">
                {errors[name]}
              </p>
            )}
          </div>
        )
      }
    }
    return (
      <div className="space-y-2">
        <span className="font-medium dark:text-gray-200">{t(label)}:</span>
        {name === 'imagen' && value ? (
          <img src={value as string} alt={t(label)} className="w-300 h-300 object-cover rounded" />
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{renderValue(value?.toString())} {additionalInfo && `(${additionalInfo})`}</p>
        )}
      </div>
    )
  }

  const antiguedadStage = localDetails?.antiguedad !== undefined ? getAntiguedadStage(localDetails.antiguedad) : 'N/A'
  const condicionEstado = localDetails?.antiguedad !== undefined ? getCondicionEstado(localDetails.antiguedad) : 'N/A'

  if (isLoading) {
    return <div className="p-4 text-center">{t('Process2')}</div>
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{t('Error')}</div>
  }

  if (!localDetails) {
    return <div className="p-4 text-center">{t('Error')}</div>
  }

  return (
    <div className="grid grid-cols-3 gap-4 dark:bg-gray-800 dark:text-gray-200">
      <div className="space-y-4">
        {renderEditableField('categoria', 'Form-G', 'text', editedData?.categoria || localDetails.categoria, t(antiguedadStage as TranslationKey))}
        {renderEditableField('antiguedad', 'Form-A', 'number', editedData?.antiguedad || localDetails.antiguedad, t(condicionEstado as TranslationKey))}
        {renderEditableField('tipo_objeto', 'Form-P', 'text', editedData?.tipo_objeto || localDetails.tipo_objeto)}
        {renderEditableField('pais_origen', 'Form-N', 'text', editedData?.pais_origen || localDetails.pais_origen || (localDetails.origen === 'N' ? t('Form-NV') : 'N/A'))}
        {renderEditableField('condicion', 'Form-HC', 'text', editedData?.condicion || localDetails.condicion)}
        {renderEditableField('estado_conservacion', 'Form-D', 'text', editedData?.estado_conservacion || localDetails.estado_conservacion)}
      </div>
      <div className="space-y-4">
        {renderEditableField('ubicacion_actual', 'Form-PlaceC', 'text', editedData?.ubicacion_actual || localDetails.ubicacion_actual)}
        {renderEditableField('ultimo_lugar_conocido', 'Form-LD', 'text', editedData?.ultimo_lugar_conocido || localDetails.ultimo_lugar_conocido)}
        {renderEditableField('fecha_registro', 'Form-DD', 'date', editedData?.fecha_registro || localDetails.fecha_registro)}
        {renderEditableField('hora_registro', 'Form-DT', 'time', editedData?.hora_registro || localDetails.hora_registro)}
        {renderEditableField('clasificacion', 'Form-E', 'text', editedData?.clasificacion || localDetails.clasificacion)}
      </div>
      <div className="flex justify-center items-center">
        {renderEditableField('imagen', 'List-Info-I', 'text', editedData?.imagen || localDetails.imagen)}
      </div>
    </div>
  )
}
