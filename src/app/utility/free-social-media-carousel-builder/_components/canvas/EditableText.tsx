'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Props {
    value: string;
    style: React.CSSProperties;
    readOnly?: boolean;
    multiline?: boolean;
    onCommit?: (value: string) => void;
}

export function EditableText({ value, style, readOnly, multiline, onCommit }: Props) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

    useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);
    useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

    const commit = () => { setEditing(false); onCommit?.(draft); };

    if (readOnly) return <div style={style}>{value}</div>;

    if (editing) {
        const shared = {
            ref: ref as React.Ref<any>,
            value: draft,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setDraft(e.target.value),
            onBlur: commit,
            onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === 'Escape') { setDraft(value); setEditing(false); }
                if (!multiline && e.key === 'Enter') commit();
            },
            style: { ...style, background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.6)', borderRadius: 4, outline: 'none', resize: 'none' as const, padding: '2px 6px', width: '100%', fontFamily: 'inherit' },
        };
        return multiline ? <textarea {...shared} rows={3} /> : <input {...shared} type="text" />;
    }

    return (
        <div
            style={{ ...style, cursor: 'text', borderRadius: 4, padding: '2px 4px', transition: 'background 0.15s' }}
            onClick={() => setEditing(true)}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
            {value}
        </div>
    );
}