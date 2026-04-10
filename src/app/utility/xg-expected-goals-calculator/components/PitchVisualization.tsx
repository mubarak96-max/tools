'use client';

import { useState, useCallback } from 'react';
import type { ShotPosition } from '../types/xg-types';
import { calculateDistanceToGoal, calculateAngleToGoal, getPitchZone } from '../lib/pitch-geometry';

interface PitchVisualizationProps {
    shotPosition?: ShotPosition;
    onShotPositionChange: (position: ShotPosition) => void;
    showXGHeatmap?: boolean;
    className?: string;
}

export default function PitchVisualization({
    shotPosition,
    onShotPositionChange,
    showXGHeatmap = false,
    className = ''
}: PitchVisualizationProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handlePitchClick = useCallback((event: React.MouseEvent<SVGElement>) => {
        const svg = event.currentTarget;
        const rect = svg.getBoundingClientRect();

        // Calculate position as percentage of pitch
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        // Ensure position is within bounds
        const boundedX = Math.max(0, Math.min(100, x));
        const boundedY = Math.max(0, Math.min(100, y));

        onShotPositionChange({ x: boundedX, y: boundedY });
    }, [onShotPositionChange]);

    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseMove = useCallback((event: React.MouseEvent<SVGElement>) => {
        if (!isDragging) return;
        handlePitchClick(event);
    }, [isDragging, handlePitchClick]);

    // Generate xG heatmap data (simplified grid)
    const generateHeatmapData = () => {
        const gridSize = 10;
        const heatmapData = [];

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                const position = {
                    x: (x / (gridSize - 1)) * 100,
                    y: (y / (gridSize - 1)) * 100
                };

                const distance = calculateDistanceToGoal(position);
                const angle = calculateAngleToGoal(position);

                // Simplified xG calculation for heatmap
                const distanceFactor = Math.exp(-0.15 * (distance / 10));
                const angleFactor = Math.min(angle / 180, 1);
                const xg = Math.min(0.8, distanceFactor * angleFactor * 0.6);

                heatmapData.push({
                    x: position.x,
                    y: position.y,
                    xg,
                    opacity: Math.max(0.1, xg)
                });
            }
        }

        return heatmapData;
    };

    const heatmapData = showXGHeatmap ? generateHeatmapData() : [];

    return (
        <div className={`relative ${className}`}>
            <svg
                viewBox="0 0 100 100"
                className="w-full h-auto border border-border rounded-lg bg-green-50 cursor-crosshair"
                onClick={handlePitchClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
            >
                {/* Pitch background */}
                <rect width="100" height="100" fill="#22c55e" fillOpacity="0.1" />

                {/* xG Heatmap */}
                {showXGHeatmap && heatmapData.map((point, index) => (
                    <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#ef4444"
                        fillOpacity={point.opacity}
                    />
                ))}

                {/* Pitch markings */}
                {/* Outer boundary */}
                <rect
                    x="2"
                    y="2"
                    width="96"
                    height="96"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.5"
                />

                {/* Center line */}
                <line
                    x1="2"
                    y1="50"
                    x2="98"
                    y2="50"
                    stroke="#16a34a"
                    strokeWidth="0.3"
                />

                {/* Center circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="9.15"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.3"
                />

                {/* Center spot */}
                <circle cx="50" cy="50" r="0.5" fill="#16a34a" />

                {/* Goal areas */}
                {/* Top goal area (penalty area) */}
                <rect
                    x="18.3"
                    y="2"
                    width="63.4"
                    height="15.7"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.3"
                />

                {/* Top six-yard box */}
                <rect
                    x="36.8"
                    y="2"
                    width="26.4"
                    height="5.7"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.3"
                />

                {/* Bottom goal area (penalty area) */}
                <rect
                    x="18.3"
                    y="82.3"
                    width="63.4"
                    height="15.7"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.3"
                />

                {/* Bottom six-yard box */}
                <rect
                    x="36.8"
                    y="92.3"
                    width="26.4"
                    height="5.7"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.3"
                />

                {/* Goals */}
                {/* Top goal */}
                <rect
                    x="43.4"
                    y="0"
                    width="13.2"
                    height="2"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.8"
                />

                {/* Bottom goal */}
                <rect
                    x="43.4"
                    y="98"
                    width="13.2"
                    height="2"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.8"
                />

                {/* Penalty spots */}
                <circle cx="50" cy="10.5" r="0.3" fill="#16a34a" />
                <circle cx="50" cy="89.5" r="0.3" fill="#16a34a" />

                {/* Corner arcs */}
                <path
                    d="M 2 2 A 1 1 0 0 0 3 3"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.3"
                />
                <path
                    d="M 98 2 A 1 1 0 0 1 97 3"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.3"
                />
                <path
                    d="M 2 98 A 1 1 0 0 1 3 97"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.3"
                />
                <path
                    d="M 98 98 A 1 1 0 0 0 97 97"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="0.3"
                />

                {/* Shot position marker */}
                {shotPosition && (
                    <g>
                        {/* Distance line to goal */}
                        <line
                            x1={shotPosition.x}
                            y1={shotPosition.y}
                            x2="50"
                            y2="2"
                            stroke="#ef4444"
                            strokeWidth="0.2"
                            strokeDasharray="1,1"
                            opacity="0.6"
                        />

                        {/* Angle lines to goal posts */}
                        <line
                            x1={shotPosition.x}
                            y1={shotPosition.y}
                            x2="43.4"
                            y2="2"
                            stroke="#f97316"
                            strokeWidth="0.2"
                            strokeDasharray="1,1"
                            opacity="0.6"
                        />
                        <line
                            x1={shotPosition.x}
                            y1={shotPosition.y}
                            x2="56.6"
                            y2="2"
                            stroke="#f97316"
                            strokeWidth="0.2"
                            strokeDasharray="1,1"
                            opacity="0.6"
                        />

                        {/* Shot marker */}
                        <circle
                            cx={shotPosition.x}
                            cy={shotPosition.y}
                            r="1.5"
                            fill="#ef4444"
                            stroke="#ffffff"
                            strokeWidth="0.3"
                            className="cursor-move"
                        />

                        {/* Shot marker glow */}
                        <circle
                            cx={shotPosition.x}
                            cy={shotPosition.y}
                            r="2.5"
                            fill="#ef4444"
                            fillOpacity="0.3"
                            className="animate-pulse"
                        />
                    </g>
                )}
            </svg>

            {/* Pitch info */}
            <div className="mt-2 text-xs text-muted-foreground">
                <div className="flex justify-between items-center">
                    <span>Click anywhere on the pitch to place a shot</span>
                    {shotPosition && (
                        <span>
                            Zone: {getPitchZone(shotPosition).replace('_', ' ')}
                        </span>
                    )}
                </div>
                {shotPosition && (
                    <div className="mt-1 flex gap-4 text-xs">
                        <span>Distance: {calculateDistanceToGoal(shotPosition).toFixed(1)}m</span>
                        <span>Angle: {calculateAngleToGoal(shotPosition).toFixed(1)}°</span>
                    </div>
                )}
            </div>
        </div>
    );
}