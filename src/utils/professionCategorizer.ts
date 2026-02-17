/**
 * Utility function to categorize professions into standard groups
 * Used across StatsEngine, PanelEngine, and MotorDeBusqueda
 */

// Profession category definitions with their respective keywords
export const PROFESSION_CATEGORIES = {
    estudiantes: {
        emoji: '🎓',
        label: 'Estudiantes',
        keywords: ['estudiante', 'bachiller', 'universitario', 'universitaria', 'licenciatura',
            'cursando', 'alumno', 'alumna', 'escolar', 'tsu', 'semestre']
    },
    deportistas: {
        emoji: '⚽',
        label: 'Deportistas',
        keywords: ['deportista', 'atleta', 'futbolista', 'beisbol', 'boxeador', 'boxeadora',
            'nadador', 'nadadora', 'basketbol', 'voleibol', 'jugador', 'jugadora',
            'entrenador', 'entrenadora', 'ciclista', 'corredor', 'corredora']
    },
    comerciantes: {
        emoji: '🛒',
        label: 'Comerciantes',
        keywords: ['comerciante', 'vendedor', 'vendedora', 'emprendedor', 'emprendedora',
            'negociante', 'tienda', 'buhonero', 'buhonera', 'ambulante', 'ventas']
    },
    salud: {
        emoji: '⚕️',
        label: 'Salud',
        keywords: ['médico', 'médica', 'doctor', 'doctora', 'enfermero', 'enfermera',
            'salud', 'hospital', 'bioanalista', 'odontólogo', 'odontóloga', 'farmac']
    },
    abogados: {
        emoji: '⚖️',
        label: 'Abogados',
        keywords: ['abogado', 'abogada', 'derecho', 'jurídico', 'jurídica', 'fiscal', 'juez', 'jueza']
    },
    tecnicos: {
        emoji: '🔧',
        label: 'Ingenieros/Técnicos',
        keywords: ['ingeniero', 'ingeniera', 'técnico', 'técnica', 'sistemas', 'programador',
            'programadora', 'informática', 'electrónic', 'mecánico', 'mecánica']
    },
    docentes: {
        emoji: '📚',
        label: 'Docentes',
        keywords: ['profesor', 'profesora', 'maestro', 'maestra', 'docente', 'educador',
            'educadora', 'instructor', 'instructora']
    },
    artistas: {
        emoji: '🎵',
        label: 'Músicos/Artistas',
        keywords: ['músico', 'música', 'cantante', 'compositor', 'compositora', 'guitarrista',
            'pianista', 'baterista', 'bajista', 'violinista', 'saxofonista', 'dj',
            'rapero', 'rapera', 'reggaetonero', 'reggaetonera', 'artista musical', 'músicos', 'banda']
    },
    obreros: {
        emoji: '🔨',
        label: 'Trabajadores manuales',
        keywords: ['obrero', 'obrera', 'albañil', 'construcción', 'carpintero', 'carpintera',
            'plomero', 'plomera', 'electricista', 'soldador', 'soldadora', 'pintor', 'pintora']
    },
    transporte: {
        emoji: '🚗',
        label: 'Transporte',
        keywords: ['chofer', 'conductor', 'conductora', 'taxista', 'motorizado', 'motorizada',
            'mototaxista', 'transportista']
    },
    seguridad: {
        emoji: '🛡️',
        label: 'Seguridad',
        keywords: ['vigilante', 'seguridad', 'guardia', 'policía', 'militar', 'gnb']
    },
    agricultura: {
        emoji: '🌾',
        label: 'Agricultura',
        keywords: ['agricultor', 'agricultora', 'campesino', 'campesina', 'ganadero', 'ganadera',
            'pescador', 'pescadora', 'granjero', 'granjera']
    },
    medios: {
        emoji: '📰',
        label: 'Periodistas/Medios',
        keywords: ['periodista', 'comunicador', 'comunicadora', 'reportero', 'reportera',
            'camarógrafo', 'camarógrafa', 'fotógrafo', 'fotógrafa', 'locutor', 'locutora',
            'prensa', 'medios', 'youtuber', 'influencer', 'streamer']
    },
    politicos: {
        emoji: '🏛️',
        label: 'Políticos',
        keywords: ['político', 'política', 'diputado', 'diputada', 'concejal', 'concejala',
            'alcalde', 'alcaldesa', 'gobernador', 'gobernadora', 'dirigente', 'dirigenta',
            'vente venezuela', 'voluntad popular', 'primero justicia', 'un nuevo tiempo',
            'comando', 'activista político', 'opositor', 'opositora', 'oposición', 'partido']
    },
    ddhh: {
        emoji: '✊',
        label: 'Defensores DDHH',
        keywords: ['ddhh', 'derechos humanos', 'ong', 'activista', 'defensor', 'defensora',
            'provea', 'foro penal', 'cofavic', 'observatorio', 'sociedad civil',
            'voluntario', 'voluntaria', 'humanitario', 'humanitaria']
    }
};

/**
 * Categorizes a profession string into one of the predefined categories
 * @param profesion - The profession string to categorize
 * @returns Formatted string with emoji and category label
 */
export function categorizarProfesion(profesion: string): string {
    const prof = profesion.toLowerCase().trim();

    for (const [, category] of Object.entries(PROFESSION_CATEGORIES)) {
        if (category.keywords.some(keyword => prof.includes(keyword))) {
            return `${category.emoji} ${category.label}`;
        }
    }

    // If no category matches, return capitalized version
    return profesion.charAt(0).toUpperCase() + profesion.slice(1);
}

/**
 * Gets all search keywords for a given category key
 * Useful for enabling search by profession category
 */
export function getProfessionKeywords(categoryKey: keyof typeof PROFESSION_CATEGORIES): string[] {
    return PROFESSION_CATEGORIES[categoryKey]?.keywords || [];
}

/**
 * Gets all category labels for dropdown filters
 */
export function getProfessionCategoryLabels(): { key: string; label: string; emoji: string }[] {
    return Object.entries(PROFESSION_CATEGORIES).map(([key, value]) => ({
        key,
        label: value.label,
        emoji: value.emoji
    }));
}

/**
 * Check if a profession matches any keyword in any category
 * Returns true if the profession contains any known keyword
 */
export function matchesProfessionKeyword(profesion: string, searchTerm: string): boolean {
    const prof = profesion.toLowerCase();
    const term = searchTerm.toLowerCase();

    // Direct match
    if (prof.includes(term)) return true;

    // Check if searching by category label
    for (const category of Object.values(PROFESSION_CATEGORIES)) {
        if (category.label.toLowerCase().includes(term)) {
            // If searching for a category, check if profession matches any keyword in that category
            return category.keywords.some(keyword => prof.includes(keyword));
        }
    }

    return false;
}
