import React, { useEffect, useState, useRef } from 'react';
import { LanguageProvider, useLanguage } from './additionals/scripts/i18n';
import { sanitizeImageUrl } from '@/lib/sanitize';

interface Tweet {
    id: string;
    text: string;
    createdAt: string;
    formattedDate: string;
    author: {
        name: string;
        username: string;
        profileImage?: string;
    } | null;
    metrics: {
        retweet_count: number;
        reply_count: number;
        like_count: number;
    } | null;
}

interface TweetCarouselProps {
    autoScrollInterval?: number; // en milisegundos
}
function TweetCarouselContent({ autoScrollInterval = 5000 }: TweetCarouselProps) {
    const { translate } = useLanguage();
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await fetch('/api/tweets?type=project&count=10');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setTweets(data);
                setError(null);
            } catch (err) {
                setError(translate('Tweets-Error'));
                console.error('Error fetching tweets:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTweets();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-scroll
    useEffect(() => {
        if (tweets.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % tweets.length);
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [tweets.length, autoScrollInterval, isPaused]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + tweets.length) % tweets.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % tweets.length);
    };

    if (loading) {
        return (
            <div className="w-full py-8 bg-secondary border-y border-border theme-transition">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="text-muted-foreground">{translate('Tweets-Loading')}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || tweets.length === 0) {
        return null; // No mostrar nada si hay error o no hay tweets
    }

    return (
        <div
            className="w-full py-8 bg-secondary border-y border-border overflow-hidden theme-transition"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto px-4">
                <h2 className="text-lg font-semibold text-foreground mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {translate('Tweets-Title')}
                </h2>

                <div className="relative" ref={carouselRef}>
                    {/* Botón anterior */}
                    <button
                        onClick={goToPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card rounded-full shadow-lg hover:bg-accent transition-colors border border-border"
                        aria-label="Tweet anterior"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Contenedor de tweets */}
                    <div className="overflow-hidden mx-10">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {tweets.map((tweet) => (
                                <div key={tweet.id} className="w-full flex-shrink-0 px-4">
                                    <a
                                        href={`https://twitter.com/${tweet.author?.username}/status/${tweet.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-card rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow border border-border"
                                    >
                                        {/* Header del tweet */}
                                        <div className="flex items-center gap-3 mb-3">
                                            {tweet.author?.profileImage && (() => {
                                                const sanitizedProfileImage = sanitizeImageUrl(tweet.author.profileImage);
                                                return sanitizedProfileImage ? (
                                                    <img
                                                        src={sanitizedProfileImage}
                                                        alt={tweet.author.name || 'Profile'}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                ) : null;
                                            })()}
                                            <div className="flex-1">
                                                <p className="font-semibold text-foreground text-sm">
                                                    {tweet.author?.name || 'Unknown'}
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    @{tweet.author?.username || 'unknown'} · {tweet.formattedDate}
                                                </p>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </div>

                                        {/* Contenido del tweet */}
                                        <p className="text-muted-foreground text-sm line-clamp-3">
                                            {tweet.text}
                                        </p>

                                        {/* Métricas */}
                                        {tweet.metrics && (
                                            <div className="flex gap-4 mt-3 text-muted-foreground text-xs">
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    {tweet.metrics.reply_count}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    {tweet.metrics.retweet_count}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    {tweet.metrics.like_count}
                                                </span>
                                            </div>
                                        )}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botón siguiente */}
                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card rounded-full shadow-lg hover:bg-accent transition-colors border border-border"
                        aria-label="Tweet siguiente"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Indicadores de posición */}
                <div className="flex justify-center gap-2 mt-4">
                    {tweets.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex
                                ? 'bg-primary'
                                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                }`}
                            aria-label={`Ir al tweet ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function TweetCarousel() {
    return (
        <LanguageProvider>
            <TweetCarouselContent />
        </LanguageProvider>
    );
}