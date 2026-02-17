import { useState, useCallback, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SearchBar from './search/SearchBar'
import SearchFieldSelector from './search/searchFieldSelector'
import PanelTable from './panel/PanelTable'
import { getAgeStage, getLegalCondition, renderValue, formatCedula } from './search/utils'
import ErrorBoundary from './search/ErrorBoundary'
import useFetchData from './search/hook/useFetchData'
import { useFilteredData } from './search/hook/useFilteredData'
import Pagination from './search/Pagination'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { acceptDesaparecido, rejectDesaparecido } from '../lib/api/databaseOperations'
import type { PanelEngineProps } from './type/types'
import { LanguageProvider, useTranslation } from './additionals/scripts/i18n'
import RemovalRequestsPanel from './RemovalRequestsPanel'

const queryClient = new QueryClient()

function PanelEngineContent({ initialSearchTerm = '', focusSearchInput = false }: PanelEngineProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [searchField, setSearchField] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [actionToConfirm, setActionToConfirm] = useState<{ type: 'accept' | 'reject', id: string } | null>(null)
  const [filterTag, setFilterTag] = useState<'blue' | 'green' | null>(null)
  const { toast } = useToast()

  const {
    data: allPendingDesaparecidos,
    isLoading,
    isError,
    refetch,
  } = useFetchData('pendiente')

  const filteredDesaparecidos = useFilteredData(allPendingDesaparecidos, searchTerm, searchField)

  const totalPages = Math.ceil((filteredDesaparecidos?.length || 0) / itemsPerPage)
  const paginatedDesaparecidos = filteredDesaparecidos?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || []

  const handleSearchTermChange = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }, [])

  const handleSearchFieldSelect = useCallback((value: string) => {
    setSearchField(value)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }, [])

  const handleConfirmAction = useCallback(async () => {
    if (actionToConfirm) {
      try {
        if (actionToConfirm.type === 'accept') {
          await acceptDesaparecido(actionToConfirm.id)
          toast({ title: "Éxito", description: "Información aceptada y aprobada" })
        } else {
          await rejectDesaparecido(actionToConfirm.id)
          toast({ title: "Éxito", description: "Información rechazada y eliminada" })
        }
        refetch()
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Hubo un problema al procesar la acción",
          variant: "destructive",
        })
      }
    }
    setConfirmDialogOpen(false)
    setActionToConfirm(null)
  }, [actionToConfirm, refetch, toast, t])

  const handleAccept = useCallback((id: string) => {
    setActionToConfirm({ type: 'accept', id })
    setConfirmDialogOpen(true)
  }, [])

  const handleReject = useCallback((id: string) => {
    setActionToConfirm({ type: 'reject', id })
    setConfirmDialogOpen(true)
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('/auth/logout', { method: 'POST' })
      if (response.ok) {
        window.location.href = '/login'
      } else {
        toast({ title: "Error", description: "No se pudo cerrar la sesión", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Error al cerrar sesión", variant: "destructive" })
    }
  }, [toast])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center flex-1">{t('Title-4')}</h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-100"
        >
          {t('B-Logout') || 'Cerrar Sesión'}
        </Button>
      </div>
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
        <Suspense fallback={<div className="text-center">{t('Process1')}</div>}>
          {isLoading ? (
            <div className="text-center">{t('Process1')}</div>
          ) : isError ? (
            <div className="text-red-500 text-center">
              {t('Error')}
            </div>
          ) : filteredDesaparecidos && filteredDesaparecidos.length > 0 ? (
            <div>
              <div className="flex justify-center mb-4 gap-2">
                <Button
                  onClick={() => setFilterTag(null)}
                  variant={filterTag === null ? "default" : "outline"}
                  className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
                >
                  {t('B-All')}
                </Button>
                <Button
                  onClick={() => setFilterTag('blue')}
                  variant={filterTag === 'blue' ? "default" : "outline"}
                  className="bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-800 dark:bg-blue-700 dark:hover:bg-blue-800 dark:active:bg-blue-900 dark:text-blue-100"
                >
                  {t('B-Blue')}
                </Button>
                <Button
                  onClick={() => setFilterTag('green')}
                  variant={filterTag === 'green' ? "default" : "outline"}
                  className="bg-green-100 hover:bg-green-200 active:bg-green-300 text-green-800 dark:bg-green-700 dark:hover:bg-green-800 dark:active:bg-green-900 dark:text-green-100"
                >
                  {t('B-Green')}
                </Button>
              </div>
              <div className="w-full md:max-w-[90%] mx-auto">
                <Pagination
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
                <div className="overflow-x-auto mt-6">
                  <PanelTable
                    data={paginatedDesaparecidos}
                    renderValue={renderValue}
                    formatCedula={formatCedula}
                    getAgeStage={getAgeStage}
                    getLegalCondition={getLegalCondition}
                    refetch={refetch}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    filterTag={filterTag}
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
              {t('Component-P')}
            </div>
          )}
        </Suspense>
      </ErrorBoundary>

      {/* Panel de solicitudes de retiro */}
      <RemovalRequestsPanel />

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Subtitle-5')}</DialogTitle>
            <DialogDescription>
              {actionToConfirm?.type === 'accept' ? t('Paragraph-6') : t('Paragraph-7')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>{t('B-Cancel')}</Button>
            <Button className="bg-blue-600" onClick={handleConfirmAction}>{t('B-Confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function PanelEngine(props: PanelEngineProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <PanelEngineContent {...props} />
      </LanguageProvider>
    </QueryClientProvider>
  )
}