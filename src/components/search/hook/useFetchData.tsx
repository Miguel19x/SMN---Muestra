import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { DesaparecidoData } from '../../type/types';

function useFetchData(estado_registro: 'pendiente' | 'aprobado' = 'aprobado') {
  const fetchData = useCallback(async () => {
    const url = `/api/inventario?estado_registro=${estado_registro}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data.objetos;
  }, [estado_registro]);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery<DesaparecidoData[]>({
    queryKey: ['objetos', estado_registro],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}

export default useFetchData;