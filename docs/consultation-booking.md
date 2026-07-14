# Consultation Booking

FairLend's public consultation scheduler uses Microsoft Bookings. The landing-page leadership CTA
opens a modal with the official Bookings iframe, and the fallback link opens the same public
Bookings page in a new tab.

## Microsoft Bookings Setup

Created booking page:

```txt
https://outlook.office.com/book/FairLend1@fairlend.ca/?ismsaljsauthenabled
```

Direct service link:

```txt
https://outlook.office.com/book/FairLend1@fairlend.ca/s/QA3BoHC7iEmyHsiCzh6-NQ2?ismsaljsauthenabled
```

Configuration captured in Microsoft Bookings:

- Booking page name: `FairLend`
- Business type: `Financial services`
- Visibility: `Anyone`
- Initial service: `Free FairLend consultation`
- Duration: `30 mins`
- Initial availability: Monday-Friday, 9:00 AM-5:00 PM
- Staff/admin: Connor Beleznay

## Adding Staff And Availability

Staff and availability are managed in Microsoft Bookings, not in this Next.js app. The embedded
iframe reads the live FairLend Bookings page, so staff changes appear on the website after they are
saved in Bookings.

Use this flow:

1. Open Microsoft 365, then open Bookings.
2. Under Shared Bookings, select the `FairLend` booking page.
3. Go to Staff, then Add new staff.
4. For internal FairLend users, search for the person and select the directory match. For external
   staff, manually enter their name and email address.
5. Choose the staff role:
   - Team member: can receive bookings assigned to them.
   - Scheduler: can manage bookings.
   - Viewer: can view the calendar.
   - Guest: external staff with limited access.
6. Keep Events on Microsoft 365 calendar affect availability enabled for internal staff so Outlook
   busy/tentative events block public booking slots.
7. Choose whether the staff member uses business hours. If they need custom hours, turn off Use
   business hours and set their working windows per weekday.
8. Open Services, select `Free FairLend consultation`, and confirm the right staff members are
   assigned to the service.
9. If clients should choose a specific person, open Booking page settings and enable the staff option
   that allows customers to select a staff member. Leave it disabled if Bookings should assign from
   the available staff pool.

Microsoft references:

- https://learn.microsoft.com/en-us/microsoft-365/bookings/add-staff
- https://learn.microsoft.com/en-us/microsoft-365/bookings/staff-availability
- https://learn.microsoft.com/en-us/microsoft-365/bookings/employee-hours

Microsoft Bookings owns calendar sync and invite delivery. When a visitor books a slot, the
appointment is created in Outlook and Microsoft sends the calendar invite to the attendee and the
configured FairLend staff member.

## Website Integration

The embedded scheduler reads from:

```env
NEXT_PUBLIC_MICROSOFT_BOOKINGS_URL=https://outlook.office.com/book/FairLend1@fairlend.ca/?ismsaljsauthenabled
```

If the env var is not set, the app falls back to the captured FairLend Bookings URL in
`src/lib/fairlend-bookings.ts`.

Microsoft's generated iframe code:

```html
<iframe
  src="https://outlook.office.com/book/FairLend1@fairlend.ca/?ismsaljsauthenabled"
  width="100%"
  height="100%"
  scrolling="yes"
  style="border:0"
></iframe>
```

## Legacy Google Calendar Flow

The previous custom Payload consultation endpoints remain in the codebase, but the public landing
page no longer uses them for the leadership consultation CTA. Only configure the Google Calendar
environment variables if that custom flow is intentionally re-enabled.
