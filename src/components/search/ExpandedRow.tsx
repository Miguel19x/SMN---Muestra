import React, { useState, useCallback } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { ExpandedRowProps } from '../type/types';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '../additionals/scripts/i18n';
import { sanitizeImageUrl } from '@/lib/sanitize';

const ExpandedRow: React.FC<ExpandedRowProps> = ({ item, getAgeStage, getLegalCondition, renderValue }) => {
  const { translate } = useLanguage();
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [removalReason, setRemovalReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { data: details, isLoading, error } = useQuery({
    queryKey: ['desaparecido', item.id],
    queryFn: () => fetch(`/api/desaparecidos/${item.id}`).then(res => res.json()),
    enabled: !!item.id, // ✅ Solo fetch si tenemos un ID válido
    staleTime: Infinity,
  });

  const removalMutation = useMutation({
    mutationFn: async (data: { desaparecido_id: string; reason: string; evidence_url?: string }) => {
      const response = await fetch('/api/removal-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar solicitud');
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitSuccess(true);
      setRemovalReason('');
      setEvidenceUrl('');
      setTimeout(() => {
        setShowRemovalModal(false);
        setSubmitSuccess(false);
      }, 3000);
    },
  });

  const handleSubmitRemoval = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!removalReason.trim()) return;

    removalMutation.mutate({
      desaparecido_id: item.id || '',
      reason: removalReason,
      evidence_url: evidenceUrl || undefined,
    });
  }, [removalReason, evidenceUrl, item.id, removalMutation]);

  if (isLoading) {
    return (
      <TableRow className="bg-muted">
        <TableCell colSpan={4}>
          <div className="p-4 text-center">{translate('Process2')}</div>
        </TableCell>
      </TableRow>
    );
  }

  if (error) {
    return (
      <TableRow className="bg-muted">
        <TableCell colSpan={4}>
          <div className="p-4 text-center text-red-500">{translate('Error')}</div>
        </TableCell>
      </TableRow>
    );
  }

  if (!details) {
    return (
      <TableRow className="bg-muted">
        <TableCell colSpan={4}>
          <div className="p-4 text-center">{translate('Error')}</div>
        </TableCell>
      </TableRow>
    );
  }

  const ageStage = getAgeStage(details.edad);
  const legalCondition = getLegalCondition(details.edad);

  return (
    <>
      <TableRow className="bg-muted">
        <TableCell colSpan={4}>
          <div className="p-4">
            <h3 className="font-semibold mb-4 text-center">{translate('List-Info-Add')}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <p><strong>{translate('List-Info-Gender')}</strong> {renderValue(details.sexo)} {ageStage && `(${ageStage})`}</p>
                <p><strong>{translate('List-Info-Age')}</strong> {details.edad ? `${details.edad} ${translate('List-Info-Yo')}` : 'N/A'} ({legalCondition})</p>
                <p><strong>{translate('List-Info-P')}</strong> {renderValue(details.profesion)}</p>
                <p><strong>{translate('List-Info-N')}</strong> {renderValue(details.nacionalidad || (details.extranjero === 'V' ? translate('Form-NV') : 'N/A'))}</p>
                <p><strong>{translate('List-Info-H')}</strong> {renderValue(details.condicion_de_salud)}</p>
                <p><strong>{translate('List-Info-D')}</strong> {renderValue(details.discapacidad)}</p>
              </div>
              <div className="space-y-2">
                <p><strong>{translate('List-Info-PC')}</strong> {renderValue(details.lugar_de_confinamiento)}</p>
                <p><strong>{translate('List-Info-Pd')}</strong> {renderValue(details.lugar_de_desaparicion)}</p>
                <p><strong>{translate('List-Info-Dd')}</strong> {renderValue(details.fecha)}</p>
                <p><strong>{translate('List-Info-Dt')}</strong> {details.hora ? `${details.hora}hs` : 'N/A'}</p>
                <p><strong>{translate('List-Info-E')}</strong> {renderValue(details.etnia)}</p>
              </div>
              <div className="flex flex-col justify-center items-center space-y-2">
                <p><strong>{translate('List-Info-I')}:</strong></p>
                {details.imagen ? (
                  (() => {
                    const sanitizedUrl = sanitizeImageUrl(details.imagen);
                    return sanitizedUrl ? (
                      <img
                        src={sanitizedUrl}
                        alt={translate('List-Info-I')}
                        width={300}
                        height={300}
                        className="max-w-full h-auto rounded-lg shadow-md"
                      />
                    ) : (
                      <p className="text-gray-500">{translate('List-Info-Ierror')}</p>
                    );
                  })()
                ) : (
                  <p className="text-gray-500">{translate('List-Info-Ierror')}</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRemovalModal(true)}
                  className="mt-4 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  {translate('B-RequestRemoval')}
                </Button>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>

      {/* Modal de Solicitud de Retiro */}
      {showRemovalModal && (
        <TableRow>
          <TableCell colSpan={4}>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRemovalModal(false)}>
              <div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-4">{translate('Removal-Title')}</h2>

                {submitSuccess ? (
                  <div className="text-green-600 dark:text-green-400 text-center py-4">
                    ✓ {translate('Removal-Success')}
                  </div>
                ) : (
                  <form onSubmit={handleSubmitRemoval} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {translate('Removal-Reason')} *
                      </label>
                      <textarea
                        value={removalReason}
                        onChange={(e) => setRemovalReason(e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        rows={4}
                        required
                        placeholder={translate('Removal-Reason')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {translate('Removal-Evidence')}
                      </label>
                      <input
                        type="url"
                        value={evidenceUrl}
                        onChange={(e) => setEvidenceUrl(e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowRemovalModal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={removalMutation.isPending || !removalReason.trim()}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {removalMutation.isPending ? '...' : translate('Removal-Submit')}
                      </Button>
                    </div>
                    {removalMutation.isError && (
                      <p className="text-red-500 text-sm">
                        {(removalMutation.error as Error)?.message || 'Error al enviar'}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default React.memo(ExpandedRow);

