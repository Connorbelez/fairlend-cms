const capitalStages = [
  { detail: 'Scope, budget and financing', label: 'Plan' },
  { detail: 'Fund completed milestones', label: 'Build + draws' },
  { detail: 'Move to long-term financing', label: 'Final mortgage' },
] as const

export function GardenSuiteCapitalRoute() {
  return (
    <div className="mt-[clamp(32px,4vw,52px)] border-t border-[rgb(7_21_34/24%)] pt-[clamp(24px,3vw,34px)]">
      <p className="m-0 text-xs leading-none font-extrabold tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
        YOUR FINANCING PATH / ONE CONNECTED PLAN
      </p>
      <div className="relative mt-5 before:absolute before:top-[17px] before:right-[calc(16.67%-16px)] before:left-[calc(16.67%-16px)] before:border-t-2 before:border-dashed before:border-[rgb(7_21_34/36%)] before:content-[''] max-[560px]:before:hidden">
        <span
          aria-hidden="true"
          className="absolute top-4 right-[calc(16.67%-16px)] left-[calc(16.67%-16px)] h-1 origin-left bg-[var(--gs-lime)] motion-safe:[@supports(animation-timeline:view())]:animate-in motion-safe:[@supports(animation-timeline:view())]:fade-in-0 motion-safe:[@supports(animation-timeline:view())]:zoom-in-0 motion-safe:[@supports(animation-timeline:view())]:duration-700 motion-safe:[@supports(animation-timeline:view())]:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:[@supports(animation-timeline:view())]:[animation-timeline:view()] motion-safe:[@supports(animation-timeline:view())]:[animation-range:entry_18%_cover_42%] motion-safe:[@supports(animation-timeline:view())]:[animation-fill-mode:both] max-[560px]:hidden"
        />
        <ol
          aria-label="Garden Suite capital route"
          className="relative grid list-none grid-cols-3 gap-3 p-0 max-[560px]:grid-cols-1 max-[560px]:gap-4"
        >
          {capitalStages.map((stage, index) => (
            <li
              className="relative z-[1] min-w-0 max-[560px]:grid max-[560px]:grid-cols-[2.25rem_minmax(0,1fr)] max-[560px]:gap-x-3"
              key={stage.label}
            >
              <span className="grid size-9 place-items-center border-2 border-[var(--gs-ink)] bg-[var(--gs-ink)] text-[0.6875rem] leading-none font-extrabold tracking-[0.08em] text-[var(--gs-lime)] [font-family:var(--font-oxanium),ui-monospace,monospace]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <strong className="mt-3 block text-base leading-none font-extrabold max-[560px]:mt-0 max-[560px]:self-center">
                {stage.label}
              </strong>
              <span className="mt-1.5 block text-base leading-[1.45] font-medium text-pretty max-[560px]:col-start-2">
                {stage.detail}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
