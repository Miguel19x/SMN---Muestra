import type { ReactNode } from "react";
import es from '../additionals/i18n/es.json';
import en from '../additionals/i18n/en.json';

export type DesaparecidoData = {
  // ✅ REFACTORIZACIÓN: Usar 'id' público en vez de '_id'
  // 'id' es un identificador ofuscado (HMAC-based) que previene
  // exposición de MongoDB ObjectIds internos
  id?: string;
  extranjero: 'V' | 'E';
  cedula?: string;
  nombre: string;
  estado?: string;
  sexo?: 'Masculino' | 'Femenino';
  edad?: number;
  nacionalidad?: string;
  profesion?: string;
  condicion_de_salud?: string;
  discapacidad?: string;
  lugar_de_confinamiento?: string;
  lugar_de_desaparicion?: string;
  fecha?: string;
  hora?: string;
  etnia?: string;
  imagen?: string;
  estado_registro: 'pendiente' | 'aprobado';
  etiqueta: 'blue' | 'green';
}

export type ErrorState = {
  [key: string]: string;
}

export type FormChangeHandler = (name: string, value: any) => void;

export interface SearchEngineProps {
  initialSearchTerm?: string;
  focusSearchInput?: boolean;
}

export type InfoFormProps = {
  formData: DesaparecidoData;
  errors: ErrorState;
  onChange: FormChangeHandler;
}

export type ImageUploadProps = {
  onChange: FormChangeHandler;
}

export interface DesaparecidosTableProps {
  data: DesaparecidoData[];
  renderValue: (value: any) => string;
  formatCedula: (item: DesaparecidoData) => string;
  getAgeStage: (edad?: number) => string;
  getLegalCondition: (edad?: number) => string;
}

export interface ExpandedRowProps {
  item: DesaparecidoData;
  getAgeStage: (edad?: number) => string;
  getLegalCondition: (edad?: number) => string;
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
  data: DesaparecidoData[]
  renderValue: (value: string | undefined) => React.ReactNode
  formatCedula: (item: DesaparecidoData) => string
  getAgeStage: (age: number | undefined) => string
  getLegalCondition: (age: number | undefined) => string
  refetch: () => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
  filterTag: 'blue' | 'green' | null
}

export type ExpandedRowPanelProps = {
  item: DesaparecidoData;
  getAgeStage: (age: number) => string;
  getLegalCondition: (age: number) => string;
  renderValue: (value: string | undefined) => React.ReactNode;
  refetch: () => void;
  isEditing: boolean;
  editedData: DesaparecidoData | null;
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