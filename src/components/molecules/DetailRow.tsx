import { Link } from "react-router-dom"

type DetailRowProps = {
  label: string
  value: string
  href?: string
}

export const DetailRow = ({ label, value, href }: DetailRowProps) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0 phone:flex-col phone:gap-1">
    <span className="text-sm text-gray-500">{label}</span>
    {href ? (
      <Link to={href} className="break-words text-right text-sm font-medium text-brand hover:underline phone:text-left">
        {value}
      </Link>
    ) : (
      <span className="break-words text-right text-sm font-medium text-gray-900 phone:text-left">
        {value}
      </span>
    )}
  </div>
)
