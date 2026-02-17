import { LanguageProvider, useLanguage } from './additionals/scripts/i18n';

interface DeceasedPerson {
    date: string;
    name: string;
    age: number | string;
}

const fallecidos: DeceasedPerson[] = [
    { date: "28/7/2024", name: "Julio Valerio García", age: 40 },
    { date: "29/7/2024", name: "Jesús Tovar", age: 21 },
    { date: "29/7/2024", name: "Jhon A. Graterol M.", age: 19 },
    { date: "29/7/2024", name: "Isaías Fuenmayor", age: 15 },
    { date: "29/7/2024", name: "Olinger Montaño", age: 23 },
    { date: "29/7/2024", name: "Antoni Cañizález", age: 19 },
    { date: "29/7/2024", name: "Jeison J. Bracho M.", age: 22 },
    { date: "29/7/2024", name: "Rances Izarra", age: 30 },
    { date: "29/7/2024", name: "Carlos Porras", age: 26 },
    { date: "29/7/2024", name: "Jesús R. Medina P.", age: 56 },
    { date: "29/7/2024", name: "Gustavo Rojas", age: 29 },
    { date: "29/7/2024", name: "José A. Torres", age: "ND" },
    { date: "29/7/2024", name: "Antonhy D. Moya M.", age: 24 },
    { date: "29/7/2024", name: "Jeison G. España G.", age: 18 },
    { date: "29/7/2024", name: "Eurisjunior Mendoza", age: 24 },
    { date: "29/7/2024", name: "Edgar A. Aristeguieta", age: 42 },
    { date: "29/7/2024", name: "Anibal J. Romero S.", age: 26 },
    { date: "29/7/2024", name: "Dorian Rondón", age: 22 },
    { date: "30/7/2024", name: "Victor Bustos", age: 34 },
    { date: "30/7/2024", name: "Yorgenis E. Leyva M.", age: 35 },
    { date: "31/7/2024", name: "Luis E. Roberto H.", age: 19 },
    { date: "02/8/2024", name: "Gabriel Ramos", age: 33 },
    { date: "04/8/2024", name: "Walter Páez Lucena", age: 29 },
    { date: "21/8/2024", name: "Andrés Ramírez", age: 36 },
];

function DeceasedCard({ date, name, age }: DeceasedPerson) {
    const { translate, currentLang } = useLanguage();

    const ageLabel = currentLang === 'en' ? 'years' : 'años';
    const ageDisplay = age === "ND" ? "N/D" : `${age} ${ageLabel}`;

    return (
        <article className="group bg-slate-900/95 border border-slate-700/50 rounded-xl shadow-lg hover:shadow-2xl hover:border-slate-500/50 hover:scale-[1.02] transition-all duration-300 ease-out">
            <div className="p-5 sm:p-6 flex flex-col min-h-[140px]">
                {/* Date - Secondary, top */}
                <time className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide uppercase mb-2">
                    {date}
                </time>

                {/* Name - Primary, prominent */}
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white leading-tight mb-4 group-hover:text-blue-200 transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {name}
                </h3>

                {/* Age - Badge at bottom */}
                <div className="mt-auto">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-blue-950/80 text-blue-200 border border-blue-800/50">
                        {ageDisplay}
                    </span>
                </div>
            </div>
        </article>
    );
}

function ListadoFallecidosContent() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {fallecidos.map((persona, index) => (
                <DeceasedCard key={index} {...persona} />
            ))}
        </div>
    );
}

export default function ListadoFallecidos() {
    return (
        <LanguageProvider>
            <ListadoFallecidosContent />
        </LanguageProvider>
    );
}
