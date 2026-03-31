import SiteHeader from '../components/Header'

function ConocenosPage() {
  return (
    <>
      <SiteHeader />
      <main className="conocenos-page">
        <section className="conocenos-hero" aria-labelledby="conocenos-hero-title">
          <div className="conocenos-hero-inner page-shell">
            <div className="conocenos-hero-copy">
              <h1 id="conocenos-hero-title">Conócenos</h1>
              <p>
                Somos una fundación que, dentro de nuestro espacio físico, realiza talleres artísticos, 
                deportivos y educativos a niños, niñas, adolescentes, adultos y adultos mayores, de la 
                zona de Azcapotzalco y alrededores. También, llevamos donativo de ropa, zapatos, juguetes, 
                y alimentos no perecederos a comunidades que no cuentan con los recursos suficientes para 
                obtener dichos artículos.
              </p>
              <button type="button" className="conocenos-cta">Ayúdanos a crecer</button>
            </div>

            <div className="conocenos-hero-media" role="img" aria-label="Imagen de NIDE"></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default ConocenosPage
