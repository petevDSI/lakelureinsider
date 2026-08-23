import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Lake Lure Insider — questions, corrections, local tips, or business inquiries.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-(--forest)">Contact Us</h1>
      <p className="mt-3 text-(--ink)/80">
        Have a question, a correction, a local tip, or a business inquiry? Send us a message
        and we&apos;ll get back to you.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  )
}
