import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecipeDisplay } from '../app/components/RecipeDisplay';
import { useRouter } from 'next/navigation';
import { handleDeleteRecipe } from '../app/actions';
import type { Recipe } from '../app/schema';


// Mock the next/navigation module
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock the actions module
jest.mock('../../../app/actions', () => ({
    handleDeleteRecipe: jest.fn(),
}));

// Mock the Timer component
jest.mock('../../../app/components/Timer', () => ({
    Timer: () => <div data-testid="mock-timer">Timer Component</div>,
}));

// Mock window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
    value: mockConfirm,
    writable: true,
});

describe('RecipeDisplay', () => {
    const mockRecipe: Recipe = {
        id: '1',
        name: 'Test Recipe',
        data: {
            ingredients: [
                { amount: '2', unit: 'cups', name: 'flour' },
                { amount: '1', unit: 'tbsp', name: 'sugar' },
            ],
            instructions: [
                {
                    description: 'Mix ingredients',
                    timer: 5,
                    relatedIngredientNames: ['flour', 'sugar'],
                },
                {
                    description: 'Bake',
                    relatedIngredientNames: [],
                },
            ],
        },
    };

    const mockRouter = {
        push: jest.fn(),
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (handleDeleteRecipe as jest.Mock).mockReset();
        mockRouter.push.mockReset();
        mockConfirm.mockReset();
    });

    it('renders recipe name and ingredients', () => {
        render(<RecipeDisplay recipe={mockRecipe} />);

        expect(screen.getByText('Test Recipe')).toBeInTheDocument();
        expect(screen.getByText('2 cups flour')).toBeInTheDocument();
        expect(screen.getByText('1 tbsp sugar')).toBeInTheDocument();
    });

    it('renders instructions with timers', () => {
        render(<RecipeDisplay recipe={mockRecipe} />);

        expect(screen.getByText('Mix ingredients')).toBeInTheDocument();
        expect(screen.getByText('Bake')).toBeInTheDocument();
        expect(screen.getAllByTestId('mock-timer')).toHaveLength(1); // Only one instruction has a timer
    });

    it('shows ingredient tooltips on hover', () => {
        render(<RecipeDisplay recipe={mockRecipe} />);

        const ingredientElements = screen.getAllByText(/flour|sugar/);
        expect(ingredientElements).toHaveLength(4);
    });

    it('handles delete recipe successfully', async () => {
        (handleDeleteRecipe as jest.Mock).mockResolvedValue({ success: true });
        mockConfirm.mockReturnValue(true);

        render(<RecipeDisplay recipe={mockRecipe} />);

        const deleteButton = screen.getByRole('button');

        await act(async () => {
            fireEvent.click(deleteButton);
        });

        expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this recipe?');
        expect(handleDeleteRecipe).toHaveBeenCalledWith('1');
        expect(mockRouter.push).toHaveBeenCalledWith('/');
    });

    it('handles delete recipe failure', async () => {
        (handleDeleteRecipe as jest.Mock).mockResolvedValue({ success: false });
        mockConfirm.mockReturnValue(true);

        render(<RecipeDisplay recipe={mockRecipe} />);

        const deleteButton = screen.getByRole('button');

        await act(async () => {
            fireEvent.click(deleteButton);
        });

        expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this recipe?');
        expect(handleDeleteRecipe).toHaveBeenCalledWith('1');
        expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('cancels delete when user declines confirmation', async () => {
        mockConfirm.mockReturnValue(false);

        render(<RecipeDisplay recipe={mockRecipe} />);

        const deleteButton = screen.getByRole('button');

        await act(async () => {
            fireEvent.click(deleteButton);
        });

        expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this recipe?');
        expect(handleDeleteRecipe).not.toHaveBeenCalled();
        expect(mockRouter.push).not.toHaveBeenCalled();
    });
});
