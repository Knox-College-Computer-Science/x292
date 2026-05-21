import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for now; could forward to telemetry
    // eslint-disable-next-line no-console
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.error)}
          </pre>
          <p>Please check the browser console for details.</p>
        </div>
      );
    }

    return this.props.children as JSX.Element;
  }
}
