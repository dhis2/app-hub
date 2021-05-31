import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Given('that I visit the start page', () => {
    cy.visit(Cypress.env('APP_URL'))
})

Then('I can see at least one available app', () => {
    cy.get('[data-test="app-card"]').its('length').should('be.gte', 1)
})
