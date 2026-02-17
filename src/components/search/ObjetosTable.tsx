import React, { useState, lazy, Suspense } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ObjetosTableProps } from '../type/types';
import { useLanguage } from '../additionals/scripts/i18n';
import { getAntiguedadStage, getCondicionEstado } from './utils';

const LazyExpandedRow = lazy(() => import('./ExpandedRow'));

export default function ObjetosTable({
    data,
    renderValue,
    formatCodigo,
}: ObjetosTableProps) {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const { translate } = useLanguage();

    const toggleRow = (id: string | undefined) => {
        if (id) {
            setExpandedRow(prev => prev === id ? null : id);
        }
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-4">
                {translate('Component-S')}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[25%] text-center">{translate('List-Title-ID')}</TableHead>
                        <TableHead className="w-[50%] text-center">{translate('List-Title-Name')}</TableHead>
                        <TableHead className="w-[20%] text-center">{translate('List-Title-Location')}</TableHead>
                        <TableHead className="w-[5%]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => {
                        const itemKey = item.id && item.id.trim() !== ''
                            ? item.id
                            : item.codigo || `row-fallback-${index}`;

                        if (!item.id || item.id.trim() === '') {
                            console.warn(`ObjetosTable: Item at index ${index} has empty/null id, using fallback key:`, itemKey);
                        }

                        return (
                            <React.Fragment key={itemKey}>
                                <TableRow
                                    className="cursor-pointer"
                                    onClick={() => toggleRow(item.id)}
                                >
                                    <TableCell className="text-center">{formatCodigo(item)}</TableCell>
                                    <TableCell className="text-center">{renderValue(item.nombre)}</TableCell>
                                    <TableCell className="text-center">{renderValue(item.estado)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleRow(item.id);
                                            }}
                                            aria-controls={`row-${item.id || item.codigo}`}
                                            aria-expanded={expandedRow === item.id}
                                            aria-label={translate('Info-Details', { name: item.nombre })}
                                        >
                                            {expandedRow === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {expandedRow === item.id && (
                                    <Suspense fallback={<TableRow><TableCell colSpan={4}>{translate('Process2')}</TableCell></TableRow>}>
                                        <LazyExpandedRow
                                            item={item}
                                            getAntiguedadStage={(antiguedad) => getAntiguedadStage(antiguedad, translate)}
                                            getCondicionEstado={(antiguedad) => getCondicionEstado(antiguedad, translate)}
                                            renderValue={renderValue}
                                        />
                                    </Suspense>
                                )}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
