import { useContext } from "react"
import { ApplicationContext } from "../providers/application"





export const useApplication = () => {
  return useContext(ApplicationContext)
}