import React from 'react';

type Props = { fallback?: React.ReactNode; children: React.ReactNode };
type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error } as State;
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ padding: 24 }}>
          <div className="alert alert-danger" role="alert">
            Something went wrong loading this page.
          </div>
          <button className="btn btn-outline-secondary" onClick={() => window.history.back()}>Go back</button>
        </div>
      );
    }
    return this.props.children;
  }
}
