// Jest and Testing Library type declarations
import '@testing-library/jest-dom';

// Extend Jest matchers with Testing Library DOM matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveFocus(): R;
      toHaveValue(value: string | number): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
      toHaveFormValues(
        expectedValues: Record<string, string | number | boolean>
      ): R;
      toHaveStyle(css: string | Record<string, string | number>): R;
      toHaveAccessibleDescription(
        expectedAccessibleDescription?: string | RegExp
      ): R;
      toHaveAccessibleName(expectedAccessibleName?: string | RegExp): R;
      toHaveErrorMessage(expectedErrorMessage?: string | RegExp): R;
    }
  }
}
