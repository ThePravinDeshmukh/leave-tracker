export type Employee = {
  id: string
  name: string
  /** monthly salary in your currency (optional). If absent or 0, salary calc is skipped */
  monthlySalary?: number
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
