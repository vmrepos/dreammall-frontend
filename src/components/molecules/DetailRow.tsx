import { Link } from "react-router-dom"

type DetailRowProps = {
  label: string
  value: string
  href?: string
}

export const DetailRow = ({ label, value, href }: DetailRowProps) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    {href ? (
      <Link to={href} className="text-sm font-medium text-brand hover:underline">
        {value}
      </Link>
    ) : (
      <span className="text-right text-sm font-medium text-gray-900">{value}</span>
    )}
  </div>
)
