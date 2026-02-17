import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from './additionals/scripts/i18n';
import { useToast } from "@/hooks/use-toast";

interface RemovalRequest {
    _id: string;
    desaparecido_id: {
        _id: string;
        nombre: string;
        cedula: string;
        imagen?: string;
    };
    twitter_username: string;
    twitter_name: string;
    reason: string;
    evidence_url?: string;
    status: 'pending' | 'approved' | 'rejected';
    deadline: string;
    createdAt: string;
}

const RemovalRequestsPanel: React.FC = () => {
    const { translate } = useLanguage();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [selectedRequest, setSelectedRequest] = useState<RemovalRequest | null>(null);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
    const [adminNotes, setAdminNotes] = useState('');

    const { data: requests, isLoading, isError } = useQuery<RemovalRequest[]>({
        queryKey: ['removalRequests'],
        queryFn: async () => {
            const response = await fetch('/api/removal-requests?admin=true&status=pending');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            // ✅ FIX: API returns { requests: [...] }, not a direct array
            return data.requests || [];
        },
        staleTime: 30000
    });

    const updateMutation = useMutation({
        mutationFn: async ({ requestId, status, admin_notes }: { requestId: string; status: string; admin_notes: string }) => {
            const response = await fetch('/api/removal-requests', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, status, admin_notes }),
            });
            if (!response.ok) throw new Error('Failed to update');
            return response.json();
        },
        onSuccess: (data) => {
            toast({ title: "Éxito", description: data.message });
            queryClient.invalidateQueries({ queryKey: ['removalRequests'] });
            setActionDialogOpen(false);
            setSelectedRequest(null);
            setAdminNotes('');
        },
        onError: () => {
            toast({ title: "Error", description: "No se pudo procesar la solicitud", variant: "destructive" });
        }
    });

    const handleAction = useCallback((request: RemovalRequest, action: 'approve' | 'reject') => {
        setSelectedRequest(request);
        setActionType(action);
        setActionDialogOpen(true);
    }, []);

    const confirmAction = useCallback(() => {
        if (!selectedRequest) return;
        updateMutation.mutate({
            requestId: selectedRequest._id,
            status: actionType === 'approve' ? 'approved' : 'rejected',
            admin_notes: adminNotes,
        });
    }, [selectedRequest, actionType, adminNotes, updateMutation]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getDaysRemaining = (deadline: string) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (isLoading) {
        return (
            <div className="p-4 text-center text-gray-500">
                Cargando solicitudes...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4 text-center text-red-500">
                Error al cargar las solicitudes
            </div>
        );
    }

    if (!requests || requests.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No hay solicitudes de retiro pendientes
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">{translate('Removal-Pending')}</h2>

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Persona</TableHead>
                            <TableHead>Razón</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Plazo</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => {
                            const daysRemaining = getDaysRemaining(request.deadline);
                            return (
                                <TableRow key={request._id}>
                                    <TableCell>
                                        <a
                                            href={`https://twitter.com/${request.twitter_username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            @{request.twitter_username}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {request.desaparecido_id?.imagen && (
                                                <img
                                                    src={request.desaparecido_id.imagen}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium">{request.desaparecido_id?.nombre}</p>
                                                <p className="text-xs text-gray-500">{request.desaparecido_id?.cedula}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs">
                                        <p className="truncate" title={request.reason}>{request.reason}</p>
                                        {request.evidence_url && (
                                            <a
                                                href={request.evidence_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-500 hover:underline"
                                            >
                                                Ver evidencia
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs ${daysRemaining <= 2
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            }`}>
                                            {daysRemaining > 0 ? `${daysRemaining} días` : 'Vencido'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="bg-green-100 hover:bg-green-200 text-green-700"
                                                onClick={() => handleAction(request, 'approve')}
                                            >
                                                Aprobar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="bg-red-100 hover:bg-red-200 text-red-700"
                                                onClick={() => handleAction(request, 'reject')}
                                            >
                                                Rechazar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Diálogo de confirmación */}
            <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'approve' ? 'Aprobar solicitud' : 'Rechazar solicitud'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'approve'
                                ? 'Al aprobar, el registro del desaparecido será eliminado permanentemente.'
                                : 'La solicitud será rechazada y el registro permanecerá visible.'}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="py-4">
                            <p><strong>Solicitante:</strong> @{selectedRequest.twitter_username}</p>
                            <p><strong>Persona:</strong> {selectedRequest.desaparecido_id?.nombre}</p>
                            <p><strong>Razón:</strong> {selectedRequest.reason}</p>

                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">
                                    Notas del admin (opcional)
                                </label>
                                <textarea
                                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                                    rows={3}
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Añadir notas sobre la decisión..."
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={confirmAction}
                            className={actionType === 'approve'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'}
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? 'Procesando...' : 'Confirmar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RemovalRequestsPanel;
