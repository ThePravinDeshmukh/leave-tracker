export type Employee = {
  id: string
  name: string
}

export type EmployeeCategory = {
  id: string
  name: string
  employees: Employee[]
}

export type Leave = {
  dateISO: string // yyyy-mm-dd
  employeeId: string
  note?: string
  absent?: boolean
}
