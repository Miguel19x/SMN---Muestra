import { Component } from "react";
import type { ErrorInfo } from "react";
import type { Props, State } from "../type/types";

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Aquí podrías enviar el error a un servicio de registro de errores
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Lo sentimos, ha ocurrido un error.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;