export function startOfWeek(date = new Date()): Date {
  // return Monday of the given date's week
  const d = new Date(date)
  const day = d.getDay() // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1) - day // shift to Monday
  d.setDate(d.getDate() + diff)
  d.setHours(0,0,0,0)
  return d
}

export function addDays(d: Date, n: number){
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  x.setHours(0,0,0,0)
  return x
}

export function formatISO(d: Date){
  // Return local date in yyyy-mm-dd using local date components to avoid
  // timezone shifts caused by toISOString().slice(0,10).
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatShort(d: Date){
  return d.toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'})
}
