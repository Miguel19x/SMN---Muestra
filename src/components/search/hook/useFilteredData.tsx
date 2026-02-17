import { useMemo } from 'react';
import type { DesaparecidoData } from '../../type/types';
import { getAgeStage, getLegalCondition } from '../utils';
import { matchesProfessionKeyword } from '../../../utils/professionCategorizer';

export function useFilteredData(
  allDesaparecidos: DesaparecidoData[] | undefined,
  searchTerm: string,
  searchField: string
) {
  return useMemo(() => {
    if (!allDesaparecidos || allDesaparecidos.length === 0) return [];

    // Crear regex una sola vez fuera del loop
    const searchRegex = searchTerm ? new RegExp(searchTerm, 'i') : null;

    return allDesaparecidos.filter((item) => {
      // Si hay un campo seleccionado pero no hay término de búsqueda,
      // mostrar solo registros que TIENEN valor en ese campo
      if (searchField && !searchRegex) {
        const fieldValue = item[searchField as keyof DesaparecidoData];
        if (searchField === 'cedula') {
          // Para cédula, verificar que tenga números reales (no solo "V-" o vacío)
          const numericCedula = item.cedula?.replace(/\D/g, '') || '';
          return numericCedula.length > 0;
        }
        // Para otros campos, verificar que exista y no esté vacío
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
      }

      // Si no hay término de búsqueda ni campo, mostrar todos
      if (!searchRegex) return true;

      if (searchField) {
        switch (searchField) {
          case 'cedula':
            return searchRegex.test(item.cedula?.replace(/\D/g, '') || '');
          case 'edad':
            return item.edad === parseInt(searchTerm);
          case 'legalCondition':
            const legalCondition = getLegalCondition(item.edad);
            return searchRegex.test(legalCondition);
          case 'ageStage':
            const ageStage = getAgeStage(item.edad);
            return searchRegex.test(ageStage);
          case 'profesion':
            // Match by profession using category keywords
            if (!item.profesion) return false;
            return matchesProfessionKeyword(item.profesion, searchTerm);
          default:
            return searchRegex.test(String(item[searchField as keyof DesaparecidoData] || ''));
        }
      } else {
        // Búsqueda global - incluir matching de profesiones por categoría
        const basicMatch = Object.values(item).some((value) =>
          typeof value === 'string' && searchRegex.test(value)
        );

        // Si no hay match básico, intentar match por categoría de profesión
        if (!basicMatch && item.profesion) {
          return matchesProfessionKeyword(item.profesion, searchTerm);
        }

        return basicMatch;
      }
    });
  }, [allDesaparecidos, searchTerm, searchField]);
}
