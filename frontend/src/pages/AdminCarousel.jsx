import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  getAllCarouselSlides,
  createCarouselSlide,
  updateCarouselSlide,
  deleteCarouselSlide,
} from '@/utils/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

function AdminCarousel() {
  const { token } = useAuth()
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null)
  const [deletingSlide, setDeletingSlide] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    order: '',
    active: true,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      setLoading(true)
      const response = await getAllCarouselSlides(token)
      if (response.success) {
        setSlides(response.data)
      } else {
        toast.error('Failed to load carousel slides')
      }
    } catch (error) {
      console.error('Error fetching carousel slides:', error)
      toast.error('Error loading carousel slides')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenSheet = (slide = null) => {
    if (slide) {
      setEditingSlide(slide)
      setFormData({
        title: slide.title,
        description: slide.description || '',
        image: slide.image,
        link: slide.link || '',
        order: slide.order.toString(),
        active: slide.active,
      })
    } else {
      setEditingSlide(null)
      setFormData({
        title: '',
        description: '',
        image: '',
        link: '',
        order: slides.length.toString(),
        active: true,
      })
    }
    setSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setSheetOpen(false)
    setEditingSlide(null)
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      order: '',
      active: true,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.image) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)

      const slideData = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        link: formData.link,
        order: parseInt(formData.order) || 0,
        active: formData.active,
      }

      let response
      if (editingSlide) {
        response = await updateCarouselSlide(editingSlide._id, slideData, token)
        if (response.success) {
          toast.success('Carousel slide updated successfully')
        }
      } else {
        response = await createCarouselSlide(slideData, token)
        if (response.success) {
          toast.success('Carousel slide created successfully')
        }
      }

      if (response.success) {
        fetchSlides()
        handleCloseSheet()
      } else {
        toast.error(response.message || 'Failed to save carousel slide')
      }
    } catch (error) {
      console.error('Error saving carousel slide:', error)
      toast.error('Error saving carousel slide')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await deleteCarouselSlide(deletingSlide._id, token)
      if (response.success) {
        toast.success('Carousel slide deleted successfully')
        fetchSlides()
      } else {
        toast.error(response.message || 'Failed to delete carousel slide')
      }
    } catch (error) {
      console.error('Error deleting carousel slide:', error)
      toast.error('Error deleting carousel slide')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingSlide(null)
    }
  }

  const handleToggleActive = async (slide) => {
    try {
      const response = await updateCarouselSlide(
        slide._id,
        { ...slide, active: !slide.active },
        token
      )
      if (response.success) {
        toast.success(`Slide ${slide.active ? 'deactivated' : 'activated'} successfully`)
        fetchSlides()
      } else {
        toast.error(response.message || 'Failed to update slide')
      }
    } catch (error) {
      console.error('Error toggling slide:', error)
      toast.error('Error updating slide')
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Carousel Management</CardTitle>
              <CardDescription>Manage carousel slides for the home page</CardDescription>
            </div>
            <Button onClick={() => handleOpenSheet()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Slide
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : slides.length === 0 ? (
            <Empty
              title="No carousel slides"
              description="Get started by creating your first carousel slide"
              action={{
                label: 'Add Slide',
                onClick: () => handleOpenSheet(),
              }}
            />
          ) : (
            <div className="space-y-4">
              {slides.map((slide) => (
                <Card key={slide._id} className="overflow-hidden">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6">
                    {/* Preview Image */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted sm:w-48">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=200&fit=crop'
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{slide.title}</h3>
                          {slide.description && (
                            <p className="text-sm text-muted-foreground">{slide.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={slide.active ? 'success' : 'secondary'}>
                            {slide.active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">Order: {slide.order}</Badge>
                        </div>
                      </div>

                      {slide.link && (
                        <p className="text-xs text-muted-foreground">
                          Link: {slide.link}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(slide)}
                          className="gap-1"
                        >
                          {slide.active ? (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3" />
                              Show
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenSheet(slide)}
                          className="gap-1"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeletingSlide(slide)
                            setDeleteDialogOpen(true)
                          }}
                          className="gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingSlide ? 'Edit Slide' : 'Add New Slide'}</SheetTitle>
            <SheetDescription>
              {editingSlide ? 'Update carousel slide details' : 'Create a new carousel slide'}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Premium Quality Meats"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the slide"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Image URL <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                type="url"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Link (Optional)</label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Display Order</label>
              <Input
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                placeholder="0"
                type="number"
                min="0"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="active" className="text-sm font-medium">
                Active (visible on homepage)
              </label>
            </div>

            <SheetFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseSheet}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : editingSlide ? 'Update Slide' : 'Create Slide'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the carousel slide &quot;{deletingSlide?.title}&quot;. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingSlide(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminCarousel
