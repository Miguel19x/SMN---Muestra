import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import PersonalInfoForm from './forms/PersonalInfoForm'
import AdditionalInfoForm from './forms/AdditionalInfoForm'
import ImageUpload from './forms/ImageUpload'
import type { ObjetoData, ErrorState } from './type/types'
import { useFormValidation } from './forms/validation'
import { LanguageProvider, useTranslation } from './additionals/scripts/i18n';

function UploadEngineContent() {
  const { t: translate } = useTranslation();
  const { validateForm } = useFormValidation();
  const [formData, setFormData] = useState<ObjetoData>({
    origen: 'N',
    codigo: '',
    nombre: '',
    pais_origen: 'Nacional',
    estado_registro: 'pendiente',
    etiqueta: 'blue',
    imagen: '',
    estado: '',
    categoria: '',
    antiguedad: undefined,
    fecha_registro: '',
    hora_registro: '',
    tipo_objeto: '',
    clasificacion: '',
    condicion: '',
    estado_conservacion: '',
    ubicacion_actual: '',
    ultimo_lugar_conocido: '',
  })
  const [errors, setErrors] = useState<ErrorState>({})
  const [isFormValid, setIsFormValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetImage, setResetImage] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { toast } = useToast()
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  const handleChange = useCallback((name: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      if (name === 'origen') {
        newData.pais_origen = value === 'N' ? 'Nacional' : ''
      }
      return newData
    })
  }, [])

  const onCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  useEffect(() => {
    const newErrors = validateForm(formData)
    setErrors(newErrors)
    setIsFormValid(Object.keys(newErrors).length === 0 && formData.nombre.trim() !== '')
  }, [formData, validateForm])

  const siteKey = import.meta.env.PUBLIC_CLOUDFLARE_SITE_KEY;

  useEffect(() => {
    // If no Turnstile sitekey is provided (demo / local dev), automatically bypass captcha
    if (!siteKey) {
      setCaptchaToken('demo-bypass-token');
      return;
    }

    let intervalId: ReturnType<typeof setInterval>;

    const initTurnstile = () => {
      if (typeof window !== 'undefined' && window.turnstile && turnstileRef.current) {
        try {
          if (turnstileWidgetId.current) {
            window.turnstile.remove(turnstileWidgetId.current);
          }
          turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            callback: onCaptchaVerify,
          });
          clearInterval(intervalId);
        } catch (error) {
          console.warn('Turnstile render warning:', error);
          setCaptchaToken('demo-bypass-token');
          clearInterval(intervalId);
        }
      }
    };

    initTurnstile();

    if (!turnstileWidgetId.current) {
      intervalId = setInterval(initTurnstile, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId as NodeJS.Timeout);
      if (turnstileWidgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
        } catch {
          // ignore cleanup error
        }
      }
    };
  }, [siteKey, onCaptchaVerify]);

  const handleSubmit = useCallback(async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!isFormValid || isSubmitting) return

    setIsSubmitting(true)
    const effectiveCaptcha = captchaToken || 'demo-bypass-token'

    try {
      let finalImageUrl = ''
      if (formData.imagen) {
        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Token': import.meta.env.PUBLIC_APP_TOKEN
          },
          body: JSON.stringify({ key: formData.imagen }),
        })
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image to R2')
        }
        const { url } = await uploadResponse.json()
        finalImageUrl = url
      }

      const dataToSubmit = {
        ...formData,
        imagen: finalImageUrl,
        captchaToken: effectiveCaptcha,
      }

      const response = await fetch('/api/inventario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Token': import.meta.env.PUBLIC_APP_TOKEN
        },
        body: JSON.stringify(dataToSubmit),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error desconocido')
      }

      const result = await response.json()

      toast({ title: "Éxito", description: result.message || "Información subida correctamente" })
      // ✅ Reset ALL form fields
      setFormData({
        origen: 'N',
        codigo: '',
        nombre: '',
        pais_origen: 'Nacional',
        etiqueta: 'blue',
        estado_registro: 'pendiente',
        imagen: '',
        estado: '',
        categoria: '',
        antiguedad: undefined,
        fecha_registro: '',
        hora_registro: '',
        tipo_objeto: '',
        clasificacion: '',
        condicion: '',
        estado_conservacion: '',
        ubicacion_actual: '',
        ultimo_lugar_conocido: '',
      })
      setErrors({})
      setResetImage(prev => !prev)
      setCaptchaToken(siteKey ? null : 'demo-bypass-token')

      if (formData.imagen) {
        await fetch('/api/delete-cached-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: formData.imagen }),
        })
      }

      // Reset Turnstile
      if (siteKey && window.turnstile && turnstileWidgetId.current) {
        try {
          window.turnstile.reset(turnstileWidgetId.current);
        } catch {
          // ignore reset error
        }
      }
    } catch (error) {
      console.error('Error al subir la información:', error)
      const errorMessage = error instanceof Error ? error.message : "Hubo un problema al subir la información. Por favor, intente de nuevo.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, isFormValid, captchaToken, toast, siteKey])

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl mx-auto px-4 sm:px-6 md:px-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{translate('Title-3')}</h2>
      <PersonalInfoForm formData={formData} errors={errors} onChange={handleChange} />
      <AdditionalInfoForm formData={formData} errors={errors} onChange={handleChange} />
      <ImageUpload onChange={handleChange} resetImage={resetImage} />
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
        {siteKey ? (
          <div ref={turnstileRef} className="w-full h-[50px]"></div>
        ) : (
          <div className="w-full py-2 px-3 bg-muted/40 rounded border border-border/40 text-xs text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block shrink-0"></span>
            <span>Modo Demo: Verificación de seguridad automática activada</span>
          </div>
        )}
        <Button
          type="submit"
          className="bg-blue-800 hover:bg-blue-700 w-full sm:w-auto text-white mt-4 font-semibold px-6 shadow-md transition-all"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? translate('Process1') : translate('B-Upload')}
        </Button>
      </div>
    </form>
  )
}

export default function UploadEngine() {
  return (
    <LanguageProvider>
      <UploadEngineContent />
    </LanguageProvider>
  );
}