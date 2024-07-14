// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//Creando comando personalizados ( metodos)
// Cypress.Commands.add('loginSauce', (email, password) => { ... })


Cypress.Commands.add('loginSaucedemo', (usuario, password) => {
  cy.get("#user-name").type(usuario)
  cy.get("*[data-test='password']").type(password)
  cy.get("input[name='login-button']").click()
})


Cypress.Commands.add('checkout', (datos) => { // parametro datos sera compraTodo o compraUno de json, dependiendo del dato que ingrese en parametro
  // En la compra este boton es comun, por eso se crea un comands. Luego de dar click al boton solicita los datos y finalmente confirma con el mensaje checkout complete
  cy.get('[data-test="checkout"]').click()
  cy.get("@titulos").should('have.text', "Checkout: Your Information")

  cy.fixture(datos).then(numPersonas => {
    cy.get('[data-test="firstName"]').type(numPersonas.nombre)
    cy.get('[data-test="lastName"]').type(numPersonas.apellido)
    cy.get('[data-test="postalCode"]').type(numPersonas.zip)
  })
  cy.get('[data-test="continue"]').click()

  cy.get("@titulos").should('have.text', "Checkout: Overview")
  cy.get(".cart_item").should("be.visible")
  cy.get('[data-test="finish"]').click()
  cy.get("@titulos").should('have.text', "Checkout: Complete!")//



})