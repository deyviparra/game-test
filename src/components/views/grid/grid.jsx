'use client'
import React, { useEffect, useState } from 'react'
import s from './grid.module.scss'

const Grid = ({ onUserClick, userId, data }) => {
  const horizontalArr = Array(data?.config?.qtyHorizontal).fill(null)
  const verticalArr = Array(data?.config?.qtyVertical).fill(null)
  const [userCells, setUserCells] = useState([])
  const BORDER_COLOR = 'black'
  const BORDER_COLOR_USER = '#67EBFA'

  const borders = (cell) => {
    let bt = BORDER_COLOR_USER,
      bb = BORDER_COLOR_USER,
      bl = BORDER_COLOR_USER,
      br = BORDER_COLOR_USER
    userCells.forEach((cellFilter) => {
      if (cell.x === cellFilter.x && cell.y === cellFilter.y) return
      if (cell.x - 1 === cellFilter.x && cell.y === cellFilter.y) bl = BORDER_COLOR
      if (cell.x + 1 === cellFilter.x && cell.y === cellFilter.y) br = BORDER_COLOR
      if (cell.x === cellFilter.x && cell.y - 1 === cellFilter.y) bt = BORDER_COLOR
      if (cell.x === cellFilter.x && cell.y + 1 === cellFilter.y) bb = BORDER_COLOR
    })
    return { bt, bb, bl, br }
  }

  const ColorCell = ({ x, y }) => {
    const cell = data?.cells.find((cell) => cell.x === x && cell.y === y)
    const color = cell?.color || BORDER_COLOR_USER
    const { bt, bb, bl, br } =
      cell?.userId === userId
        ? borders(cell)
        : { bt: BORDER_COLOR, bb: BORDER_COLOR, bl: BORDER_COLOR, br: BORDER_COLOR }
    return (
      <div
        data-x={x}
        data-y={y}
        className={s.cell}
        onClick={() => {
          onUserClick(x, y)
        }}
        style={{
          backgroundColor: color,
          borderLeftColor: bl,
          borderRightColor: br,
          borderTopColor: bt,
          borderBottomColor: bb,
        }}></div>
    )
  }

  const paintBorders = () => {
    userCells.forEach((cell) => {
      const cellEl = document.querySelector(`[data-x="${cell.x}"][data-y="${cell.y}"]`)
      const { bt, bb, bl, br } = borders(cell)
      cellEl.style.borderLeftColor = bl
      cellEl.style.borderRightColor = br
      cellEl.style.borderTopColor = bt
      cellEl.style.borderBottomColor = bb
    })
  }

  const paintCells = () => {
    data.cells.forEach((cell) => {
      const cellEl = document.querySelector(`[data-x="${cell.x}"][data-y="${cell.y}"]`)
      if (cellEl) {
        cellEl.style.backgroundColor = cell.color
      }
    })
  }

  useEffect(() => {
    if (data?.cells) {
      const userCellsArr = data?.cells.filter((cell) => cell.userId === userId) || []
      setUserCells(userCellsArr)
      paintBorders()
      paintCells()
    }
  }, [data])

  return (
    <div className={s.container}>
      {verticalArr.map((_, indexY) => {
        return (
          <div key={indexY} className={s.row}>
            {horizontalArr.map((_, indexX) => {
              return <ColorCell x={indexX} y={indexY} key={indexX} />
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Grid
