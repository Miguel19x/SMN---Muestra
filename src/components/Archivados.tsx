import { useState, useEffect, useCallback } from 'react';
import { LanguageProvider, useTranslation } from './additionals/scripts/i18n';

interface ArchivedObjeto {
  id: string;
  nombre: string;
  codigo?: string;
  categoria?: string;
  tipo_objeto?: string;
  condicion?: string;
  estado_conservacion?: string;
  ubicacion_actual?: string;
  ultimo_lugar_conocido?: string;
  pais_origen?: string;
  antiguedad?: number;
  fecha_registro?: string;
  fecha_archivado?: string;
  motivo_archivado?: string;
  imagen?: string;
}

function ArchivadosContent() {
  const { t } = useTranslation();
  const [items, setItems] = useState<ArchivedObjeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchArchived = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/inventario?estado_registro=archivado');
      if (!res.ok) throw new Error('Error al cargar archivados');
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchived();
  }, [fetchArchived]);

  const handleRestore = async (id: string) => {
    if (!confirm(t('Archive-RestoreConfirm'))) return;

    setRestoringId(id);
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch(`/api/inventario/${id}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al restaurar');
      }

      // Remove from list
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al restaurar');
    } finally {
      setRestoringId(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-lg">{error}</p>
        <button
          onClick={fetchArchived}
          className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-gray-300 text-lg font-medium">{t('Archive-Empty')}</p>
        <p className="text-gray-500 text-sm mt-2">{t('Archive-EmptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Counter */}
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          {items.length} {items.length === 1 ? t('Archive-CountSingular') : t('Archive-CountPlural')}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group bg-slate-100/95 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-2xl border border-transparent hover:border-amber-400/30 transition-all duration-300 overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-5 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
                    {item.nombre}
                  </h3>
                  {item.codigo && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                      {item.codigo}
                    </p>
                  )}
                </div>
                {item.categoria && (
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                    {item.categoria}
                  </span>
                )}
              </div>

              {/* Key Info */}
              <div className="mt-3 space-y-1.5">
                {item.tipo_objeto && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="truncate">{item.tipo_objeto}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{t('Archive-ArchivedOn')}: <strong>{formatDate(item.fecha_archivado)}</strong></span>
                </div>
                {item.fecha_registro && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('Archive-RegisteredOn')}: {formatDate(item.fecha_registro)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Motivo */}
            {item.motivo_archivado && (
              <div className="mx-5 mb-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30">
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mb-0.5">{t('Archive-Reason')}:</p>
                <p className="text-sm text-amber-800 dark:text-amber-200">{item.motivo_archivado}</p>
              </div>
            )}

            {/* Expandable Details */}
            {expandedId === item.id && (
              <div className="mx-5 mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 space-y-2 text-sm animate-fadeIn">
                {item.condicion && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('Archive-Condition')}:</span>
                    <span className="text-gray-700 dark:text-gray-200">{item.condicion}</span>
                  </div>
                )}
                {item.estado_conservacion && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('Archive-Conservation')}:</span>
                    <span className="text-gray-700 dark:text-gray-200">{item.estado_conservacion}</span>
                  </div>
                )}
                {item.ubicacion_actual && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('Archive-CurrentLocation')}:</span>
                    <span className="text-gray-700 dark:text-gray-200">{item.ubicacion_actual}</span>
                  </div>
                )}
                {item.ultimo_lugar_conocido && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('Archive-LastLocation')}:</span>
                    <span className="text-gray-700 dark:text-gray-200">{item.ultimo_lugar_conocido}</span>
                  </div>
                )}
                {item.pais_origen && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('Archive-Origin')}:</span>
                    <span className="text-gray-700 dark:text-gray-200">{item.pais_origen}</span>
                  </div>
                )}
                {item.antiguedad !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('Archive-Age')}:</span>
                    <span className="text-gray-700 dark:text-gray-200">{item.antiguedad}</span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="px-5 pb-4 flex items-center gap-2">
              <button
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors"
              >
                {expandedId === item.id ? t('Archive-ShowLess') : t('Archive-ShowMore')}
              </button>
              <button
                onClick={() => handleRestore(item.id)}
                disabled={restoringId === item.id}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-800/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {restoringId === item.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    ...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t('Archive-Restore')}
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Archivados() {
  return (
    <LanguageProvider>
      <ArchivadosContent />
    </LanguageProvider>
  );
}