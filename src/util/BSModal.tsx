import {Modal, ModalProps} from "react-bootstrap"
import {useGetCurrentTheme} from "../pages/layout/theme"


type props = ModalProps

export default function BSModal({children, ...other}: props) {
  const getTheme = useGetCurrentTheme()
  return (
      <Modal data-bs-theme={getTheme()} {...other}>
        {children}
      </Modal>
  )
}