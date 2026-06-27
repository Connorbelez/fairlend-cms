import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DecorIcon } from './decor-icon'
import { Phone, Mail } from 'lucide-react'

const data = [
  {
    title: 'Call Us Today!',
    value: '+1 (555) 123-4567',
    icon: <Phone />,
  },
  {
    title: 'Send an Email',
    value: 'mail@example.com',
    icon: <Mail />,
  },
]

export function ContactSection() {
  return (
    <div className="relative mx-auto w-full max-w-lg border">
      <div className="border-b px-6 py-8">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="font-semibold text-xl md:text-2xl">Get in touch</h1>{' '}
          <p className="text-muted-foreground text-sm">
            Have a question, feedback, or want to collaborate? <br /> We&apos;d love to hear from
            you.
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {data.map((item) => (
            <div className="flex items-center gap-4 p-2" key={item.title}>
              <div className="[&_svg]:size-5 [&_svg]:text-muted-foreground">{item.icon}</div>
              <div className={cn('flex flex-col gap-y-0.5')}>
                <h2 className="text-sm">{item.title}</h2>
                <p className="text-muted-foreground text-xs">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="mb-8 flex flex-col gap-1.5">
          <h2 className="font-medium text-xl">Send a message</h2>{' '}
          <p className="text-muted-foreground text-sm">
            Fill out the form below and our team will get back to you shortly.
          </p>
        </div>
        <ContactForm />
      </div>
      <DecorIcon position="top-left" />
      <DecorIcon position="top-right" />
      <DecorIcon position="bottom-left" />
      <DecorIcon position="bottom-right" />
    </div>
  )
}

function ContactForm() {
  return (
    <form className="w-full">
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="first-name">First name</FieldLabel>
            <Input autoComplete="off" id="first-name" placeholder="John" />
          </Field>
          <Field>
            <FieldLabel htmlFor="last-name">Last name</FieldLabel>
            <Input autoComplete="off" id="last-name" placeholder="Doe" />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input autoComplete="off" id="email" placeholder="johndoe@example.com" type="email" />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input autoComplete="off" id="phone" placeholder="+1 (555) 123-4567" type="tel" />
        </Field>
        <Field>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea autoComplete="off" id="message" placeholder="Your message" />
        </Field>
      </FieldGroup>
      <Button className="mt-8 w-full" type="button">
        Submit
      </Button>
    </form>
  )
}
