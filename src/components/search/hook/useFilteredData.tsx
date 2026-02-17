import { useMemo } from 'react';
import type { ObjetoData } from '../../type/types';
import { getAntiguedadStage, getCondicionEstado } from '../utils';
import { matchesProfessionKeyword } from '../../../utils/professionCategorizer';

export function useFilteredData(
  allObjetos: ObjetoData[] | undefined,
  searchTerm: string,
  searchField: string
) {
  return useMemo(() => {
    if (!allObjetos || allObjetos.length === 0) return [];

    const searchRegex = searchTerm ? new RegExp(searchTerm, 'i') : null;

    return allObjetos.filter((item) => {
      // Si hay un campo seleccionado pero no hay término de búsqueda,
      // mostrar solo registros que TIENEN valor en ese campo
      if (searchField && !searchRegex) {
        const fieldValue = item[searchField as keyof ObjetoData];
        if (searchField === 'codigo') {
          const codigoValue = item.codigo?.replace(/\s/g, '') || '';
          return codigoValue.length > 0;
        }
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
      }

      // Si no hay término de búsqueda ni campo, mostrar todos
      if (!searchRegex) return true;

      if (searchField) {
        switch (searchField) {
          case 'codigo':
            return searchRegex.test(item.codigo || '');
          case 'antiguedad':
            return item.antiguedad === parseInt(searchTerm);
          case 'condicionEstado':
            const condicionEstado = getCondicionEstado(item.antiguedad);
            return searchRegex.test(condicionEstado);
          case 'antiguedadStage':
            const antiguedadStage = getAntiguedadStage(item.antiguedad);
            return searchRegex.test(antiguedadStage);
          case 'tipo_objeto':
            if (!item.tipo_objeto) return false;
            return matchesProfessionKeyword(item.tipo_objeto, searchTerm);
          default:
            return searchRegex.test(String(item[searchField as keyof ObjetoData] || ''));
        }
      } else {
        // Búsqueda global
        const basicMatch = Object.values(item).some((value) =>
          typeof value === 'string' && searchRegex.test(value)
        );

        if (!basicMatch && item.tipo_objeto) {
          return matchesProfessionKeyword(item.tipo_objeto, searchTerm);
        }

        return basicMatch;
      }
    });
  }, [allObjetos, searchTerm, searchField]);
}
