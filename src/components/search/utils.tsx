import type { ObjetoData, TranslationKey } from '../type/types';

type TranslateFunction = (key: TranslationKey) => string;

export const getAntiguedadStage = (antiguedad: number | undefined, translate?: TranslateFunction): string => {
  if (antiguedad === undefined) return '';
  if (antiguedad <= 1) return translate ? translate('List-Info-G1') : 'Nuevo';
  if (antiguedad <= 5) return translate ? translate('List-Info-G2') : 'Reciente';
  if (antiguedad <= 15) return translate ? translate('List-Info-G3') : 'Intermedio';
  return '';
};

// Backward-compat alias
export const getAgeStage = getAntiguedadStage;

export const getCondicionEstado = (antiguedad: number | undefined, translate?: TranslateFunction): string => {
  if (antiguedad === undefined) return 'N/A';
  if (antiguedad <= 5) return translate ? translate('List-Info-A1') : 'Óptimo';
  if (antiguedad <= 15) return translate ? translate('List-Info-A2') : 'Bueno';
  return translate ? translate('List-Info-A3') : 'Regular';
};

// Backward-compat alias
export const getLegalCondition = getCondicionEstado;

export const renderValue = (value: any): string => {
  if (value === undefined || value === null || value === '') {
    return 'N/A';
  }
  return String(value);
};

export const formatCodigo = (item: ObjetoData): string => {
  const prefix = item.origen && item.origen.trim() !== '' ? item.origen : 'N';
  const codigo = item.codigo && item.codigo.trim() !== '' ? item.codigo : 'N/A';
  return `${prefix}-${codigo}`;
};

// Backward-compat alias
export const formatCedula = formatCodigo;