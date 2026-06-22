import { FairlendSectionTransition } from '@/components/FairlendSectionTransition'
import { FairlendServicesSection } from '@/components/FairlendServicesSection'
import { FairlendTestimonialsMarquee } from '@/components/FairlendTestimonialsMarquee'

function FairlendEditorialBridge() {
  return (
    <div
      className="relative z-10 overflow-hidden px-5 py-8 sm:px-8 md:py-10 lg:py-12"
      data-fairlend-motion="editorial-bridge"
      data-testid="fairlend-editorial-bridge"
    >
      <div className="mx-auto grid w-full max-w-[1528px] gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(320px,0.58fr)_minmax(0,1fr)] lg:items-center">
        <div className="hidden h-px bg-[linear-gradient(90deg,transparent_0%,rgb(202_219_216/62%)_18%,rgb(202_219_216/0%)_100%)] lg:block" />
        <div className="relative rounded-none border-y border-[rgb(211_225_222/58%)] py-5">
          <span className="mb-4 block h-0.5 w-11 bg-[var(--fairlend-orange)]" />
          <p className="m-0 text-[11px] font-extrabold tracking-[0.34em] text-[var(--fairlend-orange-text)] uppercase">
            Signal to structure
          </p>
          <p className="mt-3 mb-0 text-balance text-[clamp(20px,2vw,28px)] leading-[1.06] font-extrabold text-[var(--fairlend-ink)]">
            Client proof becomes a financing path with fewer unknowns.
          </p>
        </div>
        <div className="grid grid-cols-3 border-y border-[rgb(211_225_222/48%)] text-[10px] leading-none font-extrabold tracking-[0.2em] text-[#486572] uppercase sm:text-[11px]">
          {['Risk read', 'Terms mapped', 'File moved'].map((label, index) => (
            <span
              className="relative flex min-h-16 items-center justify-center text-center"
              key={label}
            >
              {label}
              {index < 2 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 right-0 h-9 w-px -translate-y-1/2 bg-[rgb(211_225_222/64%)]"
                />
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FairlendOpportunityCanvas() {
  return (
    <div
      className="relative isolate overflow-hidden bg-[rgb(255_253_247)] bg-[radial-gradient(ellipse_82%_36rem_at_50%_0%,rgb(255_255_255/70%)_0%,rgb(246_251_250/28%)_42%,rgb(255_253_247/0%)_72%),radial-gradient(ellipse_74%_28rem_at_82%_32%,rgb(229_241_239/24%)_0%,rgb(255_253_247/0%)_68%),linear-gradient(180deg,rgb(255_253_247)_0%,rgb(252_255_252)_46%,rgb(255_253_247)_100%)] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[linear-gradient(to_right,rgb(29_58_60/3%)_1px,transparent_1px),linear-gradient(to_bottom,rgb(29_58_60/3%)_1px,transparent_1px)] before:opacity-[0.44] before:[background-size:44px_44px] after:pointer-events-none after:absolute after:inset-x-0 after:top-[42%] after:z-0 after:h-[34rem] after:bg-[radial-gradient(ellipse_78%_52%_at_50%_50%,rgb(255_255_255/54%)_0%,rgb(247_251_249/36%)_48%,transparent_76%)]"
      data-fairlend-canvas="opportunity"
    >
      <FairlendSectionTransition size="spacious" />
      <FairlendTestimonialsMarquee />
      <FairlendEditorialBridge />
      <div className="relative z-10 bg-[#f7e8dc] bg-[radial-gradient(ellipse_82%_36rem_at_50%_0%,rgb(255_252_247/44%)_0%,rgb(255_248_240/20%)_42%,rgb(247_232_220/0%)_72%),radial-gradient(ellipse_74%_28rem_at_82%_32%,rgb(235_218_202/24%)_0%,rgb(247_232_220/0%)_68%),linear-gradient(180deg,rgb(248_234_223)_0%,rgb(247_232_220)_32%,rgb(250_243_234)_54%,var(--fairlend-cream)_100%)]">
        <FairlendServicesSection />
      </div>
    </div>
  )
}
