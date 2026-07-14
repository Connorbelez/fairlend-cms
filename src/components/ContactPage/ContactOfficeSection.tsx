import { FairlendOfficeMap } from '@/components/FairlendOfficeMap'

export function ContactOfficeSection() {
  return (
    <section aria-labelledby="contact-office-title" className="contact-office">
      <div className="contact-office__copy">
        <div>
          <p className="contact-kicker">Toronto office</p>
          <h2 id="contact-office-title">Bring the file to the Toronto desk.</h2>
          <p>
            For an in-person working session, arrange a time with our team before visiting. We’ll
            review the property, capital need, timing, and constraints at 890 Sheppard Avenue West.
          </p>
        </div>

        <dl className="contact-office__visit-note">
          <div>
            <dt>Visits</dt>
            <dd>By appointment</dd>
          </div>
          <div>
            <dt>Desk</dt>
            <dd>Toronto / Ontario</dd>
          </div>
        </dl>
      </div>

      <FairlendOfficeMap className="contact-office__map" variant="contact" />
    </section>
  )
}
