import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { Advantages } from '@/components/sections/advantages'
import { ContactsFaq } from '@/components/sections/contacts-faq'
import { Gallery } from '@/components/sections/gallery'
import { Hero } from '@/components/sections/hero'
import { Pricing } from '@/components/sections/pricing'
import { Tournaments } from '@/components/sections/tournaments'
import { Zones } from '@/components/sections/zones'
import { getBookingAvailability } from '@/lib/server/booking-config'

export default function HomePage() {
  const bookingAvailability = getBookingAvailability()

  return (
    <div id="top" className="page-shell">
      <SiteHeader />
      <main>
        <Hero />
        <Advantages />
        <Zones />
        <Pricing />
        <Tournaments />
        <Gallery />
        <ContactsFaq />
      </main>
      <SiteFooter />
      <BookingDialog availability={bookingAvailability} />
    </div>
  )
}
import { BookingDialog } from '@/components/booking/booking-dialog'
