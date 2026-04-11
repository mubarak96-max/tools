'use client';

import { useState, useEffect } from 'react';

export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Set initial value after mount (avoids SSR mismatch)
        const initial = window.innerWidth < 768;
        setIsMobile(initial);
        
        const handler = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    return isMobile;
}