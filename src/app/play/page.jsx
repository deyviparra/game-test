'use client'
import React, { useState, useEffect } from 'react'
import s from './page.module.scss'
import Grid from '../../components/views/grid/grid.jsx'
import { setDataDB, onDataDB } from '@/firebase/realtimeDB'

export default function Play() {
  const [data, setData] = useState(null)
  const [userId, setUserId] = useState('')
  const [userColor, setUserColor] = useState('#004500')
  const [gameFinish, setGameFinish] = useState(false)
  const [winner, setWinner] = useState('')
  const [dateFinish, setDateFinish] = useState('')
  const [userName, setUserName] = useState('')
  const [editName, setEditName] = useState(false)

  const onChangeColor = (e) => {
    setUserColor(e.target.value)
    localStorage.setItem('colorwar-userColor', e.target.value)
  }

  const handleUserClick = async (cell, index) => {
    const dateNow = new Date().getTime()
    if (dateNow < data?.config?.dateFinish) {
      if (cell) {
        cell.color = userColor
        cell.userId = userId
        cell.updatedAt = new Date().getTime()
        await setDataDB(`/1/cells/${index}`, cell)
      }
    } else {
      setGameFinish(true)
      identifyWinner(data)
    }
  }

  const handleOnChangeName = () => {
    if (!data) return
    if (!data.users) data.users = []
    const userIndex = data?.users?.findIndex((user) => user.userId === userId)
    if (userIndex !== -1) {
      setDataDB(`/1/users/${userIndex}`, {
        userId,
        name: userName,
      })
      setEditName(false)
    } else {
      const users = data?.users
      users.push({
        userId,
        name: userName,
      })
      setDataDB('/1/users', users)
      setEditName(false)
    }
  }

  const identifyWinner = (data) => {
    const users = data?.users || []
    let winner = ''
    let cellsByUser = {}
    users.forEach((user) => {
      cellsByUser[user.userId] = data?.cells?.filter((cell) => cell.userId === user.userId)
    })
    let cellsByUserQty = {}
    Object.keys(cellsByUser).forEach((userId) => {
      cellsByUserQty[userId] = cellsByUser[userId].length
    })
    const maxQty = Math.max(...Object.values(cellsByUserQty))
    const usersWinners = Object.keys(cellsByUserQty).filter((userId) => cellsByUserQty[userId] === maxQty)
    if (usersWinners.length === 1) {
      winner = usersWinners[0]
    } else {
      const usersWinnersCells = usersWinners.map((userId) => cellsByUserQty[userId])
      const maxCells = Math.max(...usersWinnersCells)
      const usersWinnersMaxCells = usersWinners.filter((userId) => cellsByUserQty[userId] === maxCells)
      if (usersWinnersMaxCells.length === 1) {
        winner = usersWinnersMaxCells[0]
      } else {
        winner = 'Empate'
      }
    }
    const userWinnerName = data?.users?.find((user) => user.userId === winner)?.name
    setWinner(userWinnerName)
  }

  const saveUser = (data) => {
    const userId = localStorage.getItem('colorwar-userId') || new Date().getTime()
    localStorage.setItem('colorwar-userId', userId)
    setUserId(userId)
    if (!data) return
    if (!data.users) data.users = []
    const user = data?.users?.find((user) => user.userId === userId)
    if (user) {
      setUserName(user.name)
      return
    }
    data?.users?.push({
      userId,
      name: 'User' + userId,
    })
    setDataDB('/1', data)
  }

  useEffect(() => {
    const userColorLS = localStorage.getItem('colorwar-userColor')
    if (userColorLS) setUserColor(userColorLS)
    onDataDB('/1', (data) => {
      setData(data)
      saveUser(data)
      const dateFinish = new Date(data?.config?.dateFinish)
      const dateFinishString = `${dateFinish.getHours()}:${dateFinish.getMinutes()} ${
        dateFinish.getHours() > 12 ? 'PM' : 'AM'
      } `
      setDateFinish(dateFinishString)
      const dateNow = new Date().getTime()
      if (dateNow > data?.config?.dateFinish) {
        setGameFinish(true)
        identifyWinner(data)
      } else {
        setGameFinish(false)
      }
    })
  }, [])

  return (
    <main className={s.main}>
      <h1>ColorWar</h1>
      <div>
        <p>Escribe tu nombre</p>
        {!editName ? (
          <div className={s.nameContainer}>
            <p>{userName}</p>
            <button onClick={()=>setEditName(true)}>Edit</button>
          </div>
        ) : (
          <div className={s.nameContainer}>
            <input type='text' value={userName} onChange={(e) => setUserName(e.target.value)} />
            <button onClick={handleOnChangeName}>Save</button>
          </div>
        )}
      </div>
      {!gameFinish && dateFinish && <p>El juego termina a las {String(dateFinish)}</p>}
      <input type='color' value={userColor} onChange={onChangeColor} />
      {gameFinish ? (
        <>
          <p className={s.text}>El juego ha terminado el ganador fue: {winner} </p>
          <div></div>
        </>
      ) : (
        <Grid data={data} userId={userId} onUserClick={handleUserClick} />
      )}
    </main>
  )
}
