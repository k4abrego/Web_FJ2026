import SiteHeader from '../components/Header'

function ConocenosPage() {
  return (
    <>
      <SiteHeader />
      <main className="conocenos-page">
        <section className="conocenos-hero" aria-labelledby="conocenos-hero-title">
          <div className="conocenos-hero-inner page-shell">
            <div className="conocenos-hero-copy">
              <h1 id="conocenos-hero-title">Fundación NIDE A.C.</h1>
              <p>
                <strong>NIÑOS EN DESARROLLO</strong> dedicados a trabajar por el bienestar y desarrollo
                de los niños y jovenes en México. Espacio que busca el desarrollo integral en materia 
                educativa, cultural, personal y lúdica, de niños y jóvenes.
              </p>
              <button type="button" className="conocenos-cta">Ayúdanos a crecer</button>
            </div>

            <div className="conocenos-hero-media" role="img" aria-label="Imagen de NIDE"></div>
          </div>
        </section>

        <section className="conocenos-who page-shell" aria-labelledby="conocenos-who-title">
          <div className="conocenos-who-copy">
            <h2 id="conocenos-who-title">¿Quiénes somos?</h2>
            <p>
              Somos una fundación que, dentro de nuestro espacio físico, realiza talleres artísticos,
              deportivos y educativos a niños, niñas, adolescentes, adultos y adultos mayores, de la
              zona de Azcapotzalco y alrededores. También, llevamos donativo de ropa, zapatos, juguetes,
              y alimentos no perecederos a comunidades que no cuentan con los recursos suficientes para
              obtener dichos artículos.
            </p>
          </div>

          <div
            className="conocenos-who-media"
            role="img"
            aria-label="Imagen de NIDE"
          ></div>
        </section>
      </main>

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default ConocenosPage
