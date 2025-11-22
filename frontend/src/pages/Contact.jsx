import { useState } from 'react'
import { submitInquiry } from '@/utils/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { Mail, MessageSquare, User } from 'lucide-react'
import { toast } from 'sonner'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const response = await submitInquiry(formData)

      if (response.success) {
        setSuccess(true)
        toast.success(response.message)
        setFormData({ name: '', email: '', message: '' })

        // Reset success state after 5 seconds
        setTimeout(() => setSuccess(false), 5000)
      } else {
        toast.error(response.message || 'Failed to submit inquiry')
      }
    } catch (err) {
      toast.error('Error submitting inquiry. Please try again.')
      console.error('Error submitting inquiry:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Contact Us</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Have a question or comment? We'd love to hear from you!
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Contact Info */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Get in Touch</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  We're here to help and answer any questions you may have
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Mail className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold sm:text-base">Email</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      info@northwestmeats.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <MessageSquare className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold sm:text-base">Response Time</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-3 sm:p-4">
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    For urgent matters regarding your order, please include your order
                    number in your message.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Send us a Message</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Fill out the form below and we'll get back to you soon
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-xs font-medium leading-none sm:text-sm"
                    >
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="pl-10 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-xs font-medium leading-none sm:text-sm"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="pl-10 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-xs font-medium leading-none sm:text-sm"
                    >
                      Your Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us what's on your mind..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="resize-none text-sm sm:text-base"
                    />
                  </div>

                  {success && (
                    <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200 sm:p-4 sm:text-base">
                      Thank you for reaching out! We've received your message and will respond
                      shortly.
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full text-sm sm:text-base"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner className="mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
