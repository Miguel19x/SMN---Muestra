import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { X } from 'lucide-react'
import type { ImageUploadProps } from '../type/types'
import { useLanguage } from '../additionals/scripts/i18n'

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
]

export default function ImageUpload({ onChange, resetImage }: ImageUploadProps & { resetImage: boolean }) {
  const { translate } = useLanguage();
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const MAX_FILE_SIZE = 6 * 1024 * 1024 // 6MB in bytes

  const handleFile = useCallback(async (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Error",
        description: "Solo se permiten formatos de imagen (JPEG o PNG)",
        variant: "destructive",
      })
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "El tamaño máximo de la imagen es de 6MB",
        variant: "destructive",
      })
      return
    }

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Data = reader.result as string

        const response = await fetch('/api/cache-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: {
              name: file.name,
              type: file.type,
              size: file.size,
              data: base64Data,
            },
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to cache image')
        }

        const { key } = await response.json()

        setPreviewUrl(base64Data)
        onChange('imagen', key)
        setFileName(file.name)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error caching image:', error)
      toast({
        title: "Error",
        description: "Failed to cache image.",
        variant: "destructive",
      })
    }
  }, [onChange, toast])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleRemoveFile = useCallback(() => {
    setFileName(null)
    setPreviewUrl(null)
    onChange('imagen', null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  useEffect(() => {
    if (resetImage) {
      handleRemoveFile()
    }
  }, [resetImage, handleRemoveFile])

  return (
    <div className="space-y-2">
      <Label htmlFor="imagen">{translate('Form-I')}</Label>
      <div 
        className={`flex items-center justify-center border-2 border-dashed rounded-lg h-32 cursor-pointer ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {previewUrl ? (
          <div className="flex items-center">
            <img src={previewUrl} alt="Vista previa" className="w-20 h-20 object-cover rounded mr-2" />
            <span className="mr-2">{fileName}</span>
            <button onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }} className="text-red-500">
              <X size={20} />
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            <span className="hidden md:inline">{translate('Form-IDrag')}</span>
            <span className="md:hidden">{translate('Form-IClick')}</span>
          </p>
        )}
      </div>
      <Input 
        type="file" 
        id="imagen"
        name="imagen" 
        onChange={handleInputChange}
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="hidden"
        ref={fileInputRef}
      />
    </div>
  )
}