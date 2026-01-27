import { useTheme } from '../hooks/useTheme'
import StarfieldBackground from './StarfieldBackground'
import SunRaysBackground from './SunRaysBackground'

interface Props {
  children: React.ReactNode
}

export default function ModalBackground({ children }: Props) {
  const { theme } = useTheme()

  return (
    <>
      <StarfieldBackground isModal />
      {theme === 'light' && <SunRaysBackground isModal />}
      {children}
    </>
  )
}
