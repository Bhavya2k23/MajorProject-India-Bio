import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center space-y-6 shadow-xl animate-scale-in">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We encountered an unexpected error while rendering this page. Don't worry, your data is safe.
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-xl text-left border border-border/50 overflow-auto max-h-32">
              <code className="text-xs text-red-400 font-mono">
                {this.state.error?.message || "Unknown error occurred"}
              </code>
            </div>

            <Button 
              onClick={this.handleReset}
              className="w-full gap-2 font-bold"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Return to Homepage
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
