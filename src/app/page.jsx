import s from './page.module.scss'
import Link from 'next/link'

export default function Home() {
  
  //Pendientes:
  //Guardar en LocalStorage la config del usuario
  //Guardar click del usuario
  //Hacer selector de color por parte del usuario con fácil acceso
  //Identificar zona pintada más grande de cada usuario
  //Agregar ranking
  //Personalización de nombre
  //Cron de borrado de mapa
  //Bots de competición
  //Onboarding
  //Zona de anuncios

  return (
    <main className={s.main}>
      <h1>ColorWar</h1>
      <p className={s.text}>
        ColorWar es un juego donde los usuarios compiten por tener la zona pintada con mayor area en el mapa al final del día.
        <br/>
        El juego se reinicia cada día a las 00:00 UTC.
        <br/>
        Al pulsar sobre cada casilla, el usuario pinta la casilla con el color seleccionado.
        <br/>
        El color del usuario se puede cambiar en cualquier momento.
        <br/>
        Se calculará la zona pintada más grande de cada usuario y se mostrará en el ranking.
        <br/>
        <br/>
        ¡Que gane el mejor!
      </p>
      <Link className={s.btn} href='/play'>Play</Link>
      <div></div>
    </main>
  )
}
