/**
 * Dataset Demo y Store en memoria para DataTracker
 * Permite demostraciones 100% interactivas y fluidas sin depender de MongoDB o Redis externos.
 */

import type { ObjetoResponseDTO } from '../types/objeto.types';

export const INITIAL_DEMO_OBJETOS: ObjetoResponseDTO[] = [
    {
        id: "demo-obj-001",
        _id: "507f1f77bcf86cd799439011",
        nombre: "Servidor Rack Dell PowerEdge R740",
        codigo: "EQP-SRV-2024-001",
        antiguedad: 2,
        categoria: "Tipo A",
        origen: "I",
        pais_origen: "Estados Unidos",
        tipo_objeto: "Equipamiento de Cómputo",
        clasificacion: "Clase A",
        condicion: "Operativo",
        estado_conservacion: "Excelente",
        ubicacion_actual: "Data Center Principal - Rack 04, Caracas, Distrito Capital",
        ultimo_lugar_conocido: "Almacén Central de Telecomunicaciones, Caracas",
        estado: "Distrito Capital",
        fecha_registro: "2024-01-15",
        hora_registro: "09:30",
        imagen: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
        estado_registro: "aprobado",
        etiqueta: "green",
        antiguedadStage: "Reciente",
        condicionEstado: "Óptimo",
    },
    {
        id: "demo-obj-002",
        _id: "507f1f77bcf86cd799439012",
        nombre: "Estación Total Topográfica Leica TS07",
        codigo: "TOP-LEI-2023-014",
        antiguedad: 3,
        categoria: "Tipo B",
        origen: "I",
        pais_origen: "Suiza",
        tipo_objeto: "Instrumental de Medición",
        clasificacion: "Clase A",
        condicion: "Calibrado",
        estado_conservacion: "Muy Bueno",
        ubicacion_actual: "Laboratorio de Geodesia y Cartografía, Valencia, Carabobo",
        ultimo_lugar_conocido: "Obra Autopista Regional del Centro, Maracay",
        estado: "Carabobo",
        fecha_registro: "2023-11-20",
        hora_registro: "14:15",
        imagen: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        estado_registro: "aprobado",
        etiqueta: "green",
        antiguedadStage: "Estándar",
        condicionEstado: "Óptimo",
    },
    {
        id: "demo-obj-003",
        _id: "507f1f77bcf86cd799439013",
        nombre: "Generador Eléctrico Diésel Caterpillar 250kVA",
        codigo: "GEN-CAT-2022-005",
        antiguedad: 4,
        categoria: "Tipo C",
        origen: "I",
        pais_origen: "Estados Unidos",
        tipo_objeto: "Maquinaria Pesada",
        clasificacion: "Clase B",
        condicion: "Mantenimiento al día",
        estado_conservacion: "Bueno",
        ubicacion_actual: "Planta Eléctrica Auxiliar - Zona Industrial Los Galpones, Maracaibo, Zulia",
        ultimo_lugar_conocido: "Subestación Cuatricentenario, Maracaibo",
        estado: "Zulia",
        fecha_registro: "2022-08-10",
        hora_registro: "11:00",
        imagen: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
        estado_registro: "aprobado",
        etiqueta: "green",
        antiguedadStage: "Estándar",
        condicionEstado: "Bueno",
    },
    {
        id: "demo-obj-004",
        _id: "507f1f77bcf86cd799439014",
        nombre: "Microscopio Óptico Binocular Olympus CX23",
        codigo: "LAB-MIC-2024-008",
        antiguedad: 1,
        categoria: "Tipo A",
        origen: "I",
        pais_origen: "Japón",
        tipo_objeto: "Equipo de Laboratorio",
        clasificacion: "Clase A",
        condicion: "Nuevo",
        estado_conservacion: "Excelente",
        ubicacion_actual: "Facultad de Ciencias y Farmacia, Mérida, Mérida",
        ultimo_lugar_conocido: "Almacén Central Universitario, Mérida",
        estado: "Mérida",
        fecha_registro: "2024-03-05",
        hora_registro: "16:45",
        imagen: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
        estado_registro: "aprobado",
        etiqueta: "green",
        antiguedadStage: "Nuevo",
        condicionEstado: "Óptimo",
    },
    {
        id: "demo-obj-005",
        _id: "507f1f77bcf86cd799439015",
        nombre: "Transformador Trifásico 500kVA PDVSA",
        codigo: "IND-TRF-2020-032",
        antiguedad: 6,
        categoria: "Tipo D",
        origen: "N",
        pais_origen: "Venezuela",
        tipo_objeto: "Componente Eléctrico Industrial",
        clasificacion: "Clase C",
        condicion: "Operativo",
        estado_conservacion: "Regular",
        ubicacion_actual: "Refinería El Palito - Almacén Técnico, Puerto Cabello, Carabobo",
        ultimo_lugar_conocido: "Complejo Refinador Paraguaná, Falcón",
        estado: "Carabobo",
        fecha_registro: "2020-05-18",
        hora_registro: "08:20",
        imagen: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
        estado_registro: "aprobado",
        etiqueta: "green",
        antiguedadStage: "Estándar",
        condicionEstado: "Regular",
    },
    {
        id: "demo-obj-006",
        _id: "507f1f77bcf86cd799439016",
        nombre: "Camioneta Pickup Toyota Hilux 4x4",
        codigo: "VEH-TOY-2023-019",
        antiguedad: 3,
        categoria: "Tipo B",
        origen: "I",
        pais_origen: "Japón",
        tipo_objeto: "Vehículo de Transporte Terrestre",
        clasificacion: "Clase A",
        condicion: "Operativo",
        estado_conservacion: "Muy Bueno",
        ubicacion_actual: "Estación de Guardaparques El Ávila, Caracas, Miranda",
        ultimo_lugar_conocido: "Sede INPARQUES Distribuidor Metropolitano",
        estado: "Miranda",
        fecha_registro: "2023-09-12",
        hora_registro: "10:10",
        imagen: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
        estado_registro: "aprobado",
        etiqueta: "green",
        antiguedadStage: "Estándar",
        condicionEstado: "Óptimo",
    },
    {
        id: "demo-obj-007",
        _id: "507f1f77bcf86cd799439017",
        nombre: "Osciloscopio Digital Rigol DS1054Z",
        codigo: "LAB-OSC-2024-002",
        antiguedad: 1,
        categoria: "Tipo A",
        origen: "I",
        pais_origen: "China",
        tipo_objeto: "Instrumento Electrónico",
        clasificacion: "Clase A",
        condicion: "Nuevo",
        estado_conservacion: "Excelente",
        ubicacion_actual: "Laboratorio de Telecomunicaciones UCAB, Caracas, Distrito Capital",
        ultimo_lugar_conocido: "Aduana Aérea de Maiquetía, La Guaira",
        estado: "Distrito Capital",
        fecha_registro: "2024-02-14",
        hora_registro: "13:40",
        imagen: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80",
        estado_registro: "aprobado",
        etiqueta: "green",
        antiguedadStage: "Nuevo",
        condicionEstado: "Óptimo",
    },
    {
        id: "demo-obj-008",
        _id: "507f1f77bcf86cd799439018",
        nombre: "Bomba Hidráulica Centrífuga Goulds 15HP",
        codigo: "HID-PMP-2021-045",
        antiguedad: 5,
        categoria: "Tipo C",
        origen: "I",
        pais_origen: "Estados Unidos",
        tipo_objeto: "Equipo Hidráulico",
        clasificacion: "Clase B",
        condicion: "Operativo",
        estado_conservacion: "Bueno",
        ubicacion_actual: "Planta de Tratamiento La Mariposa, Los Teques, Miranda",
        ultimo_lugar_conocido: "Almacén Hidrocapital La Yaguara, Caracas",
        estado: "Miranda",
        fecha_registro: "2021-10-04",
        hora_registro: "15:20",
        imagen: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
        estado_registro: "aprobado",
        etiqueta: "green",
        antiguedadStage: "Estándar",
        condicionEstado: "Bueno",
    },
    {
        id: "demo-obj-pending-001",
        _id: "507f1f77bcf86cd799439021",
        nombre: "Dron Profesional DJI Matrice 300 RTK",
        codigo: "DRN-DJI-2025-003",
        antiguedad: 1,
        categoria: "Tipo A",
        origen: "I",
        pais_origen: "China",
        tipo_objeto: "Vehículo Aéreo No Tripulado",
        clasificacion: "Clase A",
        condicion: "Inspección previa",
        estado_conservacion: "Excelente",
        ubicacion_actual: "Aeropuerto Caracas Óscar Machado Zuloaga, Charallave, Miranda",
        ultimo_lugar_conocido: "Hangar de Pruebas Técnicas, Charallave",
        estado: "Miranda",
        fecha_registro: "2025-01-20",
        hora_registro: "11:30",
        imagen: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80",
        estado_registro: "pendiente",
        etiqueta: "blue",
        antiguedadStage: "Nuevo",
        condicionEstado: "Óptimo",
    },
    {
        id: "demo-obj-pending-002",
        _id: "507f1f77bcf86cd799439022",
        nombre: "Espectrofotómetro UV-Vis Shimadzu UV-1800",
        codigo: "LAB-ESP-2025-001",
        antiguedad: 1,
        categoria: "Tipo B",
        origen: "I",
        pais_origen: "Japón",
        tipo_objeto: "Instrumento Analítico",
        clasificacion: "Clase A",
        condicion: "Por calibrar",
        estado_conservacion: "Nuevo",
        ubicacion_actual: "Instituto Venezolano de Investigaciones Científicas (IVIC), Altos de Pipe, Miranda",
        ultimo_lugar_conocido: "Depósito de Recepción IVIC",
        estado: "Miranda",
        fecha_registro: "2025-02-11",
        hora_registro: "15:00",
        imagen: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80",
        estado_registro: "pendiente",
        etiqueta: "blue",
        antiguedadStage: "Nuevo",
        condicionEstado: "Óptimo",
    },
    {
        id: "demo-obj-archived-001",
        _id: "507f1f77bcf86cd799439031",
        nombre: "Conmutador Telefónico Analógico Siemens EWSD",
        codigo: "TEL-SWT-1998-088",
        antiguedad: 28,
        categoria: "Tipo D",
        origen: "I",
        pais_origen: "Alemania",
        tipo_objeto: "Central Telefónica",
        clasificacion: "Clase D",
        condicion: "Obsolescencia tecnológica",
        estado_conservacion: "Regular",
        ubicacion_actual: "Depósito Histórico CANTV, San Martín, Caracas",
        ultimo_lugar_conocido: "Central Telefónica Los Cortijos, Caracas",
        estado: "Distrito Capital",
        fecha_registro: "2018-03-10",
        hora_registro: "10:00",
        imagen: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80",
        estado_registro: "rechazado",
        etiqueta: "blue",
        antiguedadStage: "Antiguo",
        condicionEstado: "Desincorporado",
    },
    {
        id: "demo-obj-archived-002",
        _id: "507f1f77bcf86cd799439032",
        nombre: "Torno Paralelo Mecánico Tos Trencin SN50",
        codigo: "MEC-TOR-1985-012",
        antiguedad: 41,
        categoria: "Tipo C",
        origen: "I",
        pais_origen: "República Checa",
        tipo_objeto: "Máquina Herramienta",
        clasificacion: "Clase D",
        condicion: "Desgaste severo de bancada",
        estado_conservacion: "Deteriorado",
        ubicacion_actual: "Galpón de Desincorporación SIDOR, Puerto Ordaz, Bolívar",
        ultimo_lugar_conocido: "Taller Mecánico Central SIDOR, Bolívar",
        estado: "Bolívar",
        fecha_registro: "2019-07-22",
        hora_registro: "14:30",
        imagen: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
        estado_registro: "rechazado",
        etiqueta: "blue",
        antiguedadStage: "Antiguo",
        condicionEstado: "Desincorporado",
    }
];

// In-Memory store for demo session
let demoObjetosStore: ObjetoResponseDTO[] = [...INITIAL_DEMO_OBJETOS];

export function getDemoObjetos(estado_registro = 'aprobado'): ObjetoResponseDTO[] {
    if (estado_registro === 'todos') {
        return [...demoObjetosStore];
    }
    return demoObjetosStore.filter(o => o.estado_registro === estado_registro);
}

export function addDemoObjeto(data: Partial<ObjetoResponseDTO>): ObjetoResponseDTO {
    const newId = `demo-obj-${Date.now()}`;
    const newObj: ObjetoResponseDTO = {
        id: newId,
        _id: `507f1f77bcf86cd7${Date.now().toString(16).slice(-8)}`,
        nombre: data.nombre || 'Objeto sin nombre',
        codigo: data.codigo || `OBJ-${Date.now().toString().slice(-4)}`,
        antiguedad: typeof data.antiguedad === 'number' ? data.antiguedad : 0,
        categoria: data.categoria || 'Tipo A',
        origen: data.origen || 'N',
        pais_origen: data.pais_origen || 'Venezuela',
        tipo_objeto: data.tipo_objeto || 'General',
        clasificacion: data.clasificacion || 'Clase A',
        condicion: data.condicion || 'Operativo',
        estado_conservacion: data.estado_conservacion || 'Bueno',
        ubicacion_actual: data.ubicacion_actual || 'Ubicación General',
        ultimo_lugar_conocido: data.ultimo_lugar_conocido || '',
        estado: data.estado || 'Distrito Capital',
        fecha_registro: data.fecha_registro || new Date().toISOString().split('T')[0],
        hora_registro: data.hora_registro || new Date().toTimeString().slice(0, 5),
        imagen: data.imagen || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        estado_registro: 'aprobado',
        etiqueta: 'green',
        antiguedadStage: (data.antiguedad || 0) <= 2 ? 'Nuevo' : (data.antiguedad || 0) <= 8 ? 'Reciente' : 'Estándar',
        condicionEstado: data.condicion || 'Óptimo',
    };
    demoObjetosStore.unshift(newObj);
    return newObj;
}

export function acceptDemoObjeto(id: string): boolean {
    const item = demoObjetosStore.find(o => o.id === id || o._id === id);
    if (item) {
        item.estado_registro = 'aprobado';
        item.etiqueta = 'green';
        return true;
    }
    return false;
}

export function rejectDemoObjeto(id: string): boolean {
    const item = demoObjetosStore.find(o => o.id === id || o._id === id);
    if (item) {
        item.estado_registro = 'rechazado';
        item.etiqueta = 'blue';
        return true;
    }
    return false;
}

export function restoreDemoObjeto(id: string): boolean {
    const item = demoObjetosStore.find(o => o.id === id || o._id === id);
    if (item) {
        item.estado_registro = 'aprobado';
        item.etiqueta = 'green';
        return true;
    }
    return false;
}

export function getDemoObjetoById(id: string): ObjetoResponseDTO | undefined {
    return demoObjetosStore.find(o => o.id === id || o._id === id);
}

export function updateDemoObjeto(id: string, updates: Partial<ObjetoResponseDTO>): ObjetoResponseDTO | null {
    const item = demoObjetosStore.find(o => o.id === id || o._id === id);
    if (!item) return null;
    Object.assign(item, updates);
    return item;
}

export function resetDemoStore(): void {
    demoObjetosStore = [...INITIAL_DEMO_OBJETOS];
}
