describe("Basic Application Test", () => {
  it("visits the app and verifies critical elements", () => {
    cy.visit("/")

    // Vérifie que le titre est présent
    cy.contains("h1", "BiblioTech").should("be.visible")

    // Vérifie la présence des liens de navigation
    cy.get("nav").should("be.visible")

    // Vérifie que le formulaire de connexion est présent
    cy.contains("button", "Connexion").should("be.visible")
  })
})