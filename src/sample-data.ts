import { EmployeeCategory, Employee } from './types'

export const sampleData: EmployeeCategory[] = [
  {
    id: 'css-engg',
    name: 'CSS Engineers',
    employees: [
      { id: 'e1', name: 'Abdul' },
      { id: 'e2', name: 'Ritik' },
      { id: 'e3', name: 'Saurabh' }
    ]
  },
  {
    id: 'developers',
    name: 'Developers',
    employees: [
      { id: 'd1', name: 'Shreya' },
      { id: 'd2', name: 'Sufiyan' },
      { id: 'd3', name: 'Vinish' },
      { id: 'd4', name: 'Ahmed' },
      { id: 'd5', name: 'Komal T' },
      { id: 'd6', name: 'Ruchita' },
      { id: 'd7', name: 'Jackson' },
    ]
  },
  {
    id: 'home',
    name: 'Home',
    employees: [
      { id: 'h1', name: 'Pallavi' }
    ]
  }
]
