import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  icon?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ChartErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[ChartErrorBoundary] ${this.props.title}:`, error, info.componentStack);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="dash-card dash-card--error">
          <div className="dash-card-header">
            <h3 className="dash-card-title">{this.props.title}</h3>
          </div>
          <div className="dash-card-error-body">
            <i className={`bi ${this.props.icon ?? "bi-exclamation-triangle"} dash-card-error-icon`} />
            <span className="dash-card-error-msg">Something went wrong</span>
            <button type="button" className="dash-card-error-retry" onClick={this.handleRetry}>
              <i className="bi bi-arrow-clockwise" /> Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ChartErrorBoundary;
