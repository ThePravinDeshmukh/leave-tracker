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
  // Build a map of sample employees (id -> employee) so we can fill missing fields
  const sampleEmpMap = useMemo(()=>{
    const m: Record<string, {monthlySalary?: number}> = {}
    for(const c of sampleData){
      for(const e of c.employees){
        m[e.id] = { monthlySalary: (e as any).monthlySalary }
      }
    }
    return m
  }, [])

  const employees = useMemo(()=> categories.flatMap(c=>c.employees).map(emp=>({
    ...emp,
    // if stored employee lacks monthlySalary, fall back to sample data value (if any)
    monthlySalary: (emp as any).monthlySalary ?? sampleEmpMap[emp.id]?.monthlySalary
  })), [categories, sampleEmpMap])

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

  // for the selected month, list the absent dates per employee (day numbers)
  const absentsByEmployee = useMemo(()=>{
    const map: Record<string, string[]> = {}
    for(const emp of employees) map[emp.id] = []
    for(const l of leaves){
      if(!l || !l.dateISO) continue
      if(!l.absent) continue
      const month = l.dateISO.slice(0,7)
      if(month !== monthKey) continue
      if(!map[l.employeeId]) continue
      // parse ISO yyyy-mm-dd deterministically to avoid timezone shifts
      // new Date('yyyy-mm-dd') can produce a Date at UTC midnight which when
      // converted to local time may become the previous day in some zones.
      const dayNum = Number(l.dateISO.slice(8,10))
      map[l.employeeId].push(String(dayNum))
    }
    // sort day numbers ascending and remove duplicates
    for(const id of Object.keys(map)){
      const unique = Array.from(new Set(map[id].map(x=>Number(x)).sort((a,b)=>a-b)))
      map[id] = unique.map(n=>String(n))
    }
    return map
  }, [employees, leaves, monthKey])

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
              <th style={{textAlign:'left', padding:8}}>Absent dates</th>
              <th style={{textAlign:'right', padding:8}}>Salary (calc)</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp=> (
              <tr key={emp.id} style={{borderTop:'1px solid rgba(15,23,42,0.04)'}}>
                <td style={{padding:8}}>{emp.name}</td>
                <td style={{padding:8, textAlign:'center'}}>{counts[emp.id]?.[monthKey] || 0}</td>
                <td style={{padding:8}} title={absentsByEmployee[emp.id]?.length ? absentsByEmployee[emp.id].map(d=>`${monthKey}-${d.padStart(2,'0')}`).join(', ') : ''}>
                  {absentsByEmployee[emp.id] && absentsByEmployee[emp.id].length ? absentsByEmployee[emp.id].join(', ') : '—'}
                </td>
                <td style={{padding:8, textAlign:'right'}}>
                  {emp.monthlySalary ? (
                    (()=>{
                      const absentDays = absentsByEmployee[emp.id]?.length || 0
                      const monthly = emp.monthlySalary || 0
                      const deduction = absentDays * (monthly / 30)
                      const calc = monthly - deduction
                      return calc.toFixed(2)
                    })()
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
