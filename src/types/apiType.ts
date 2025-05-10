export interface Employee {
  id: string;
  login: string;
  department: {
    id: string;
    name: string;
  };
  departmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Color {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Size {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type Status = {
  id: string
  productId: string
  status: string
  date: string
  userId: string
}

export type Yaroqsiz = {
  id: string
  lineId: string
  sabali: string
  soni: number
}

export type Product = {
  id: string
  model: string
  mainProtsessId: string
  department: string
  departmentId: string
  qabulQiluvchiBolim: string
  umumiySoni: number
  qoshilganlarSoni: number
  qoldiqSolni: number
  qoshimchaMalumotlar: string
  protsessIsOver: boolean
  createdAt: string
  updatedAt: string
  color: [
    {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      statusId: string;
    }
  ]
  size:[
    {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      statusId: string;
    }
  ]
  status: Status[]
  yaroqsizlarSoni: Yaroqsiz[]
  yuborilganlarSoni: any[] 
}