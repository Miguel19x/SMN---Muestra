import React, { useState, useCallback, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, ChevronUp, Edit, Check, X, Save, Trash2 } from 'lucide-react'
import { updateDesaparecido } from '../../lib/api/databaseOperations'
import { useFormValidation } from '../forms/validation'
import { motion, AnimatePresence } from 'framer-motion'
import type { PanelTableProps, DesaparecidoData, ErrorState } from '../type/types'
import { useTranslation } from '../additionals/scripts/i18n'

const ExpandedRowPanel = React.lazy(() => import('./ExpandedRowPanel'))

const estadosVenezuela = [
  "Distrito Capital", "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
  "Carabobo", "Cojedes", "Delta Amacuro", "Falcón", "Guárico", "Lara", "Mérida",
  "Miranda", "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo",
  "Vargas", "Yaracuy", "Zulia"
]

export default function PanelTable({
  data,
  renderValue,
  getAgeStage,
  getLegalCondition,
  refetch,
  onAccept,
  onReject,
  filterTag
}: PanelTableProps) {
  const { t } = useTranslation();
  const { validateForm } = useFormValidation();
  const [localData, setLocalData] = useState<DesaparecidoData[]>(data)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedData, setEditedData] = useState<DesaparecidoData | null>(null)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [errors, setErrors] = useState<ErrorState>({})
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleEdit = useCallback((item: DesaparecidoData) => {
    if (item.id) {
      setEditingId(item.id)
      setEditedData(item)
      setErrors({})
    }
  }, [])

  const handleSave = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!editedData || !editedData._id) return

    const formErrors = validateForm(editedData)
    if (!editedData.nombre || formErrors.nombre) {
      setErrors({ ...formErrors, nombre: formErrors.nombre || "El nombre es obligatorio" })
      toast({
        title: "Error",
        description: "El nombre es obligatorio y debe ser válido.",
        variant: "destructive",
      })
      return
    }

    try {
      const dataToUpdate: Partial<DesaparecidoData> = { ...editedData }

      if (dataToUpdate.cedula === '') {
        delete dataToUpdate.cedula
      }

      dataToUpdate.extranjero = dataToUpdate.extranjero || 'V'

      await updateDesaparecido(editedData._id, { ...dataToUpdate, extranjero: dataToUpdate.extranjero || 'V' } as DesaparecidoData)

      // Delete images from R2 after successful update
      for (const imageUrl of imagesToDelete) {
        await deleteImageFromR2(imageUrl)
      }

      toast({ title: "Éxito", description: "Información actualizada correctamente" })
      setLocalData(prevData =>
        prevData.map(item => item.id === editedData._id ? { ...item, ...dataToUpdate } : item)
      )
      setEditingId(null)
      setEditedData(null)
      setErrors({})
      setImagesToDelete([])
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema al actualizar la información",
        variant: "destructive",
      })
    }
  }, [editedData, refetch, toast, t, validateForm, imagesToDelete])

  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
    setEditedData(null)
    setErrors({})
  }, [])

  const handleImageDelete = useCallback((imageUrl: string) => {
    setImagesToDelete(prev => [...prev, imageUrl])
  }, [])

  const deleteImageFromR2 = async (imageUrl: string) => {
    try {
      const response = await fetch('/api/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image from R2');
      }
    } catch (error) {
      console.error('Error deleting image from R2:', error);
    }
  }

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedData(prev => {
      if (!prev) return null
      const updatedData = { ...prev, [name]: value }
      return updatedData
    })

    if (name === 'nombre') {
      const newErrors = validateForm({ ...editedData, [name]: value } as DesaparecidoData)
      setErrors(prev => ({ ...prev, nombre: newErrors.nombre || '' }))
    }
  }, [editedData, validateForm])

  const handleSelectChange = useCallback((name: keyof DesaparecidoData, value: string) => {
    setEditedData(prev => {
      if (!prev) return null
      const updatedData = {
        ...prev,
        [name]: value,
        ...(name === 'extranjero' ? { nacionalidad: value === 'V' ? t('Form-NV') : '' } : {})
      }
      return updatedData
    })
  }, [t])

  const handleRemoveCedula = useCallback(() => {
    setEditedData(prev => {
      if (!prev) return null
      const { cedula, ...rest } = prev
      return rest
    })
  }, [])

  const toggleRow = (id: string | undefined) => {
    if (id) {
      setExpandedRow(prev => prev === id ? null : id)
    }
  }

  const renderEditableField = (item: DesaparecidoData, name: keyof DesaparecidoData, value: string | undefined) => {
    if (editingId === item.id) {
      if (name === 'extranjero') {
        return (
          <Select name={name} onValueChange={(value) => handleSelectChange(name, value)} value={editedData?.[name] as string}>
            <SelectTrigger className="w-[50px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="V">V</SelectItem>
              <SelectItem value="E">E</SelectItem>
            </SelectContent>
          </Select>
        )
      } else if (name === 'estado') {
        return (
          <Select name={name} onValueChange={(value) => handleSelectChange(name, value)} value={editedData?.[name] as string}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('Form-LS')} />
            </SelectTrigger>
            <SelectContent>
              {estadosVenezuela.map((estado) => (
                <SelectItem key={estado} value={estado}>{estado}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      } else if (name === 'cedula') {
        return (
          <div className="flex items-center space-x-2">
            <Input
              name={name}
              value={editedData?.[name] || ''}
              onChange={handleInputChange}
              className={errors[name] ? "border-red-500" : ""}
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveCedula()
              }}
              className="bg-red-500 hover:bg-red-600 text-white p-2"
              title="Eliminar cédula"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )
      } else {
        return (
          <Input
            name={name}
            value={editedData?.[name] || ''}
            onChange={handleInputChange}
            className={errors[name] ? "border-red-500" : ""}
            onClick={(e) => e.stopPropagation()}
          />
        )
      }
    }
    return renderValue(value)
  }

  const filteredData = filterTag
    ? localData.filter((item) => item.estado_registro === 'pendiente' && item.etiqueta === filterTag)
    : localData;

  return (
    <div className="overflow-x-auto rounded-lg shadow dark:bg-gray-900">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-gray-800">
            <TableHead className="w-[1%]"></TableHead>
            <TableHead className="w-[20%] text-center font-bold dark:text-gray-200">{t('List-Title-ID')}</TableHead>
            <TableHead className="w-[29%] text-center font-bold dark:text-gray-200">{t('List-Title-Name')}</TableHead>
            <TableHead className="w-[20%] text-center font-bold dark:text-gray-200">{t('List-Title-Location')}</TableHead>
            <TableHead className="w-[25%] text-center font-bold dark:text-gray-200">{t('List-Info-Add')}</TableHead>
            <TableHead className="w-[5%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => {
            // Generate the key
            const key = (item.id && typeof item.id === 'string' && item.id.trim() !== '') 
              ? item.id 
              : `row-fallback-${index}`;
            
            // Debug: log if key is empty or suspicious
            if (key === '' || key === null || key === undefined) {
              console.error('CRITICAL: Generated empty/null key at index:', index, 'item:', item);
            }
            
            return (
              <React.Fragment key={key}>
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${editingId === item.id ? 'bg-blue-50 dark:bg-gray-900' : ''
                    } dark:text-gray-200`}
                  onClick={() => toggleRow(item.id)}
                >
                  <TableCell className="text-center">
                    {item.estado_registro === 'pendiente' && item.etiqueta && (
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${item.etiqueta === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'}`}>
                        {item.etiqueta === 'blue' ? t('B-Blue') : t('B-Green')}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {renderEditableField(item, 'extranjero', item.extranjero)}
                      {renderEditableField(item, 'cedula', item.cedula)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {renderEditableField(item, 'nombre', item.nombre)}
                  </TableCell>
                  <TableCell className="text-center">{renderEditableField(item, 'estado', item.estado)}</TableCell>
                  <TableCell className='text-center'>
                    {editingId === item.id ? (
                      <>
                        <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white mr-2">
                          <Save className="w-4 h-4 mr-1 text-center" />
                          {t('B-Save')}
                        </Button>
                        <Button onClick={(e) => { handleCancelEdit(); e.stopPropagation(); }} className="bg-red-500 hover:bg-red-600 text-white">
                          <X className="w-4 h-4 mr-1 text-center" />
                          {t('B-Cancel')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="bg-blue-500 hover:bg-blue-600 text-white mr-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {item.id && item.estado_registro === 'pendiente' && (
                          <>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.id) onAccept(item.id);
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white mr-2"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.id) onReject(item.id);
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(item.id);
                      }}
                      aria-controls={`row-${item.id}`}
                      aria-expanded={expandedRow === item.id}
                      aria-label={t('Info-Details', { name: item.nombre })}
                    >
                      {expandedRow === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </motion.tr>
                <AnimatePresence>
                  {expandedRow === item.id && (
                    <motion.tr
                      key="expanded-row"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell colSpan={6} className="p-0">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner m-2 p-4"
                        >
                          <React.Suspense fallback={<div className="p-4 text-center dark:text-gray-200">{t('Process2')}</div>}>
                            <ExpandedRowPanel
                              item={item}
                              getAgeStage={getAgeStage}
                              getLegalCondition={getLegalCondition}
                              renderValue={renderValue}
                              refetch={refetch}
                              isEditing={editingId === item.id}
                              editedData={editedData}
                              onInputChange={handleInputChange}
                              errors={errors}
                              setErrors={setErrors}
                              onImageDelete={handleImageDelete}
                            />
                          </React.Suspense>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
