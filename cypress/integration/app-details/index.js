import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Given('that a user clicks an app in the list', () => {
    cy.visit(Cypress.env('APP_URL'))

    cy.get('[data-test="app-card"]:first').click()
})

Then('the user can see details about that app', () => {
    cy.get('[data-test="app-card-header"]')
        .its('length')
        .should('be', 1)
    cy.get('.multiline-content')
        .its('length')
        .should('be', 1)
})
