import React, {useState} from 'react'

export default function Collapsible({title, children, defaultOpen}: {title:string, children:React.ReactNode, defaultOpen?:boolean}){
  const [open,setOpen] = useState(!!defaultOpen)
  return (
    <div style={{ border: '1px solid #eee', marginBottom: 8 }}>
      <div style={{ background: '#fafafa', padding: 8, cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        {title} {open ? '▾' : '▸'}
      </div>
      {open && <div style={{padding:8}}>{children}</div>}
    </div>
  )
}
