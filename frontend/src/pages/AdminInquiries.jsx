import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getAllInquiries, updateInquiryStatus, deleteInquiry } from '@/utils/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Mail, Calendar, Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

function AdminInquiries() {
  const { token } = useAuth()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingInquiry, setUpdatingInquiry] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingInquiry, setDeletingInquiry] = useState(null)
  const [expandedInquiry, setExpandedInquiry] = useState(null)
  const [adminNotes, setAdminNotes] = useState({})

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const response = await getAllInquiries(token)
      if (response.success) {
        setInquiries(response.data)
        // Initialize admin notes
        const notes = {}
        response.data.forEach((inq) => {
          notes[inq._id] = inq.adminNotes || ''
        })
        setAdminNotes(notes)
      }
    } catch (err) {
      toast.error('Error fetching inquiries')
      console.error('Error fetching inquiries:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      setUpdatingInquiry(inquiryId)
      const response = await updateInquiryStatus(inquiryId, { status: newStatus }, token)

      if (response.success) {
        toast.success(`Inquiry marked as ${newStatus}`)
        fetchInquiries()
      } else {
        toast.error(response.message || 'Failed to update inquiry status')
      }
    } catch (err) {
      toast.error('Error updating inquiry status')
      console.error('Error updating inquiry status:', err)
    } finally {
      setUpdatingInquiry(null)
    }
  }

  const handleSaveNotes = async (inquiryId) => {
    try {
      setUpdatingInquiry(inquiryId)
      const response = await updateInquiryStatus(
        inquiryId,
        { adminNotes: adminNotes[inquiryId] },
        token
      )

      if (response.success) {
        toast.success('Notes saved successfully')
        fetchInquiries()
      } else {
        toast.error(response.message || 'Failed to save notes')
      }
    } catch (err) {
      toast.error('Error saving notes')
      console.error('Error saving notes:', err)
    } finally {
      setUpdatingInquiry(null)
    }
  }

  const handleDeleteClick = (inquiry) => {
    setDeletingInquiry(inquiry)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteInquiry(deletingInquiry._id, token)

      if (response.success) {
        toast.success('Inquiry deleted successfully')
        fetchInquiries()
      } else {
        toast.error(response.message || 'Failed to delete inquiry')
      }
    } catch (err) {
      toast.error('Error deleting inquiry')
      console.error('Error deleting inquiry:', err)
    } finally {
      setDeleteDialogOpen(false)
      setDeletingInquiry(null)
    }
  }

  const handleEmailClick = (email, subject, name) => {
    const mailtoLink = `mailto:${email}?subject=Re: ${encodeURIComponent(
      subject || 'Your Inquiry'
    )}&body=${encodeURIComponent(`Hello ${name},\n\n`)}`
    window.location.href = mailtoLink
  }

  const newInquiries = inquiries.filter((inq) => inq.status === 'new')
  const readInquiries = inquiries.filter((inq) => inq.status === 'read')
  const respondedInquiries = inquiries.filter((inq) => inq.status === 'responded')

  const InquiryCard = ({ inquiry }) => {
    const isExpanded = expandedInquiry === inquiry._id

    return (
      <Card key={inquiry._id}>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg">{inquiry.name}</CardTitle>
                <Badge
                  variant={
                    inquiry.status === 'new'
                      ? 'destructive'
                      : inquiry.status === 'responded'
                      ? 'success'
                      : 'secondary'
                  }
                  className="text-xs"
                >
                  {inquiry.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1 text-xs sm:text-sm">
                <Mail className="h-3 w-3" />
                <span className="truncate">{inquiry.email}</span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          {/* Message */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold sm:text-sm">Message:</h4>
            <p
              className={`text-xs text-muted-foreground sm:text-sm ${
                !isExpanded && 'line-clamp-2'
              }`}
            >
              {inquiry.message}
            </p>
            {inquiry.message.length > 100 && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() =>
                  setExpandedInquiry(isExpanded ? null : inquiry._id)
                }
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </Button>
            )}
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold sm:text-sm">Admin Notes:</h4>
            <Textarea
              placeholder="Add notes about this inquiry..."
              value={adminNotes[inquiry._id] || ''}
              onChange={(e) =>
                setAdminNotes((prev) => ({ ...prev, [inquiry._id]: e.target.value }))
              }
              rows={3}
              className="text-xs sm:text-sm"
            />
            {adminNotes[inquiry._id] !== inquiry.adminNotes && (
              <Button
                size="sm"
                onClick={() => handleSaveNotes(inquiry._id)}
                disabled={updatingInquiry === inquiry._id}
                className="text-xs sm:text-sm"
              >
                {updatingInquiry === inquiry._id ? (
                  <>
                    <Spinner className="mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Notes'
                )}
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs sm:text-sm"
              onClick={() => handleEmailClick(inquiry.email, 'Your Inquiry', inquiry.name)}
            >
              <ExternalLink className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              Reply via Email
            </Button>

            {inquiry.status !== 'responded' && (
              <Button
                size="sm"
                className="flex-1 text-xs sm:text-sm"
                onClick={() => handleStatusUpdate(inquiry._id, 'responded')}
                disabled={updatingInquiry === inquiry._id}
              >
                {updatingInquiry === inquiry._id ? (
                  <>
                    <Spinner className="mr-2" />
                    Updating...
                  </>
                ) : (
                  'Mark as Responded'
                )}
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              className="flex-1 text-xs sm:text-sm"
              onClick={() => handleDeleteClick(inquiry)}
            >
              <Trash2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Customer Inquiries</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          View and respond to customer questions and comments
        </p>
      </div>

      {/* Inquiries List */}
      {inquiries.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Empty
            title="No inquiries yet"
            description="Customer inquiries will appear here when they contact you"
          />
        </div>
      ) : (
        <Tabs defaultValue="new">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="new" className="text-xs sm:text-sm">
              New ({newInquiries.length})
            </TabsTrigger>
            <TabsTrigger value="read" className="text-xs sm:text-sm">
              Read ({readInquiries.length})
            </TabsTrigger>
            <TabsTrigger value="responded" className="text-xs sm:text-sm">
              Responded ({respondedInquiries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-4 sm:mt-6">
            {newInquiries.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Empty
                  title="No new inquiries"
                  description="New inquiries will appear here"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {newInquiries.map((inquiry) => (
                  <InquiryCard key={inquiry._id} inquiry={inquiry} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="read" className="mt-4 sm:mt-6">
            {readInquiries.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Empty title="No read inquiries" description="Read inquiries will appear here" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {readInquiries.map((inquiry) => (
                  <InquiryCard key={inquiry._id} inquiry={inquiry} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="responded" className="mt-4 sm:mt-6">
            {respondedInquiries.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Empty
                  title="No responded inquiries"
                  description="Inquiries you've responded to will appear here"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {respondedInquiries.map((inquiry) => (
                  <InquiryCard key={inquiry._id} inquiry={inquiry} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the inquiry from "{deletingInquiry?.name}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminInquiries
