import React from 'react'

export default function Pagination({total, pageSize, onPageChange}:{total:number, pageSize:number, onPageChange:(p:number)=>void}){
  const pages = Math.max(1, Math.ceil(total/pageSize))
  return (
    <div style={{display:'flex',gap:6,alignItems:'center'}}>
      {Array.from({length:pages}).map((_,i)=> (
        <button key={i} onClick={()=>onPageChange(i+1)}>{i+1}</button>
      ))}
    </div>
  )
}
