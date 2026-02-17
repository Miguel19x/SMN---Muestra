import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    componentName?: string;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Universal
 * 
 * Envuelve componentes React para capturar errores y prevenir
 * que toda la aplicación se rompa.
 * 
 * Uso:
 * <UniversalErrorBoundary componentName="MotorDeBusqueda">
 *   <ComponentQuePuedeFallar />
 * </UniversalErrorBoundary>
 * 
 * Features:
 * - Logging automático de errores
 * - UI de fallback personalizable
 * - Reintentar carga del componente
 * - Reportar errores a servicio externo (opcional)
 */
export class UniversalErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log del error
        const componentName = this.props.componentName || 'Componente desconocido';

        console.error(`[Error Boundary] Error en ${componentName}:`, {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
        });

        // Guardar info del error en el estado
        this.setState({
            errorInfo
        });

        // Callback personalizado (ej: enviar a Sentry)
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // En producción, podrías enviar a un servicio de logging
        if (process.env.NODE_ENV === 'production') {
            // Ejemplo: Sentry.captureException(error, { contexts: { react: errorInfo } });
            // O tu servicio de logging preferido
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            // Si hay un fallback personalizado, renderizarlo
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // UI de fallback por defecto
            const componentName = this.props.componentName || 'este componente';
            const isDevelopment = process.env.NODE_ENV === 'development';

            return (
                <div className="min-h-[200px] flex items-center justify-center p-8">
                    <div className="max-w-md w-full bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
                        <div className="mb-4">
                            <svg
                                className="w-12 h-12 mx-auto text-destructive"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            Error al cargar {componentName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Ocurrió un problema inesperado. Por favor, intenta recargar la página.
                        </p>

                        {isDevelopment && this.state.error && (
                            <details className="text-left mb-4 bg-background/50 rounded p-3">
                                <summary className="cursor-pointer text-xs font-mono text-destructive mb-2">
                                    Detalles del error (solo en desarrollo)
                                </summary>
                                <pre className="text-xs overflow-auto max-h-40 text-foreground/70">
                                    {this.state.error.message}
                                    {'\n\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                            >
                                Reintentar
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors text-sm font-medium"
                            >
                                Recargar página
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default UniversalErrorBoundary;
