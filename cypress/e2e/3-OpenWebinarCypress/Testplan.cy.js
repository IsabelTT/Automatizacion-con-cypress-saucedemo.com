describe("Bateria de pruebas", () => {
  before(() => {
    cy.visit("https://www.saucedemo.com")

  })

  context("Login", () => {
    it("Login correcto", () => {
      cy.loginSaucedemo("standard_user", "secret_sauce")
      cy.get(".title").should("have.text", "Products")
    })

    it("Login incorrecto", () => {
      cy.loginSaucedemo("locked_out_user", "secret_sauce")
      cy.get(".error-message-container").should("contain.text", "locked_out")
    })

  })


  context("ordenacion de catalogo", () => {

  })

  context("Compra de productos", () => {



  })
})