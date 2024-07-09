describe("Bateria de pruebas", () => {

  beforeEach(() => {
    cy.visit("https://www.saucedemo.com")
  })

  context.skip("Login", () => {

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

  context("ordenacion de catalogo", () => {
    //Antes de cualquier ordenacion hay que hacer un LOGIN correcto.
    // Con un beforeEach.( cada vez que ejecutemos test de ordenacion necesitamos logearnos)
    beforeEach(() => {
      cy.fixture("usuarios").then(usuarios => {
        cy.loginSaucedemo(usuarios.usuario_correcto.usuario, usuarios.usuario_correcto.password)
      })
    })
    it("Comprobar ordenacion A-Z", () => {
      // recupero la clase inventory list y luego dentro ( within) accedo a los otros elementos como el boton
      // recuperamos el boton que esta dentro de la clase inventory list, y  recorremos  cada uno de los botones
      // Por mostrar otra forma, nos ubicamos en el boton y luego vamos al padre del boton y luego entramos con find a sus elementos
      // Invocamos al TEXTO, que tienen la etiqueta capturada del dom. Y la etiqueta devuelve el nombre del producto ( then $nombre) y lo presentamos por pantalla con el console log
      // Luego de mostrarlos por pantalla se podran manipularlos
      cy.get(".inventory_list").within(() => {
        cy.get("button").each(($boton, index, $listado) => {
          cy.wrap($boton) // envuelve al boton
            .parents(".inventory_item_description")
            .find(".inventory_item_name ")
            .invoke('text').then($nombre => {
              //console.log($nombre); ( esta guardado ahora en catalogo.json)
              cy.fixture("catalogo").then(catalogo => {
                expect($nombre).to.equal(catalogo.productos[index])// comparara el orden haciendo uso del index. Index inicia  en la posicion 0
              })
            })
        })
      })
    })

    it("Comprobar ordenacion Z-A", () => {

      cy.get("select[data-test='product-sort-container']").select("za")

      cy.get(".inventory_list").within(() => {
        cy.get("button").each(($boton, index, $listado) => {
          cy.wrap($boton)
            .parents(".inventory_item_description")
            .find(".inventory_item_name ")
            .invoke('text').then($nombre => {
              cy.fixture("catalogo").then(catalogo => {
                expect($nombre).to.equal(catalogo.productos[catalogo.productos.length - index - 1])
                //Orden a la inversa. Haremos lo contrario
                // catalogo.products.length nos devuelve longitud del array
                // - index por que partimos de cero(0)
                // -1 Por que acudimos al ultimo indice ( en este caso el ultimo inidice es 5 - catalogo.json)
                //El 1er index es siempre 0.
                //Length = 6  ya que hay 6 productos en el fixture catalogo.json.
                //6-0-1 = 5 (  posicion 5)
                //Sgte iteracion: index ahora vale 1 -> 6 de length -1 - 1  = 4 ( posicion 4)
              })
            })
        })
      })
    })

  })

})