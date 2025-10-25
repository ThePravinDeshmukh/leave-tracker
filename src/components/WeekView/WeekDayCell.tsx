import React, {useEffect, useRef, useState} from 'react'
import { Leave } from '../../types'

export default function WeekDayCell({dateISO, leave, onSave}:{dateISO:string, leave?:Leave | null, onSave:(l: Leave | null)=>void}){
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(leave?.note || '')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{
    if(open){
      // focus the textarea when dialog opens
      setTimeout(()=>textareaRef.current?.focus(), 0)
      const onKey = (e: KeyboardEvent) => {
        if(e.key === 'Escape') setOpen(false)
      }
      document.addEventListener('keydown', onKey)
      return ()=>document.removeEventListener('keydown', onKey)
    }
  },[open])

  // close when leave changes externally
  useEffect(()=>{
    setNote(leave?.note || '')
  },[leave])

  function handleSave(absent:boolean){
    onSave({dateISO, note, absent} as Leave)
    setOpen(false)
  }

  function handleClearNote(){
    // clear both leave and note by removing the leave entry entirely
    onSave(null)
    setOpen(false)
  }

  function handleRemove(){
    // signal removal
    onSave(null)
    setOpen(false)
  }

  function handleKey(e: React.KeyboardEvent){
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault()
      setOpen(true)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={leave ? (leave.absent ? 'Absent' : 'Has note') : 'Add leave'}
      onClick={()=>setOpen(true)}
      onKeyDown={handleKey}
      style={{border:'1px dashed #ddd', minHeight:34, padding:4, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', outline:'none'}}
    >
      <div aria-hidden style={{fontSize:16}}>{leave ? (leave.absent ? '✖' : '📝') : ''}</div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`leave-${dateISO}`}
          style={{position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center'}}
          onMouseDown={(e)=>{ if(e.target === e.currentTarget) setOpen(false) }}
        >
          <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.3)'}} />

          <div
            ref={modalRef}
            style={{position:'relative', background:'#fff', borderRadius:6, padding:12, width:320, boxShadow:'0 6px 24px rgba(0,0,0,0.2)'}}
            onMouseDown={(e)=>e.stopPropagation()}
            onClick={(e)=>e.stopPropagation()}
          >
            <div id={`leave-${dateISO}`} style={{fontWeight:700, marginBottom:8}}>{dateISO}</div>
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(e)=>setNote(e.target.value)}
              placeholder="Optional note"
              aria-label="Leave note"
              style={{width:'100%',height:90, padding:8, fontSize:14, boxSizing:'border-box'}}
            />

            <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:10}}>
              <button onClick={()=>handleSave(true)} aria-label="Mark absent">✖ Absent</button>
              <button onClick={()=>handleSave(false)} aria-label="Save note" disabled={!note.trim()}>📝 Save</button>
              {(leave || note) && <button onClick={()=>{ onSave(null); setOpen(false) }} aria-label="Clear leave and note">Clear</button>}
              <button onClick={()=>setOpen(false)} aria-label="Cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
