import { useState } from "react"

type InputType = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

type UseFormProps<T> = {
  initialValues: T
  onSubmit: (values: T) => void | Promise<void>
}

const formatInput = (type: string, value: string) => {
  switch (type) {
    case "number":
      return value === "" ? 0 : Number(value)
    case "checkbox":
      return value
    default:
      return value
  }
}

export const useForm = <T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void onSubmit(values)
  }

  const mutate = (fields: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...fields }))
  }

  const handleChange = (e: React.ChangeEvent<InputType>) => {
    const { name, value, type } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: formatInput(type, value),
    }))
  }

  return { values, handleChange, handleSubmit, setValues, mutate }
}
