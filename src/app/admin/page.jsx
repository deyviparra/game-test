'use client'
import React, { useState, useEffect } from 'react'
import { setDataDB, onDataDB } from '@/firebase/realtimeDB'
import s from './page.module.scss'

const Admin = () => {
  const [data, setData] = useState(null)
  const qtyHorizontal = 6
  const qtyVertical = 8

  const setDataInitial = () => {
    const dataInitial = {
      cells: [],
      config: {
        qtyHorizontal,
        qtyVertical,
        dateFinish: new Date().getTime() + 1000 * 60 * 5,
      },
    }

    for (let i = 0; i < qtyHorizontal; i++) {
      for (let j = 0; j < qtyVertical; j++) {
        dataInitial.cells.push({
          x: i,
          y: j,
          color: '#fff',
          userId: '',
          updatedAt: new Date().getTime(),
        })
      }
    }

    setDataDB('/1', dataInitial)
  }

  useEffect(() => {
    
  }, [])

  return (
    <div className={s.container}>
      <h1>Panel de administración</h1>
      <button onClick={setDataInitial}>setDataInitial</button>
    </div>
  )
}

export default Admin
