import React, {useEffect, useState} from 'react'
import WeekView from '../components/WeekView/WeekView'
import { sampleData } from '../sample-data'
import { EmployeeCategory } from '../types'

const STORAGE_KEY = 'leave-tracker:categories'

export default function Home(){
  const [data, setData] = useState<EmployeeCategory[]>(()=>{
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as EmployeeCategory[] : sampleData
    }catch(e){
      console.error('failed to read categories from storage', e)
      return sampleData
    }
  })

  useEffect(()=>{
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }catch(e){
      console.error('failed to save categories to storage', e)
    }
  },[data])

  return (
    <div>
      <h1>Team Leave Tracker</h1>
      <WeekView data={data} />
    </div>
  )
}
