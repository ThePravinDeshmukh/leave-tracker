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
  return d.toISOString().slice(0,10)
}

export function formatShort(d: Date){
  return d.toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'})
}
