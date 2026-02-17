import { useTranslation } from '../additionals/scripts/i18n';
import type { ObjetoData, ErrorState, TranslationKey } from '../type/types';

type ValidationFunction = (value: string, t: (key: TranslationKey) => string) => string;

export const validateNombre: ValidationFunction = (value, translate) => {
  if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ0-9\s.\-]+$/.test(value)) {
    return translate('Validation-Name1')
  }
  if (value.trim().length < 2) return translate('Validation-Name2')
  return ""
}

export const validateCodigo = (value: string, origen: 'N' | 'I', translate: (key: TranslationKey) => string): string => {
  if (value.length === 0) return ""
  if (origen === 'N') {
    if (!/^[A-Za-z0-9\-]+$/.test(value)) {
      return translate('Validation-ID1')
    }
  } else {
    if (!/^[A-Za-z0-9\-_.]+$/.test(value)) {
      return translate('Validation-ID3')
    }
  }
  return ""
}

export const validatePaisOrigen: ValidationFunction = (value, translate) => {
  if (value.length === 0) return ""
  if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(value)) {
    return translate('Validation-N1')
  }
  if (value.length < 3) return translate('Validation-N2')
  return ""
}

export const validateAntiguedad: ValidationFunction = (value, translate) => {
  if (value.length === 0) return ""
  if (!/^\d+$/.test(value)) return translate('Validation-A1')
  const age = parseInt(value, 10)
  if (age < 0) return translate('Validation-A2')
  if (age > 200) return translate('Validation-A3')
  return ""
}

export const validateTextField = (name: string, value: string, translate: (key: TranslationKey) => string): string => {
  if (value.length === 0) return ""
  if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ0-9\s.\-,]+$/.test(value)) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} ${translate('Validation-Text1')}`
  }
  if (value.length < 2) return `${name.charAt(0).toUpperCase() + name.slice(1)} ${translate('Validation-Text2')}`
  return ""
}

export const validateHora: ValidationFunction = (value, translate) => {
  if (value.length === 0) return ""
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) return translate('Validation-Time')
  return ""
}

import { useCallback } from 'react';

export function useFormValidation() {
  const { t, lang, forceUpdate } = useTranslation();

  const validateForm = useCallback((formData: ObjetoData): ErrorState => {
    const errors: ErrorState = {}

    errors.nombre = validateNombre(formData.nombre, t)
    errors.codigo = validateCodigo(formData.codigo ?? '', formData.origen, t)
    if (formData.antiguedad !== undefined) errors.antiguedad = validateAntiguedad(formData.antiguedad.toString(), t)
    if (formData.pais_origen) errors.pais_origen = formData.origen === 'I' ? validatePaisOrigen(formData.pais_origen, t) : ""
    if (formData.tipo_objeto) errors.tipo_objeto = validateTextField(`${t('Form-P')}`, formData.tipo_objeto, t)
    if (formData.hora_registro) errors.hora_registro = validateHora(formData.hora_registro, t)

    return Object.fromEntries(Object.entries(errors).filter(([_, value]) => value !== ""))
  }, [t]);

  return { validateForm, lang, forceUpdate };
}