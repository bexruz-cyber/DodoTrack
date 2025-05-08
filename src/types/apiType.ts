export interface Employee {
    id: string
    login: string
    department: {
      id: string,
      name: string
    }
    departmentId: string
    createdAt: string
    updatedAt: string
  }
  
  
  export interface Color {
    id: string
    name: string
    createdAt: string
    updatedAt: string
  }
  
  export interface Size {
    id: string
    name: string
    createdAt: string
    updatedAt: string
  }
  
  export interface EmployeeType {
    id: string
    name: string
    createdAt: string
    updatedAt: string
  }