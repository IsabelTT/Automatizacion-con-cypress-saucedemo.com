describe("Bateria de pruebas", () => {

  beforeEach(() => {
    cy.visit("https://www.saucedemo.com")
  })

  context("Login", () => {

    it("Login correcto", () => {
      cy.fixture("usuarios").then(usuarios => {
        cy.loginSaucedemo(usuarios.usuario_correcto.usuario, usuarios.usuario_correcto.password)
      })

      cy.get(".title").should("have.text", "Products")
    })

    it("Login incorrecto", () => {
      cy.fixture("usuarios").then(usuarios => {
        cy.loginSaucedemo(usuarios.usuario_incorrecto.usuario, usuarios.usuario_incorrecto.password)
      })

      cy.get(".error-message-container").should("contain.text", "locked out")
    })

  })

  context("Ordenacion de catalogo", () => {

    beforeEach(() => {
      cy.fixture("usuarios").then(usuarios => {
        cy.loginSaucedemo(usuarios.usuario_correcto.usuario, usuarios.usuario_correcto.password)
      })
      cy.get(".title").as("titulo")
      cy.get("@titulo").should('have.text', "Products")
    })

    it("Comprobar ordenacion A-Z", () => {
      cy.get(".inventory_list").within(() => {
        cy.get("button").each(($boton, index, $listado) => {
          cy.wrap($boton)
            .parents(".inventory_item_description")
            .find(".inventory_item_name")
            .invoke('text').then($nombre => {
              cy.fixture("catalogo").then(catalogo => {
                expect($nombre).to.equal(catalogo.productos[index])
              })
            })
        })
      })
    })

    it("Comprobar ordenacion Z-A", () => {

      cy.get("select[data-test='product_sort_container']").select("za")

      cy.get(".inventory_list").within(() => {
        cy.get("button").each(($boton, index, $listado) => {
          cy.wrap($boton)
            .parents(".inventory_item_description")
            .find(".inventory_item_name")
            .invoke('text').then($nombre => {
              cy.fixture("catalogo").then(catalogo => {
                expect($nombre).to.equal(catalogo.productos[catalogo.productos.length - index - 1])
              })
            })
        })
      })
    })
  })

  context("Compra de productos", () => {

    let productosAgregados;

    beforeEach(() => {
      cy.fixture("usuarios").then(usuarios => {
        cy.loginSaucedemo(usuarios.usuario_correcto.usuario, usuarios.usuario_correcto.password)
      })
      cy.get(".title").as("titulo")
      cy.get("@titulo").should('have.text', "Products")
      productosAgregados = 0;
    })

    it("Comprobar carrito vacio al entrar", () => {
      cy.get(".shopping_cart_link").click();
      cy.get("@titulo").should('have.text', "Your Cart")
      cy.get(".cart_list .cart_item").should('not.exist')
    })

    it("Comprar un producto", () => {
      cy.get(".inventory_list").find("button").eq(1).click()

      cy.get(".shopping_cart_link").click();
      cy.get("@titulo").should('have.text', "Your Cart")

      cy.checkout("compraUno")

    })

    it("Comprar todos los productos", () => {

      cy.get(".inventory_list button").each($button => {
        cy.wrap($button).click();
        productosAgregados++;
      })

      cy.get(".shopping_cart_link").click();
      cy.get("@titulo").should('have.text', "Your Cart")

      cy.get(".cart_list .cart_item").then($elementos => {
        expect($elementos).to.length(productosAgregados)
      })

      cy.checkout("compraTodo")
    })


  })

})