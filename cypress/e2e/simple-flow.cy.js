describe("BiblioTech - Test E2E Simple", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("Doit permettre la navigation vers collection", () => {
    cy.contains("Collection").click()
    cy.url().should("include", "/#collection")
  })

  it("Doit permettre la navigation vers login", () => {
    cy.contains("Se connecter").click()
    cy.url().should("include", "/login")
    cy.get('input[type="email"]').should("be.visible")
    cy.get('input[type="password"]').should("be.visible")
    cy.contains("Rôle").should("be.visible") // Vérifie la présence du champ rôle
  })

  it("Doit permettre l'accès au dashboard admin après connexion", () => {
    // 1. Aller à la page de login
    cy.contains("Se connecter").click()
    
    // 2. Remplir le formulaire avec identifiants admin
    cy.get('input[type="email"]').type("admin@iset.tn")
    cy.get('input[type="password"]').type("admin123")
    
    // Sélection spécifique du rôle Administrateur
    cy.contains("Rôle").parent().within(() => {
      cy.contains("Administrateur").click() // Sélectionne le rôle par le texte
    })
    
    
    // Soumission du formulaire
    cy.contains("button", "Se connecter").click()

    
    // 3. Vérification de la redirection et du dashboard
    cy.url().should("include", "/admin")
    
  })
})