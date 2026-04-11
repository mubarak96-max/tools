'use client';

import React, { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { canUseAI, getAIUsageStatus } from '../utils/ai';

interface AIInputProps {
    niche?: string;
    defaultTopic?: string;
    placeholder?: string;
    suggestedTopics?: string[];
}

export const AIInput: React.FC<AIInputProps> = ({
    niche,
    defaultTopic,
    placeholder,
    suggestedTopics
}) => {
    const [topic, setTopic] = useState('');
    const { aiUsage, isGenerating, generateCarousel } = useEditorStore();

    const aiStatus = getAIUsageStatus(aiUsage);

    const handleGenerate = async () => {
        if (!topic.trim() || !aiStatus.canUse || isGenerating) return;

        await generateCarousel(topic.trim(), niche);
        setTopic(''); // Clear input after generation
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGenerate();
        }
    };

    const handleSuggestedTopic = (suggestedTopic: string) => {
        setTopic(suggestedTopic);
    };

    const inputPlaceholder = placeholder || "e.g., Instagram growth tips, productivity hacks, business advice...";

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    What is your carousel about?
                </h2>
                <p className="text-gray-600">
                    {niche
                        ? `Enter your ${niche.replace('-', ' ')} topic and we'll generate a high-performing carousel in seconds`
                        : 'Enter your topic and we\'ll generate a high-performing carousel in seconds'
                    }
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={inputPlaceholder}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={200}
                        disabled={isGenerating}
                    />

                    <button
                        onClick={handleGenerate}
                        disabled={!topic.trim() || !aiStatus.canUse || isGenerating}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                {/* Suggested Topics */}
                {suggestedTopics && suggestedTopics.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Popular topics:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedTopics.map((suggestedTopic, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestedTopic(suggestedTopic)}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                    disabled={isGenerating}
                                >
                                    {suggestedTopic}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Usage Status */}
                <div className="mt-4 text-center">
                    {aiStatus.canUse ? (
                        <p className="text-sm text-gray-600">
                            {aiStatus.remaining} generation{aiStatus.remaining !== 1 ? 's' : ''} remaining this hour
                        </p>
                    ) : (
                        <p className="text-sm text-red-600">
                            Generation limit reached. Try again in {Math.ceil(aiStatus.resetIn / 60000)} minutes.
                        </p>
                    )}
                </div>

                {/* Character count */}
                <div className="mt-2 text-right">
                    <span className={`text-xs ${topic.length > 180 ? 'text-red-500' : 'text-gray-400'}`}>
                        {topic.length}/200
                    </span>
                </div>
            </div>
        </div>
    );
};