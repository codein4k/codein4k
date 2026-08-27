import Navbar from './Navbar'
import { getSiteConfig } from '@/lib/site-config'

export default async function NavbarWrapper() {
  const config = await getSiteConfig()
  return <Navbar config={config} />
}
