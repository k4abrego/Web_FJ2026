function BlockHeading({ title, reverse = false }) {
  return (
    <div className={`info-block-heading${reverse ? ' info-block-heading--reverse' : ''}`}>
      {reverse ? <span className="info-block-star" aria-hidden="true" /> : null}
      <h3>{title}</h3>
      <span className="info-block-line" aria-hidden="true" />
      {reverse ? null : <span className="info-block-star" aria-hidden="true" />}
    </div>
  )
}


function GameInfoBlocks() {
  const creators = [
    { name: 'Regina Hernández', img: 'regii.jpg'},
    { name: 'Gabriel Manzo', img: 'gabriel.jpg' },
    { name: 'Emiliano García', img: 'emi.jpg'},
    { name: 'Rodrigo Toledo', img: 'rod.jpg' },
    { name: 'Karen Abrego', img: 'ka.jpg' },
   ];

  return (
    <section className="game-info-section" aria-label="Información del juego">
      <p className="main-phraseee">
        ¡Resuelve retos, gana puntos y conquista islas!
      </p>

      <article className="info-block">
        <BlockHeading title="Tutorial" reverse />
        <div className="tutorial-placeholder" role="region" aria-label="Sección del video tutorial">
            <p>Video del tutorial</p>
        </div>
      </article>

      <article className="info-block">
        <BlockHeading title="Acerca del juego"/>
        <p className="about-game-text">
          Overmath donde las matemáticas te ayudan a avanzar. Entra a una isla mágica y
          comienza tu recorrido resolviendo retos que pondrán a prueba tu mente. Cada isla
          tiene un tipo de desafío diferente. Tu objetivo es resolver la mayor cantidad de
          problemas correctamente antes de que el tiempo termine. Mientras más aciertos
          tengas, más puntos ganarás y más tiempo recibirás para seguir jugando. Pero
          cuidado... si te equivocas, perderás puntos y tiempo. A medida que avances,
          desbloquearás nuevas islas, retos más emocionantes y opciones para personalizar tu
          personaje.
        </p>
      </article>

      <article className="info-block">
        <BlockHeading title="¿Cómo jugar Overmath?" reverse/>
        <div className="how-to-play-container">
          <ul className="how-to-play-list">
            <li>Resuelve los problemas lo más rápido y correctamente posible.</li>
            <li>Cada respuesta correcta te da puntos y aumenta tu tiempo.</li>
            <li>Cada respuesta incorrecta reduce tu tiempo.</li>
            <li>Encadena varias respuestas correctas para conseguir mejores puntuaciones.</li>
            <li>Desbloquea nuevas islas al avanzar.</li>
            <li>Usa tus recompensas para personalizar tu personaje.</li>
            <li>
              Intenta superar tu récord en cada nivel y conviértete en un experto en
              matemáticas.
            </li>
          </ul>
        </div>
      </article>

      <article className="info-block">
        <BlockHeading title="Creadores" />
        <div className="creators-container">
          {creators.map((creator, index) => (
            <div className="creator-card" key={index}>
              <div className="creator-img">
                <img src={`/assets/pfps/${creator.img}`} alt={creator.name} />
              </div>
              <p className="creator-name">{creator.name}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default GameInfoBlocks
