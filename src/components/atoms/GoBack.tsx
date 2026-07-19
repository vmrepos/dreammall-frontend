import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

type Props = {
  text: string
  route: string
}
export const GoBack = ({ text, route }: Props) => (
  <Link
    to={route}
    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
  >
    <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
    {text}
  </Link>
)