import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || 'An unexpected runtime error occurred.';
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 bg-stone-950 text-white font-sans">
          <div className="max-w-lg w-full bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  {this.props.fallbackTitle || 'Component Error'}
                </h3>
                <p className="text-xs text-stone-400">
                  A rendering error was safely intercepted by the Error Boundary.
                </p>
              </div>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-2">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                Error Details:
              </span>
              <p className="font-mono text-xs text-rose-300 break-words leading-relaxed">
                {errorMsg}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <a
                href="/"
                className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-stone-700"
              >
                <Home className="w-4 h-4" />
                <span>Return to Site</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
