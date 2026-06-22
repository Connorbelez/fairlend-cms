import { FullWidthDivider } from './full-width-divider'
import { QuoteIcon } from 'lucide-react'

type Testimonial = {
  quote: string
  name: string
  role: string
  company?: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      'Efferd is so polished I might just retire and become a full-time potato farmer. The ecosystem is in safe hands.',
    name: 'Shadcn',
    role: 'Founder',
    company: 'Shadcn UI',
  },
  {
    quote:
      'Efferd is why I still have hair. No more pulling it out over centering divs or fighting with CSS grid.',
    name: 'Guillermo Rauch',
    role: 'CEO',
    company: 'Vercel',
  },

  {
    quote:
      "I tried to buy Efferd but they wouldn't sell. So I just bought Twitter instead to complain about it.",
    name: 'Elon Musk',
    role: 'CEO',
    company: 'X.com',
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative mx-auto min-h-screen w-full max-w-4xl place-content-center border-x">
      <FullWidthDivider />
      <div className="grid md:grid-cols-[2fr_1px_1fr]">
        <div className="divide-y">
          {testimonials.slice(0, 2).map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
        <div className="h-px bg-border md:h-auto" />
        <div className="flex items-center">
          <TestimonialCard testimonial={testimonials[2] as Testimonial} />
        </div>
      </div>
      <FullWidthDivider />
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { quote, name, role, company } = testimonial

  return (
    <figure className="p-6 md:p-8">
      <QuoteIcon aria-hidden="true" className="mb-4 size-12 stroke-1 text-muted-foreground" />

      <blockquote className="mb-6 font-normal text-base text-foreground md:text-lg">
        &quot;{quote}&quot;
      </blockquote>

      <figcaption className="flex flex-col gap-0.5">
        <cite className="font-medium text-foreground text-lg not-italic">{name}</cite>
        <p className="text-muted-foreground text-sm">
          {role}
          {company && `, ${company}`}
        </p>
      </figcaption>
    </figure>
  )
}
