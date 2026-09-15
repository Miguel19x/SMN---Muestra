import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { LanguageProvider, useTranslation } from './additionals/scripts/i18n'
import { ShieldCheck } from 'lucide-react'

function LoginFormContent() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [securityPhrase, setSecurityPhrase] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [questionNumber, setQuestionNumber] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [needs2FASetup, setNeeds2FASetup] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const { toast } = useToast()
  const { t } = useTranslation()
  const turnstileRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetId = useRef<string | null>(null)

  const onCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token)
  }, [])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>

    const initTurnstile = () => {
      if (typeof window !== 'undefined' && window.turnstile && turnstileRef.current) {
        if (turnstileWidgetId.current) {
          window.turnstile.remove(turnstileWidgetId.current)
        }
        turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: import.meta.env.PUBLIC_CLOUDFLARE_SITE_KEY,
          callback: onCaptchaVerify,
        })
        clearInterval(intervalId)
      }
    }

    initTurnstile()

    if (!turnstileWidgetId.current) {
      intervalId = setInterval(initTurnstile, 100)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current)
      }
    }
  }, [onCaptchaVerify])

  const handleFirstStep = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!captchaToken) {
      toast({
        title: t('Error'),
        description: "Please complete the captcha",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          'cf-turnstile-response': captchaToken
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('Error'))
      }

      setSecurityQuestion(data.securityQuestion)
      setQuestionNumber(data.questionNumber)
      setStep(2)
    } catch (error) {
      toast({
        title: t('Error'),
        description: error instanceof Error ? error.message : t('Error'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current)
      }
      setCaptchaToken(null)
    }
  }

  const handleSecondStep = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/auth/protected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          securityPhrase,
          questionNumber
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('Error'))
      }

      // Guardar userId para el paso de 2FA
      setUserId(data.userId)

      // Si el usuario tiene 2FA habilitado, ir al paso 3
      if (data.requires2FA) {
        setNeeds2FASetup(!data.totp_enabled)

        // Si necesita configurar 2FA, obtener el QR code
        if (!data.totp_enabled) {
          const setupResponse = await fetch('/api/auth/setup-2fa', {
            method: 'POST',
            credentials: 'include',
          })

          if (setupResponse.ok) {
            const setupData = await setupResponse.json()
            setQrCode(setupData.qrCode)
          }
        }

        setStep(3)
      } else {
        // Si no tiene 2FA obligatorio, redirigir
        window.location.href = '/panel-admin'
      }
    } catch (error) {
      toast({
        title: t('Error'),
        description: error instanceof Error ? error.message : t('Error'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleThirdStep = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: twoFactorCode,
          userId
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('2FA-Error'))
      }

      // 2FA verificado, redirigir al panel
      window.location.href = '/panel-admin'
    } catch (error) {
      toast({
        title: t('Error'),
        description: error instanceof Error ? error.message : t('2FA-Error'),
        variant: "destructive",
      })
      setTwoFactorCode('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 rounded-t-lg">
        <CardTitle className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
          {step === 3 ? t('2FA-Title') : t('L-Login')}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          {step === 1 && t('L-Subtitle')}
          {step === 2 && securityQuestion}
          {step === 3 && (needs2FASetup ? t('2FA-Setup') : t('2FA-Enter'))}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {step === 1 && (
          <form onSubmit={handleFirstStep} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder={t('L-User')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <Input
                type="password"
                placeholder={t('L-Password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-[48%] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={isLoading || !captchaToken}
              >
                {isLoading ? t('Process1') : t('L-Next')}
              </Button>
            </div>
            <div ref={turnstileRef} className="mt-4 flex justify-center w-full h-[50px]"></div>

            <div className="relative my-4 pt-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400 font-semibold">
                  Modo Presentación / Demo
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => {
                document.cookie = "token=demo-admin-token; path=/; max-age=86400; SameSite=Lax";
                window.location.href = "/panel-admin";
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5 px-4 rounded-md shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
              Acceso Rápido al Panel Admin (Demo)
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSecondStep} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder={t('L-SecurityP')}
                value={securityPhrase}
                onChange={(e) => setSecurityPhrase(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? t('Process1') : t('L-Next')}
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleThirdStep} className="space-y-4">
            {needs2FASetup && qrCode && (
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {t('2FA-Scan')}
                </p>
                <div className="flex justify-center">
                  <img
                    src={qrCode}
                    alt="QR Code para 2FA"
                    className="w-48 h-48 rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}

            <div>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder={t('2FA-Code')}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center text-2xl tracking-widest"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700"
              disabled={isLoading || twoFactorCode.length !== 6}
            >
              {isLoading ? t('Process1') : t('2FA-Verify')}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export default function LoginForm() {
  return (
    <LanguageProvider>
      <LoginFormContent />
    </LanguageProvider>
  )
}