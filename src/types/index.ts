export interface User {
  id: string
  fullName: string
  username: string
  password: string
  department: {
    createdAt: string
    updatedAt: string
    id: string,
    name: string
  }
  role: "admin" | "user"
}

export interface Department {
  id: string
  name: string
}

export interface Color {
  id: string
  name: string
}

export interface Size {
  id: string
  name: string
}

export interface Model {
  id: string
  name: string
}

export interface Material {
  id: string
  name: string
}

export interface JourneyStep {
  department: string
  date: string
  status: "completed" | "current" | "pending"
}

export interface TransferItem {
  id: string
  fullName: string
  sendDate: string
  sendTime: string
  senderDepartment: string
  receiverDepartment: string
  model: string
  materialType: string
  totalCount: number
  receivedCount: number
  color: string
  size: string
  additionalNotes: string
  status: "pending" | "partial" | "completed"
  journey?: JourneyStep[]
}

export interface ReceiveItem {
  id: string
  fullName: string
  receiveDate: string
  receiveTime: string
  senderDepartment: string
  receiverDepartment: string
  model: string
  materialType: string
  sentCount: number
  receivedCount: number
  difference: number
  color: string
  size: string
  additionalNotes: string
  journey?: JourneyStep[]
}

export interface ToastProps {
  type: "success" | "warning" | "info" | "error"
  message: string
  duration?: number
}

export interface ProductTrackingItem {
  id: string
  model: string
  materialType: string
  color: string
  size: string
  currentDepartment: string
  journey: JourneyStep[]
}


