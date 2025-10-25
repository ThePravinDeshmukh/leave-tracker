import React, {useMemo, useState, useEffect} from 'react'
import { EmployeeCategory, Leave } from '../../types'
import { startOfWeek, addDays, formatISO, formatShort } from '../../utils/date'
import Collapsible from '../shared/Collapsible'
import WeekDayCell from './WeekDayCell'

type Props = {
  data: EmployeeCategory[]
}

export default function WeekView({data}: Props){
  const [currentStart, setCurrentStart] = useState(startOfWeek())
  const days = useMemo(()=>{
    const s = startOfWeek(currentStart)
    return Array.from({length:6}).map((_,i)=>({date:addDays(s,i), iso:formatISO(addDays(s,i))}))
  },[currentStart])

  // leaves persisted to localStorage
  const STORAGE_KEY = 'leave-tracker:leaves'
  const [leaves, setLeaves] = useState<Leave[]>(()=>{
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Leave[] : []
    }catch(e){
      console.error('failed to read leaves from storage', e)
      return []
    }
  })

  useEffect(()=>{
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leaves))
    }catch(e){
      console.error('failed to save leaves to storage', e)
    }
  },[leaves])
  // pagination removed: show all employees per category

  function saveLeave(l: Leave){
    setLeaves(prev=>{
      const others = prev.filter(x=>!(x.employeeId===l.employeeId && x.dateISO===l.dateISO))
      return [...others, l]
    })
  }

  function removeLeave(employeeId: string, dateISO: string){
    setLeaves(prev=> prev.filter(x=>!(x.employeeId===employeeId && x.dateISO===dateISO)))
  }

  return (
    <div>
      <div style={{display:'flex',gap:8,alignItems:'center', marginBottom:8}}>
        <button onClick={()=>setCurrentStart(addDays(currentStart,-7))}>Prev</button>
        <button onClick={()=>setCurrentStart(startOfWeek())}>This week</button>
        <button onClick={()=>setCurrentStart(addDays(currentStart,7))}>Next</button>
        <div style={{marginLeft:12}}>{formatShort(days[0].date)} - {formatShort(days[5].date)}</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'250px 1fr'}}>
        <div />
        <div style={{display:'grid', gridTemplateColumns:`repeat(${days.length}, 1fr)`, gap:4}}>
          {days.map(d=> <div key={d.iso} style={{textAlign:'center', fontWeight:600}}>{d.date.toLocaleDateString(undefined,{weekday:'short', day:'numeric'})}</div>)}
        </div>
      </div>

      {data.map(cat=> (
        <Collapsible key={cat.id} title={cat.name} defaultOpen>
          <div>
            {cat.employees.map(emp=> (
              <div key={emp.id} style={{display:'grid', gridTemplateColumns:'250px 1fr', alignItems:'center', marginBottom:4}}>
                <div style={{padding:6}}>{emp.name}</div>
                <div style={{display:'grid', gridTemplateColumns:`repeat(${days.length}, 1fr)`, gap:4}}>
                  {days.map(d=>{
                    const l = leaves.find(x=>x.employeeId===emp.id && x.dateISO===d.iso)
                    return (
                      <WeekDayCell
                        key={d.iso}
                        dateISO={d.iso}
                        leave={l}
                        onSave={(leaveOrNull: Leave | null)=>{
                          if(leaveOrNull === null){
                            removeLeave(emp.id, d.iso)
                          }else{
                            saveLeave({...leaveOrNull, employeeId: emp.id})
                          }
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </Collapsible>
      ))}

      {/* pagination removed from grid */}
    </div>
  )
}
