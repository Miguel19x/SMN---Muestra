import { useState, useCallback, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider, useLanguage } from './additionals/scripts/i18n';
import { UniversalErrorBoundary } from './UniversalErrorBoundary';
import SearchBar from './search/SearchBar';
import SearchFieldSelector from './search/searchFieldSelector'
import DesaparecidosTable from './search/DesaparecidosTable';
import { getAgeStage, getLegalCondition, renderValue, formatCedula } from './search/utils';
import ErrorBoundary from './search/ErrorBoundary';
import useFetchData from './search/hook/useFetchData';
import { useFilteredData } from './search/hook/useFilteredData';
import Pagination from './search/Pagination';
import type { SearchEngineProps } from './type/types';

const queryClient = new QueryClient();

function SearchEngineContent({ initialSearchTerm = '', focusSearchInput = false }: SearchEngineProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchField, setSearchField] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { translate } = useLanguage();

  const {
    data: allDesaparecidos,
    isLoading,
    isError,
  } = useFetchData('aprobado');

  const filteredDesaparecidos = useFilteredData(allDesaparecidos, searchTerm, searchField);

  const totalPages = Math.ceil((filteredDesaparecidos?.length || 0) / itemsPerPage);
  const paginatedDesaparecidos = filteredDesaparecidos?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  // Función para detectar automáticamente el tipo de campo
  // Solo detecta cédula y fecha, el resto busca en todos los campos
  const detectSearchField = useCallback((value: string): string => {
    if (!value.trim()) return '';

    // Si es solo números → cédula
    if (/^[\d.]+$/.test(value.trim())) {
      return 'cedula';
    }

    // Si es formato fecha (YYYY-MM-DD o DD/MM/YYYY)
    if (/^\d{4}-\d{2}-\d{2}$/.test(value.trim()) || /^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(value.trim())) {
      return 'fecha';
    }

    // Por defecto, buscar en todos los campos (no auto-seleccionar nombre)
    return '';
  }, []);

  const handleSearchTermChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);

    // Auto-detectar el campo solo para cédula y fecha
    if (!searchField || searchField === '') {
      const detectedField = detectSearchField(value);
      if (detectedField && detectedField !== searchField) {
        setSearchField(detectedField);
      }
    }
  }, [searchField, detectSearchField]);

  const handleSearchFieldSelect = useCallback((value: string) => {
    setSearchField(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  return (
    <div id="motor-busqueda" className="bg-background py-8 scroll-mt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4 text-center">{translate('Component-1')}</h1>
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4">
            <SearchBar
              initialSearchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
              focusSearchInput={focusSearchInput}
            />
            <SearchFieldSelector
              searchField={searchField}
              onSearchFieldSelect={handleSearchFieldSelect}
            />
          </div>
        </div>
        <ErrorBoundary>
          <Suspense fallback={<div className="text-center">{translate('Process1')}</div>}>
            {isLoading ? (
              <div className="text-center">{translate('Process1')}</div>
            ) : isError ? (
              <div className="text-red-500 text-center">
                {translate('Error')}
              </div>
            ) : filteredDesaparecidos && filteredDesaparecidos.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-center">{translate('Component-2')}</h2>
                <div className="w-full md:max-w-[85%] mx-auto">
                  <Pagination
                    itemsPerPage={itemsPerPage}

                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                  <div className="overflow-x-auto mt-6">
                    <DesaparecidosTable
                      data={paginatedDesaparecidos}
                      renderValue={renderValue}
                      formatCedula={formatCedula}
                      getAgeStage={getAgeStage}
                      getLegalCondition={getLegalCondition}
                    />
                  </div>
                </div>
                <div className="w-full md:max-w-[85%] mx-auto mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                {translate('Component-S')}
              </div>
            )}
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default function MotorDeBusqueda(props: SearchEngineProps) {
  return (
    <UniversalErrorBoundary componentName="Motor de Búsqueda">
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <SearchEngineContent {...props} />
        </LanguageProvider>
      </QueryClientProvider>
    </UniversalErrorBoundary>
  );
}