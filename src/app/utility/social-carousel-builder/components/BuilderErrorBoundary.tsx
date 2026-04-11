'use client';

import React from 'react';

interface BuilderErrorBoundaryProps {
    children: React.ReactNode;
}

interface BuilderErrorBoundaryState {
    hasError: boolean;
    message: string;
}

export class BuilderErrorBoundary extends React.Component<
    BuilderErrorBoundaryProps,
    BuilderErrorBoundaryState
> {
    constructor(props: BuilderErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            message: '',
        };
    }

    static getDerivedStateFromError(error: Error): BuilderErrorBoundaryState {
        return {
            hasError: true,
            message: error.message || 'The carousel builder hit an unexpected error.',
        };
    }

    componentDidCatch(error: Error) {
        console.error('social_carousel_builder_error', error);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                        Builder error
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-rose-950">
                        The carousel editor needs a refresh
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm text-rose-900">
                        {this.state.message} Your saved and recovery drafts stay in local storage, so you can reload
                        the page and continue editing.
                    </p>
                    <button
                        type="button"
                        onClick={this.handleReload}
                        className="mt-5 rounded-full bg-rose-700 px-5 py-3 text-sm font-medium text-white hover:bg-rose-800"
                    >
                        Reload builder
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
