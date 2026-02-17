import type { ReactNode } from "react";
import es from '../additionals/i18n/es.json';
import en from '../additionals/i18n/en.json';

export type ObjetoData = {
  // ✅ 'id' es un identificador ofuscado (HMAC-based)
  id?: string;
  // Internal MongoDB ID (used only in admin panel)
  _id?: string;
  origen: 'N' | 'I'; // Nacional / Importado
  codigo?: string; // Serial number / identification code
  nombre: string;
  estado?: string; // Venezuelan state (location)
  categoria?: string; // Tipo A, Tipo B, etc.
  antiguedad?: number; // Age in years
  pais_origen?: string; // Country of origin (when imported)
  tipo_objeto?: string; // Object type
  condicion?: string; // General condition
  estado_conservacion?: string; // Conservation state
  clasificacion?: string; // Classification (Clase A, B, C, D)
  ubicacion_actual?: string; // Current storage location
  ultimo_lugar_conocido?: string; // Last known location
  fecha_registro?: string;
  hora_registro?: string;
  imagen?: string;
  estado_registro: 'pendiente' | 'aprobado';
  etiqueta: 'blue' | 'green';
}

// ✅ Backward compatibility alias
export type DesaparecidoData = ObjetoData;

export type ErrorState = {
  [key: string]: string;
}

export type FormChangeHandler = (name: string, value: any) => void;

export interface SearchEngineProps {
  initialSearchTerm?: string;
  focusSearchInput?: boolean;
}

export type InfoFormProps = {
  formData: ObjetoData;
  errors: ErrorState;
  onChange: FormChangeHandler;
}

export type ImageUploadProps = {
  onChange: FormChangeHandler;
}

export interface ObjetosTableProps {
  data: ObjetoData[];
  renderValue: (value: any) => string;
  formatCodigo: (item: ObjetoData) => string;
  getAntiguedadStage: (antiguedad?: number) => string;
  getCondicionEstado: (antiguedad?: number) => string;
}

// ✅ Backward compatibility alias
export type DesaparecidosTableProps = ObjetosTableProps;

export interface ExpandedRowProps {
  item: ObjetoData;
  getAntiguedadStage: (antiguedad?: number) => string;
  getCondicionEstado: (antiguedad?: number) => string;
  renderValue: (value: any) => string;
}

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (items: number) => void;
}

export interface SearchBarProps {
  initialSearchTerm: string;
  onSearchTermChange: (term: string) => void;
  focusSearchInput: boolean;
}

export interface SearchFieldSelectorProps {
  searchField: string;
  onSearchFieldSelect: (field: string) => void;
}

export interface PanelTableProps {
  data: ObjetoData[]
  renderValue: (value: string | undefined) => React.ReactNode
  formatCodigo: (item: ObjetoData) => string
  getAntiguedadStage: (age: number | undefined) => string
  getCondicionEstado: (age: number | undefined) => string
  refetch: () => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
  filterTag: 'blue' | 'green' | null
}

export type ExpandedRowPanelProps = {
  item: ObjetoData;
  getAntiguedadStage: (age: number) => string;
  getCondicionEstado: (age: number) => string;
  renderValue: (value: string | undefined) => React.ReactNode;
  refetch: () => void;
  isEditing: boolean;
  editedData: ObjetoData | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ErrorState;
  setErrors: React.Dispatch<React.SetStateAction<ErrorState>>;
  onImageDelete: (imageUrl: string) => void;
};

export interface PanelEngineProps {
  initialSearchTerm?: string;
  focusSearchInput?: boolean;
}

export interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface State {
  hasError: boolean;
}

export type Language = 'es' | 'en';
export type TranslationKey = keyof typeof es & keyof typeof en;
export type TranslateFunction = (key: TranslationKey) => string;

export type ChartType = 'pie' | 'donut' | 'bar';

export interface StatsChartProps {
  type: ChartType;
  data: number[];
  labels: string[];
  title?: string;
  height?: number;
  width?: string | number;
  showPercentages?: boolean;
}