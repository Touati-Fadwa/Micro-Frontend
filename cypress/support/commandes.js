// Commande de connexion rapide
Cypress.Commands.add("loginAsAdmin", () => {
  cy.visit("/login")
  cy.get('input[type="email"]').type("admin@iset.tn")
  cy.get('input[type="password"]').type("password123")
  cy.get("select").select("admin")
  cy.get('button[type="submit"]').click()
  cy.url().should("include", "/admin")
})

Cypress.Commands.add("loginAsStudent", () => {
  cy.visit("/login")
  cy.get('input[type="email"]').type("alice@student.tn")
  cy.get('input[type="password"]').type("password123")
  cy.get("select").select("student")
  cy.get('button[type="submit"]').click()
  cy.url().should("include", "/student")
})

// Commande pour vérifier les éléments de navigation
Cypress.Commands.add("checkNavigation", () => {
  cy.get('[data-testid="sidebar"]').should("be.visible")
  cy.get('[data-testid="header"]').should("be.visible")
})

