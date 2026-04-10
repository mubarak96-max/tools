import { renderHook, act } from '@testing-library/react';
import { useTextEditing } from '../hooks/useTextEditing';

// Mock the onElementUpdate function
const mockOnElementUpdate = jest.fn();

describe('useTextEditing', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should initialize with default state', () => {
        const { result } = renderHook(() => useTextEditing({
            onElementUpdate: mockOnElementUpdate
        }));

        expect(result.current.editingElementId).toBeNull();
        expect(result.current.showToolbar).toBe(false);
        expect(result.current.showEditor).toBe(false);
        expect(result.current.toolbarPosition).toBeNull();
    });

    it('should start text editing with toolbar', () => {
        const { result } = renderHook(() => useTextEditing({
            onElementUpdate: mockOnElementUpdate
        }));

        const position = { x: 100, y: 200 };

        act(() => {
            result.current.startTextEditing('element-1', position);
        });

        expect(result.current.editingElementId).toBe('element-1');
        expect(result.current.showToolbar).toBe(true);
        expect(result.current.showEditor).toBe(false);
        expect(result.current.toolbarPosition).toEqual(position);
    });

    it('should open text editor', () => {
        const { result } = renderHook(() => useTextEditing({
            onElementUpdate: mockOnElementUpdate
        }));

        act(() => {
            result.current.openTextEditor('element-1');
        });

        expect(result.current.editingElementId).toBe('element-1');
        expect(result.current.showToolbar).toBe(false);
        expect(result.current.showEditor).toBe(true);
    });

    it('should stop text editing', () => {
        const { result } = renderHook(() => useTextEditing({
            onElementUpdate: mockOnElementUpdate
        }));

        // Start editing first
        act(() => {
            result.current.startTextEditing('element-1');
        });

        // Then stop
        act(() => {
            result.current.stopTextEditing();
        });

        expect(result.current.editingElementId).toBeNull();
        expect(result.current.showToolbar).toBe(false);
        expect(result.current.showEditor).toBe(false);
        expect(result.current.toolbarPosition).toBeNull();
    });

    it('should handle single click to show toolbar', () => {
        const { result } = renderHook(() => useTextEditing({
            onElementUpdate: mockOnElementUpdate
        }));

        const position = { x: 100, y: 200 };
        const mockEvent = {
            clientX: position.x,
            clientY: position.y
        } as React.MouseEvent;

        act(() => {
            result.current.handleTextElementClick('element-1', position, mockEvent);
        });

        // Fast-forward time to trigger single click timeout
        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(result.current.editingElementId).toBe('element-1');
        expect(result.current.showToolbar).toBe(true);
        expect(result.current.showEditor).toBe(false);
    });

    it('should handle double click to open editor', () => {
        const { result } = renderHook(() => useTextEditing({
            onElementUpdate: mockOnElementUpdate
        }));

        const position = { x: 100, y: 200 };
        const mockEvent = {
            clientX: position.x,
            clientY: position.y
        } as React.MouseEvent;

        // First click
        act(() => {
            result.current.handleTextElementClick('element-1', position, mockEvent);
        });

        // Second click within 300ms
        act(() => {
            jest.advanceTimersByTime(100);
            result.current.handleTextElementClick('element-1', position, mockEvent);
        });

        expect(result.current.editingElementId).toBe('element-1');
        expect(result.current.showToolbar).toBe(false);
        expect(result.current.showEditor).toBe(true);
    });

    it('should update text content', () => {
        const { result } = renderHook(() => useTextEditing({
            onElementUpdate: mockOnElementUpdate
        }));

        act(() => {
            result.current.updateTextContent('element-1', 'New text content');
        });

        expect(mockOnElementUpdate).toHaveBeenCalledWith('element-1', {
            content: 'New text content'
        });
    });

    it('should update text style', () => {
        const { result } = renderHook(() => useTextEditing({
            onElementUpdate: mockOnElementUpdate
        }));

        const styleUpdates = {
            fontSize: 24,
            color: '#ff0000',
            fontWeight: 'bold'
        };

        act(() => {
            result.current.updateTextStyle('element-1', styleUpdates);
        });

        expect(mockOnElementUpdate).toHaveBeenCalledWith('element-1', {
            style: styleUpdates
        });
    });

    it('should handle keyboard shortcuts', () => {
        const { result } = renderHook(() => useTextEditing({
            onElementUpdate: mockOnElementUpdate
        }));

        // Start editing
        act(() => {
            result.current.startTextEditing('element-1');
        });

        // Simulate Escape key
        act(() => {
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            window.dispatchEvent(escapeEvent);
        });

        expect(result.current.editingElementId).toBeNull();
        expect(result.current.showToolbar).toBe(false);
    });

    it('should handle Enter key to open editor', () => {
        const { result } = renderHook(() => useTextEditing({
            onElementUpdate: mockOnElementUpdate
        }));

        // Start with toolbar
        act(() => {
            result.current.startTextEditing('element-1');
        });

        // Simulate Enter key
        act(() => {
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            window.dispatchEvent(enterEvent);
        });

        expect(result.current.editingElementId).toBe('element-1');
        expect(result.current.showToolbar).toBe(false);
        expect(result.current.showEditor).toBe(true);
    });
});