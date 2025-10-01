// Test helper functions and utilities
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// User interaction helpers
export const user = userEvent.setup()

// Common test helpers
export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
  })
}

export const waitForErrorToAppear = async (errorMessage?: string) => {
  await waitFor(() => {
    if (errorMessage) {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    } else {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    }
  })
}

// Form helpers
export const fillForm = async (formData: Record<string, string>) => {
  for (const [fieldName, value] of Object.entries(formData)) {
    const field = screen.getByLabelText(new RegExp(fieldName, 'i'))
    await user.clear(field)
    await user.type(field, value)
  }
}

export const submitForm = async (buttonText = /submit/i) => {
  const submitButton = screen.getByRole('button', { name: buttonText })
  await user.click(submitButton)
}

export const selectOption = async (selectLabel: string | RegExp, optionText: string | RegExp) => {
  const select = screen.getByLabelText(selectLabel)
  await user.click(select)
  const option = screen.getByRole('option', { name: optionText })
  await user.click(option)
}

// Navigation helpers
export const clickLink = async (linkText: string | RegExp) => {
  const link = screen.getByRole('link', { name: linkText })
  await user.click(link)
}

export const clickButton = async (buttonText: string | RegExp) => {
  const button = screen.getByRole('button', { name: buttonText })
  await user.click(button)
}

// Modal and dialog helpers
export const openModal = async (triggerText: string | RegExp) => {
  await clickButton(triggerText)
  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
}

export const closeModal = async () => {
  const closeButton = screen.getByRole('button', { name: /close/i })
  await user.click(closeButton)
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
}

// Table helpers
export const getTableRow = (rowIndex: number) => {
  const table = screen.getByRole('table')
  const rows = within(table).getAllByRole('row')
  return rows[rowIndex]
}

export const getTableCell = (rowIndex: number, columnIndex: number) => {
  const row = getTableRow(rowIndex)
  const cells = within(row).getAllByRole('cell')
  return cells[columnIndex]
}

export const sortTableByColumn = async (columnName: string | RegExp) => {
  const columnHeader = screen.getByRole('columnheader', { name: columnName })
  await user.click(columnHeader)
}

// Search helpers
export const searchFor = async (searchTerm: string, searchInputLabel = /search/i) => {
  const searchInput = screen.getByLabelText(searchInputLabel)
  await user.clear(searchInput)
  await user.type(searchInput, searchTerm)
  await user.keyboard('{Enter}')
}

export const clearSearch = async (searchInputLabel = /search/i) => {
  const searchInput = screen.getByLabelText(searchInputLabel)
  await user.clear(searchInput)
}

// File upload helpers
export const uploadFile = async (file: File, inputLabel = /upload/i) => {
  const fileInput = screen.getByLabelText(inputLabel)
  await user.upload(fileInput, file)
}

export const createMockFile = (name = 'test.txt', content = 'test content', type = 'text/plain') => {
  return new File([content], name, { type })
}

// Accessibility helpers
export const checkAccessibility = async () => {
  // Check for basic accessibility requirements
  const headings = screen.getAllByRole('heading')
  expect(headings.length).toBeGreaterThan(0)
  
  // Check that all images have alt text
  const images = screen.getAllByRole('img')
  images.forEach(img => {
    expect(img).toHaveAttribute('alt')
  })
  
  // Check that all buttons have accessible names
  const buttons = screen.getAllByRole('button')
  buttons.forEach(button => {
    expect(button).toHaveAccessibleName()
  })
}

// Performance helpers
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now()
  renderFn()
  await waitForLoadingToFinish()
  const end = performance.now()
  return end - start
}

// Mock data helpers
export const createMockApiResponse = <T>(data: T, delay = 0) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        ok: true,
        json: () => Promise.resolve(data),
        status: 200,
        statusText: 'OK',
      })
    }, delay)
  })
}

export const createMockApiError = (message = 'API Error', status = 500, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message))
    }, delay)
  })
}

// URL and routing helpers
export const expectUrlToContain = (expectedPath: string) => {
  expect(window.location.pathname).toContain(expectedPath)
}

export const expectUrlToBe = (expectedPath: string) => {
  expect(window.location.pathname).toBe(expectedPath)
}

// Local storage helpers
export const setLocalStorageItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalStorageItem = (key: string) => {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

export const clearLocalStorage = () => {
  localStorage.clear()
}

// Date helpers
export const createMockDate = (dateString: string) => {
  return new Date(dateString)
}

export const formatDateForInput = (date: Date) => {
  return date.toISOString().split('T')[0]
}

// Async helpers
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const waitForCondition = async (
  condition: () => boolean,
  timeout = 5000,
  interval = 100
) => {
  const start = Date.now()
  while (!condition() && Date.now() - start < timeout) {
    await sleep(interval)
  }
  if (!condition()) {
    throw new Error(`Condition not met within ${timeout}ms`)
  }
}