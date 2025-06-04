describe("BiblioTech - Test E2E Simple", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("Doit afficher la page d'accueil", () => {
    cy.contains("BiblioTech").should("be.visible")
    cy.contains("Se connecter").should("be.visible")
  })

  it("Doit permettre la navigation vers login", () => {
    cy.contains("Se connecter").click()
    cy.url().should("include", "/login")
    cy.get('input[type="email"]').should("be.visible")
    cy.get('input[type="password"]').should("be.visible")
  })

  it("Doit permettre la connexion admin (mock)", () => {
    cy.visit("/login")

    // Saisie des credentials
    cy.get('input[type="email"]').type("admin@iset.tn")
    cy.get('input[type="password"]').type("password123")
    cy.get("select").select("admin")

    // Connexion
    cy.get('button[type="submit"]').click()

    // Vérification redirection dashboard admin
    cy.url().should("include", "/admin")
    cy.contains("Dashboard Admin").should("be.visible")
  })

  it("Doit permettre la navigation dans le catalogue", () => {
    // Connexion rapide admin
    cy.visit("/login")
    cy.get('input[type="email"]').type("admin@iset.tn")
    cy.get('input[type="password"]').type("password123")
    cy.get("select").select("admin")
    cy.get('button[type="submit"]').click()

    // Navigation vers catalogue
    cy.contains("Catalogue").click()
    cy.url().should("include", "/catalog")
    cy.contains("Ajouter un livre").should("be.visible")
  })

  it("Doit permettre la connexion étudiant (mock)", () => {
    cy.visit("/login")

    // Connexion étudiant
    cy.get('input[type="email"]').type("alice@student.tn")
    cy.get('input[type="password"]').type("password123")
    cy.get("select").select("student")
    cy.get('button[type="submit"]').click()

    // Vérification dashboard étudiant
    cy.url().should("include", "/student")
    cy.contains("Dashboard Étudiant").should("be.visible")
  })
})


