import React, {useState} from 'react'

export default function Collapsible({title, children, defaultOpen}: {title:string, children:React.ReactNode, defaultOpen?:boolean}){
  const [open,setOpen] = useState(!!defaultOpen)
  return (
    <div className="collapsible">
      <div className="collapsible-header" onClick={() => setOpen(o => !o)}>
        {title} {open ? '▾' : '▸'}
      </div>
      {open && <div className="collapsible-content">{children}</div>}
    </div>
  )
}
