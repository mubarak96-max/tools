'use client';

import React, { useState } from 'react';
import { useEditorStore } from '../_store/useEditorStore';

interface Props {
    niche?: string;
    defaultTopic?: string;
}

export function AIInput({ niche, defaultTopic }: Props) {
    const [topic, setTopic] = useState(defaultTopic ?? '');
    const { generateFromAI, isGenerating, generationError, canUseAI, aiUsage } = useEditorStore();

    const remaining = Math.max(0, 2 - aiUsage.count);
    const isOverLimit = !canUseAI();

    const handleGenerate = async () => {
        if (!topic.trim() || isGenerating || isOverLimit) return;
        await generateFromAI(topic.trim(), niche);
    };

    return (
        <div className="w-full bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="max-w-2xl mx-auto flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        placeholder="What is your carousel about? (e.g. '5 tips for better sleep')"
                        disabled={isGenerating || isOverLimit}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-violet-400 disabled:opacity-50 bg-white"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={!topic.trim() || isGenerating || isOverLimit}
                        className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                    >
                        {isGenerating ? 'Generating…' : 'Generate'}
                    </button>
                </div>

                {/* Usage indicator */}
                {!isOverLimit && (
                    <p className="text-xs text-gray-400">
                        {remaining} of 2 free generations remaining this hour
                    </p>
                )}

                {/* Rate limit message */}
                {isOverLimit && (
                    <p className="text-xs text-amber-600">
                        Generation limit reached. Resets in 1 hour — or edit slides manually below.
                    </p>
                )}

                {/* Error message */}
                {generationError && (
                    <p className="text-xs text-red-500">{generationError}</p>
                )}
            </div>
        </div>
    );
}