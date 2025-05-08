import { useEffect, useState } from "react"
import { axiosInstance } from "./axios"
import { Color, Employee, EmployeeType, Size } from "../types/apiType"

export const useAppData = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeTypes, setEmployeeTypes] = useState<EmployeeType[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get<Employee[]>("/api/employees")
      setEmployees(res.data)
    } catch (err) {
      console.error("Error fetching employees:", err)
      setError(err as Error)
    }
  }

  const fetchEmployeeTypes = async () => {
    try {
      const res = await axiosInstance.get<EmployeeType[]>("/api/employeeType")
      setEmployeeTypes(res.data)
    } catch (err) {
      console.error("Error fetching employee types:", err)
      setError(err as Error)
    }
  }

  const fetchColors = async () => {
    try {
      const res = await axiosInstance.get<Color[]>("/api/color")
      setColors(res.data)
    } catch (err) {
      console.error("Error fetching colors:", err)
      setError(err as Error)
    }
  }

  const fetchSizes = async () => {
    try {
      const res = await axiosInstance.get<Size[]>("/api/size")
      setSizes(res.data)
    } catch (err) {
      console.error("Error fetching sizes:", err)
      setError(err as Error)
    }
  }

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([
      fetchEmployees(),
      fetchEmployeeTypes(),
      fetchColors(),
      fetchSizes(),
    ])
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return {
    employees,
    employeeTypes,
    colors,
    sizes,
    loading,
    error,
    refetchAll: fetchAll,
  }
}
