import type { DesaparecidoData, TranslationKey } from '../type/types';

type TranslateFunction = (key: TranslationKey) => string;

export const getAgeStage = (edad: number | undefined, translate?: TranslateFunction): string => {
  if (edad === undefined) return '';
  if (edad <= 9) return translate ? translate('List-Info-G1') : 'Infant';
  if (edad <= 12) return translate ? translate('List-Info-G2') : 'Preteen';
  if (edad <= 19) return translate ? translate('List-Info-G3') : 'Adolescent';
  return '';
};

export const getLegalCondition = (edad: number | undefined, translate?: TranslateFunction): string => {
  if (edad === undefined) return 'N/A';
  if (edad < 18) return translate ? translate('List-Info-A1') : 'Underage';
  if (edad >= 65) return translate ? translate('List-Info-A2') : 'Elderly';
  return translate ? translate('List-Info-A3') : 'Adult';
};

export const renderValue = (value: any): string => {
  if (value === undefined || value === null || value === '') {
    return 'N/A';
  }
  return String(value);
};

export const formatCedula = (item: DesaparecidoData): string => {
  // ✅ Handle edge cases: undefined, empty strings, or missing fields
  const prefix = item.extranjero && item.extranjero.trim() !== '' ? item.extranjero : 'V';
  const cedula = item.cedula && item.cedula.trim() !== '' ? item.cedula : 'N/A';
  return `${prefix}-${cedula}`;
};