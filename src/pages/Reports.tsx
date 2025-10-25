import React, {useMemo, useState} from 'react'
import { EmployeeCategory, Leave } from '../types'
import { sampleData } from '../sample-data'

const CATS_KEY = 'leave-tracker:categories'
const LEAVES_KEY = 'leave-tracker:leaves'

function addMonths(key: string, delta: number){
  const [y,m] = key.split('-').map(Number)
  const d = new Date(y, m-1, 1)
  d.setMonth(d.getMonth() + delta)
  const ny = d.getFullYear()
  const nm = d.getMonth() + 1
  return `${ny}-${String(nm).padStart(2,'0')}`
}

function monthLabel(key: string){
  const [y,m] = key.split('-').map(Number)
  const d = new Date(y, m-1, 1)
  return d.toLocaleDateString(undefined, {month:'short', year:'numeric'})
}

function currentMonthKey(){
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
}

export default function Reports(){
  const categories: EmployeeCategory[] = useMemo(()=>{
    try{
      const raw = localStorage.getItem(CATS_KEY)
      return raw ? JSON.parse(raw) as EmployeeCategory[] : sampleData
    }catch(e){
      return sampleData
    }
  }, [])

  const leaves: Leave[] = useMemo(()=>{
    try{
      const raw = localStorage.getItem(LEAVES_KEY)
      return raw ? JSON.parse(raw) as Leave[] : []
    }catch(e){
      return []
    }
  }, [])

  // flatten employee list
  const employees = useMemo(()=> categories.flatMap(c=>c.employees), [categories])

  // counts per employee per month (only count absences)
  const counts = useMemo(()=>{
    const map: Record<string, Record<string, number>> = {}
    for(const emp of employees) map[emp.id] = {}
    for(const l of leaves){
      if(!l || !l.dateISO) continue
      // only count absent entries
      if(!l.absent) continue
      const month = l.dateISO.slice(0,7)
      if(!map[l.employeeId]) continue
      map[l.employeeId][month] = (map[l.employeeId][month] || 0) + 1
    }
    return map
  }, [employees, leaves])

  // month navigation state (YYYY-MM)
  const [monthKey, setMonthKey] = useState<string>(currentMonthKey())

  return (
    <div>
      <h1>Reports & Stats</h1>

      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:12}}>
        <button onClick={()=>setMonthKey(k=>addMonths(k,-1))}>← Prev month</button>
        <button onClick={()=>setMonthKey(currentMonthKey())}>This month</button>
        <button onClick={()=>setMonthKey(k=>addMonths(k,1))}>Next month →</button>
        <div style={{marginLeft:12, fontWeight:600}}>{monthLabel(monthKey)}</div>
      </div>

      <div style={{overflowX:'auto', border:'1px solid rgba(15,23,42,0.06)', borderRadius:8, background:'#fff', padding:12}}>
        <table style={{borderCollapse:'collapse', width:'100%', minWidth:480}}>
          <thead>
            <tr>
              <th style={{textAlign:'left', padding:8}}>Employee</th>
              <th style={{padding:8, textAlign:'center'}}>{monthLabel(monthKey)}</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp=> (
              <tr key={emp.id} style={{borderTop:'1px solid rgba(15,23,42,0.04)'}}>
                <td style={{padding:8}}>{emp.name}</td>
                <td style={{padding:8, textAlign:'center'}}>{counts[emp.id]?.[monthKey] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
