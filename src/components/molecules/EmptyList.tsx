import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import { useNavigate } from 'react-router-dom'
import { Button } from '../atoms/Button'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  icon: IconProp
  title: string
  description: string
  actionUrl: string
  actionText: string
}
export const EmptyList: React.FC<Props> = ({ icon, title, description, actionUrl, actionText }) => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-light text-brand">
        <FontAwesomeIcon icon={icon} className="size-6" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
        {description}
      </p>
      <Button className="mt-6" onClick={() => navigate(actionUrl)}>
        {actionText}
      </Button>
    </div>
  )
}