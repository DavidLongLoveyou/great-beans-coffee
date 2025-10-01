// Export all testing helpers and utilities
export * from './render'
export * from './mocks'
export * from './helpers'
export * from './factories'

// Re-export commonly used testing library functions
export {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
  act,
} from '@testing-library/react'

export { default as userEvent } from '@testing-library/user-event'