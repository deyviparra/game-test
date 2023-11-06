'use client'
import React from 'react'
import { setDataDB, getDataDB } from '@/firebase/realtimeDB'
import s from './page.module.scss'

const Admin = () => {
  const setDataInitial = async () => {
    const data = await getDataDB('/gameConfig')
    const timeNowWithoutSeconds = new Date().getTime() - (new Date().getTime() % 1000)
    const dataInitial = {
      cells: [],
      config: {
        qtyHorizontal: data?.qtyHorizontal,
        qtyVertical: data?.qtyVertical,
        dateFinish: timeNowWithoutSeconds + 1000 * 60 * (data?.minutesToStart ?? 5),
      },
    }

    for (let i = 0; i < data?.qtyVertical; i++) {
      for (let j = 0; j < data?.qtyHorizontal; j++) {
        dataInitial.cells.push({
          x: j,
          y: i,
          color: '#fff',
          userId: '',
          updatedAt: new Date().getTime(),
        })
      }
    }
    setDataDB('/1', dataInitial)
  }

  return (
    <div className={s.container}>
      <h1>Panel de administración</h1>
      <button style={{ width: '150px', margin: 'auto' }} onClick={setDataInitial}>
        Configurar nuevo juego
      </button>
    </div>
  )
}

export default Admin
