'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChartNoAxesColumnIncreasing, House, MapPin, Phone } from 'lucide-react'
import { FormEvent, useCallback, useLayoutEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import styles from './page.module.css'

const formTabs = [
  {
    description: 'Tell us where you are building.',
    heading: 'Start your application',
    icon: House,
    inputMode: 'text',
    label: 'Build',
    name: 'buildAddress',
    placeholder: 'Enter your property address',
    submitLabel: 'Start build application',
    type: 'text',
    value: 'build',
  },
  {
    description: 'Share the opportunity you want reviewed.',
    heading: 'Investor intake',
    icon: ChartNoAxesColumnIncreasing,
    inputMode: 'text',
    label: 'Invest',
    name: 'investmentFocus',
    placeholder: 'Target neighbourhood or deal type',
    submitLabel: 'Start investor intake',
    type: 'text',
    value: 'invest',
  },
  {
    description: 'Start with the property or your phone number.',
    heading: 'Mortgage request',
    icon: House,
    inputMode: 'text',
    label: 'Get a mortgage',
    name: 'mortgageAddress',
    placeholder: 'Enter property address or phone',
    submitLabel: 'Start mortgage request',
    type: 'text',
    value: 'mortgage',
  },
] as const

type FormTab = (typeof formTabs)[number]['value']

const initialValues = formTabs.reduce(
  (values, tab) => ({
    ...values,
    [tab.value]: '',
  }),
  {} as Record<FormTab, string>,
)

export function FairlendApplicationForm() {
  const [activeTab, setActiveTab] = useState<FormTab>('build')
  const [values, setValues] = useState(initialValues)
  const [submittedTab, setSubmittedTab] = useState<FormTab | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const pillRef = useRef<HTMLSpanElement | null>(null)
  const hasMeasuredRef = useRef(false)
  const reduceMotion = useReducedMotion()

  const activeConfig = formTabs.find((tab) => tab.value === activeTab) ?? formTabs[0]

  const movePill = useCallback(
    (animate: boolean) => {
      const list = listRef.current
      const pill = pillRef.current
      const tab = list?.querySelector<HTMLElement>(`[data-form-tab="${activeTab}"]`)

      if (!list || !pill || !tab) return

      const writePosition = () => {
        pill.style.transform = `translateX(${tab.offsetLeft}px)`
        pill.style.width = `${tab.offsetWidth}px`
      }

      if (!animate || reduceMotion) {
        const previousTransition = pill.style.transition
        pill.style.transition = 'none'
        writePosition()
        void pill.offsetWidth
        pill.style.transition = previousTransition
        return
      }

      writePosition()
    },
    [activeTab, reduceMotion],
  )

  useLayoutEffect(() => {
    movePill(hasMeasuredRef.current)
    hasMeasuredRef.current = true
  }, [movePill])

  useLayoutEffect(() => {
    const onResize = () => movePill(false)
    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [movePill])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmittedTab(activeTab)
  }

  return (
    <Card className={styles.applicationCard}>
      <Tabs onValueChange={(value) => setActiveTab(value as FormTab)} value={activeTab}>
        <TabsList
          aria-label="Application type"
          className={`${styles.applicationTabs} t-tabs`}
          ref={listRef}
        >
          <span aria-hidden="true" className="t-tabs-pill" ref={pillRef} />
          {formTabs.map(({ icon: Icon, label, value }) => (
            <TabsTrigger
              className={`${styles.appTab} t-tab`}
              data-form-tab={value}
              key={value}
              value={value}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className={styles.applicationBody}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -4, filter: 'blur(2px)' }}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 6, filter: 'blur(2px)' }}
            key={activeTab}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <TabsContent className={styles.tabContent} forceMount value={activeTab}>
              <h2>{activeConfig.heading}</h2>
              <form className={styles.tabForm} onSubmit={handleSubmit}>
                <input name="intent" type="hidden" value={activeConfig.value} />
                <label className={styles.srOnly} htmlFor={`fairlend-${activeConfig.value}`}>
                  {activeConfig.placeholder}
                </label>
                <span className={styles.srOnly} id={`fairlend-${activeConfig.value}-description`}>
                  {activeConfig.description}
                </span>
                <div className={styles.addressField}>
                  {activeTab === 'mortgage' ? (
                    <Phone aria-hidden="true" />
                  ) : (
                    <MapPin aria-hidden="true" />
                  )}
                  <Input
                    aria-describedby={`fairlend-${activeConfig.value}-description fairlend-${activeConfig.value}-status`}
                    autoComplete={activeTab === 'invest' ? 'organization' : 'street-address'}
                    className={styles.addressInput}
                    id={`fairlend-${activeConfig.value}`}
                    inputMode={activeConfig.inputMode}
                    name={activeConfig.name}
                    onChange={(event) => {
                      setSubmittedTab(null)
                      setValues((current) => ({
                        ...current,
                        [activeTab]: event.target.value,
                      }))
                    }}
                    placeholder={activeConfig.placeholder}
                    required
                    type={activeConfig.type}
                    value={values[activeTab]}
                  />
                  <Button
                    aria-label={activeConfig.submitLabel}
                    className={styles.addressSubmit}
                    size="icon"
                    type="submit"
                  >
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
                <p
                  aria-live="polite"
                  className={styles.formHint}
                  id={`fairlend-${activeConfig.value}-status`}
                >
                  {submittedTab === activeTab
                    ? 'Received. A Fairlend specialist will follow up.'
                    : ''}
                </p>
              </form>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </Card>
  )
}
