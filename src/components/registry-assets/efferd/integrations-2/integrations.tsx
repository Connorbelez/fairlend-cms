import { cn } from '@/utilities/ui'
import { DecorIcon } from './decor-icon'

type Integration = {
  src: string
  name: string
  description: string
  isInvertable?: boolean
  icon?: React.ReactNode
}

const data: Integration[] = [
  {
    src: 'https://storage.efferd.com/logo/vercel.svg',
    name: 'Vercel',
    description: 'Amet praesentium deserunt ex commodi tempore fuga voluptatem....',
    isInvertable: true,
  },
  {
    src: 'https://storage.efferd.com/logo/openai.svg',
    name: 'OpenAI',
    description: 'Amet praesentium deserunt ex commodi tempore fuga voluptatem....',
    isInvertable: true,
    icon: <DecorIcon position="bottom-left" />,
  },
  {
    src: 'https://storage.efferd.com/logo/supabase.svg',
    name: 'Supabase',
    description: 'Amet praesentium deserunt ex commodi tempore fuga voluptatem....',
  },
  {
    src: 'https://storage.efferd.com/logo/github.svg',
    name: 'GitHub',
    description: 'Amet praesentium deserunt ex commodi tempore fuga voluptatem....',
    isInvertable: true,
  },
  {
    src: 'https://storage.efferd.com/logo/notion.svg',
    name: 'Notion',
    description: 'Amet praesentium deserunt ex commodi tempore fuga voluptatem....',
  },
  {
    src: 'https://storage.efferd.com/logo/gmail.svg',
    name: 'Gmail',
    description: 'Amet praesentium deserunt ex commodi tempore fuga voluptatem....',
    icon: <DecorIcon position="top-left" />,
  },
]

export function Integrations() {
  return (
    <div className="relative mx-auto max-w-5xl border">
      <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-3">
        {data.map((item) => (
          <IntegrationCard integration={item} key={item.name}>
            {item.icon}
          </IntegrationCard>
        ))}
      </div>
      <DecorIcon position="top-left" />
      <DecorIcon position="top-right" />
      <DecorIcon position="bottom-left" />
      <DecorIcon position="bottom-right" />
    </div>
  )
}

function IntegrationCard({
  integration,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  integration: Integration
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-start gap-4 bg-background p-4 text-start md:p-6 md:even:bg-background/75',
        className,
      )}
      {...props}
    >
      <img
        alt={integration.name}
        className={cn(
          'pointer-events-none size-8 shrink-0 select-none object-contain',
          integration.isInvertable && 'dark:invert',
        )}
        height={32}
        src={integration.src}
        width={32}
      />
      <div className="space-y-1">
        <h3 className="font-semibold">{integration.name}</h3>
        <p className="text-muted-foreground text-xs md:text-sm">{integration.description}</p>
      </div>
      {children}
    </div>
  )
}
