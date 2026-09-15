import { useEffect, useState, useRef } from 'react';
import { LanguageProvider, useLanguage } from './additionals/scripts/i18n';

interface Feature {
    id: string;
    icon: string;
    titleKey: string;
    descKey: string;
    tags: string[];
}

const features: Feature[] = [
    {
        id: 'search',
        icon: '🔍',
        titleKey: 'Feature-Search-Title',
        descKey: 'Feature-Search-Desc',
        tags: ['Real-time', 'Auto-detection', 'Pagination']
    },
    {
        id: 'analytics',
        icon: '📊',
        titleKey: 'Feature-Analytics-Title',
        descKey: 'Feature-Analytics-Desc',
        tags: ['Recharts', 'PDF Reports', 'Statistics']
    },
    {
        id: 'i18n',
        icon: '🌐',
        titleKey: 'Feature-I18n-Title',
        descKey: 'Feature-I18n-Desc',
        tags: ['ES/EN', 'Live Toggle', 'Full Coverage']
    },
    {
        id: 'security',
        icon: '🔒',
        titleKey: 'Feature-Security-Title',
        descKey: 'Feature-Security-Desc',
        tags: ['2FA', 'JWT', 'Turnstile', 'Rate Limiting']
    },
    {
        id: 'responsive',
        icon: '📱',
        titleKey: 'Feature-Responsive-Title',
        descKey: 'Feature-Responsive-Desc',
        tags: ['Mobile-first', 'Dark Mode', 'Smooth Transitions']
    },
    {
        id: 'cloud',
        icon: '☁️',
        titleKey: 'Feature-Cloud-Title',
        descKey: 'Feature-Cloud-Desc',
        tags: ['MongoDB', 'R2', 'Vercel', 'Redis']
    }
];

interface FeatureShowcaseProps {
    autoScrollInterval?: number;
}

function FeatureShowcaseContent({ autoScrollInterval = 5000 }: FeatureShowcaseProps) {
    const { translate } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (features.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % features.length);
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [autoScrollInterval, isPaused]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % features.length);
    };

    return (
        <div
            className="w-full py-8 bg-secondary border-y border-border overflow-hidden theme-transition"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto px-4">
                <h2 className="text-lg font-semibold text-foreground mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {translate('Features-Title')}
                </h2>

                <div className="relative" ref={carouselRef}>
                    {/* Previous button */}
                    <button
                        onClick={goToPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card rounded-full shadow-lg hover:bg-accent transition-colors border border-border"
                        aria-label="Previous feature"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Feature cards container */}
                    <div className="overflow-hidden mx-10">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {features.map((feature) => (
                                <div key={feature.id} className="w-full flex-shrink-0 px-4">
                                    <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
                                        {/* Icon */}
                                        <div className="text-5xl mb-4 text-center">{feature.icon}</div>

                                        {/* Title */}
                                        <h3 className="text-xl font-semibold text-foreground mb-3 text-center">
                                            {translate(feature.titleKey as any)}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-muted-foreground text-sm text-center mb-4">
                                            {translate(feature.descKey as any)}
                                        </p>

                                        {/* Tech tags */}
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {feature.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next button */}
                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card rounded-full shadow-lg hover:bg-accent transition-colors border border-border"
                        aria-label="Next feature"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Position indicators */}
                <div className="flex justify-center gap-2 mt-4">
                    {features.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex
                                ? 'bg-primary'
                                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                }`}
                            aria-label={`Go to feature ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function FeatureShowcase() {
    return (
        <LanguageProvider>
            <FeatureShowcaseContent />
        </LanguageProvider>
    );
}
