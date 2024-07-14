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

  context.skip("ordenacion de catalogo", () => {
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

  context("Compra de productos", () => {
    //Creamos una variable como contador, y lo llamamos e igualamos a cero.
    let productosAgregados;

    //Importante : logearse antes de la compra de articulos
    beforeEach(() => {
      cy.fixture("usuarios").then(usuarios => {
        cy.loginSaucedemo(usuarios.usuario_correcto.usuario, usuarios.usuario_correcto.password)
      })

      cy.get(".title").as("titulos")
      cy.get("@titulos").should('have.text', "Products")

      productosAgregados = 0;   // Cada vez que reiniciamos el test, la variable la igualamos a cero

    })

    it("Comprobar carrito vacio al entrar", () => {
      // Ingresamos al icono del carrito y verificamos que este vacio
      cy.get(".shopping_cart_link").click();
      cy.get("@titulos").should('have.text', "Your Cart")
      cy.get(".cart_item").should('not.exist')  // verificamos que no existe el cart item, esto para comprobar que el carrito esta vacio.
    })

    it("Comprar un producto", () => {
      cy.get("@titulos").should('have.text', "Products")
      cy.get(".inventory_list").find("button").eq(1).click()//indice 1, es decir el segundo
      cy.get(".shopping_cart_link").click();  // Ingresamos al icono del carrito
      cy.get("@titulos").should('have.text', "Your Cart")//Verificamos que la pantalla tenga el texto your cart
      cy.get(".cart_item").should('exist')

      //Commands: 
      cy.checkout("compraUno")

    })

    it("Comprar todos los elementos", () => {
      cy.get(".inventory_list button").each(($button, index, $listado) => {
        cy.wrap($button).click();//Click a c/u de los elementos
        productosAgregados++; // se agrega 1 el contador por cada click ( en toda la iteracion se agregaran los 6 productos)

      })
      cy.get(".shopping_cart_link").click();  // Ingresamos al icono del carrito
      cy.get("@titulos").should('have.text', "Your Cart")//

      cy.get(".cart_list .cart_item").then($elementos => {
        expect($elementos).to.length(productosAgregados)
      })

      // Commands:
      cy.checkout("compraTodo")


      //Checkout
      // cy.get('[data-test="checkout"]').click()
      // cy.get("@titulos").should('have.text', "Checkout: Your Information")
      // cy.fixture("personas").then(personas => {
      //   cy.get('[data-test="firstName"]').type(personas.unaCompra.nombre)
      //   cy.get('[data-test="lastName"]').type(personas.unaCompra.apellido)
      //   cy.get('[data-test="postalCode"]').type(personas.unaCompra.zip)
      // })
      // cy.get('[data-test="continue"]').click()

      // // Luego de dar click en Continue se abre otra ventana:
      // //  Verificamos que el titulo de esta ventana coincida con el texto
      // cy.get("@titulos").should('have.text', "Checkout: Overview")
      // cy.get(".cart_item").should("be.visible")
      // cy.get('[data-test="finish"]').click()
      // cy.get("@titulos").should('have.text', "Checkout: Complete!")//

    })
  })

})