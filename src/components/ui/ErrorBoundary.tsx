import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught WebGL/Canvas error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Graceful fallback: render a beautiful static color gradient background instead of a crashed UI
      return (
        <div 
          className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-[#050505]"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.12) 0%, #050505 100%)",
          }}
        />
      );
    }

    return this.props.children;
  }
}
