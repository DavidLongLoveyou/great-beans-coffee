// Custom render utilities for React Testing Library
import React, { ReactElement } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

// Mock providers for testing
interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  // Create a new QueryClient for each test to avoid state leakage
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Additional custom render functions for specific scenarios

// Render with specific locale
export const renderWithLocale = (
  ui: ReactElement,
  locale: string = 'en',
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => {
  const LocaleWrapper = ({ children }: { children: React.ReactNode }) => (
    <div lang={locale}>
      <AllTheProviders>{children}</AllTheProviders>
    </div>
  )

  return render(ui, { wrapper: LocaleWrapper, ...options })
}

// Render with authentication context
export const renderWithAuth = (
  ui: ReactElement,
  user?: any,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => {
  const AuthWrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders>
      {/* Mock auth provider would go here */}
      {children}
    </AllTheProviders>
  )

  return render(ui, { wrapper: AuthWrapper, ...options })
}

// Render with router context (for components that use routing)
export const renderWithRouter = (
  ui: ReactElement,
  initialRoute: string = '/',
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => {
  const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders>
      {/* Mock router provider would go here */}
      {children}
    </AllTheProviders>
  )

  return render(ui, { wrapper: RouterWrapper, ...options })
}

// Render with form context (for form components)
export const renderWithForm = (
  ui: ReactElement,
  formProps?: any,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => {
  const FormWrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders>
      <form {...formProps}>{children}</form>
    </AllTheProviders>
  )

  return render(ui, { wrapper: FormWrapper, ...options })
}