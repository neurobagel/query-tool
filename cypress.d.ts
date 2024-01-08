// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'cypress/react'

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}