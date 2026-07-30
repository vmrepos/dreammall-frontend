type Props = {
  text: string
}
export const Notification: React.FC<Props> = ({ text }) => {
  return (
    <div className="mb-6 rounded-xl bg-brand-light px-4 py-3.5 text-sm text-brand" role="status">
      {text}
    </div>
  )
}