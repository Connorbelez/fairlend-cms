import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DecorIcon } from './decor-icon'
import { AppBreadcrumbs } from './app-breadcrumbs'
import { navLinks } from './app-shared'
import { CustomSidebarTrigger } from '../custom-sidebar-trigger/custom-sidebar-trigger'
import { NavUser } from './nav-user'
import { SendIcon, BellIcon } from 'lucide-react'

const activeItem = navLinks.find((item) => item.isActive)

export function AppHeader() {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6',
        'bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50',
      )}
    >
      <DecorIcon className="hidden md:block" position="bottom-left" />
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="mr-2 h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <AppBreadcrumbs page={activeItem} />
      </div>
      <div className="flex items-center gap-3">
        <Button size="icon" variant="outline">
          <SendIcon />
        </Button>
        <Button aria-label="Notifications" size="icon" variant="outline">
          <BellIcon />
        </Button>
        <Separator className="h-4 data-[orientation=vertical]:self-center" orientation="vertical" />
        <NavUser />
      </div>
    </header>
  )
}
