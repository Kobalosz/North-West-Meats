import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  getAllMarqueeItems,
  createMarqueeItem,
  updateMarqueeItem,
  deleteMarqueeItem,
} from '@/utils/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

function AdminMarquee() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [formData, setFormData] = useState({
    text: '',
    order: '',
    active: true,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await getAllMarqueeItems(token)
      if (response.success) {
        setItems(response.data)
      } else {
        toast.error('Failed to load marquee items')
      }
    } catch (error) {
      console.error('Error fetching marquee items:', error)
      toast.error('Error loading marquee items')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenSheet = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        text: item.text,
        order: item.order.toString(),
        active: item.active,
      })
    } else {
      setEditingItem(null)
      setFormData({
        text: '',
        order: items.length.toString(),
        active: true,
      })
    }
    setSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setSheetOpen(false)
    setEditingItem(null)
    setFormData({
      text: '',
      order: '',
      active: true,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.text) {
      toast.error('Please enter the marquee text')
      return
    }

    try {
      setSubmitting(true)

      const itemData = {
        text: formData.text,
        order: parseInt(formData.order) || 0,
        active: formData.active,
      }

      let response
      if (editingItem) {
        response = await updateMarqueeItem(editingItem._id, itemData, token)
        if (response.success) {
          toast.success('Marquee item updated successfully')
        }
      } else {
        response = await createMarqueeItem(itemData, token)
        if (response.success) {
          toast.success('Marquee item created successfully')
        }
      }

      if (response.success) {
        fetchItems()
        handleCloseSheet()
      } else {
        toast.error(response.message || 'Failed to save marquee item')
      }
    } catch (error) {
      console.error('Error saving marquee item:', error)
      toast.error('Error saving marquee item')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await deleteMarqueeItem(deletingItem._id, token)
      if (response.success) {
        toast.success('Marquee item deleted successfully')
        fetchItems()
      } else {
        toast.error(response.message || 'Failed to delete marquee item')
      }
    } catch (error) {
      console.error('Error deleting marquee item:', error)
      toast.error('Error deleting marquee item')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingItem(null)
    }
  }

  const handleToggleActive = async (item) => {
    try {
      const response = await updateMarqueeItem(
        item._id,
        { ...item, active: !item.active },
        token
      )
      if (response.success) {
        toast.success(`Item ${item.active ? 'deactivated' : 'activated'} successfully`)
        fetchItems()
      } else {
        toast.error(response.message || 'Failed to update item')
      }
    } catch (error) {
      console.error('Error toggling item:', error)
      toast.error('Error updating item')
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Marquee Management</CardTitle>
              <CardDescription>Manage scrolling marquee items for the home page</CardDescription>
            </div>
            <Button onClick={() => handleOpenSheet()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : items.length === 0 ? (
            <Empty
              title="No marquee items"
              description="Get started by creating your first marquee item"
              action={{
                label: 'Add Item',
                onClick: () => handleOpenSheet(),
              }}
            />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6">
                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{item.text}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={item.active ? 'success' : 'secondary'}>
                            {item.active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">Order: {item.order}</Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(item)}
                          className="gap-1"
                        >
                          {item.active ? (
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
                          onClick={() => handleOpenSheet(item)}
                          className="gap-1"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeletingItem(item)
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
            <SheetTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</SheetTitle>
            <SheetDescription>
              {editingItem ? 'Update marquee item details' : 'Create a new marquee item'}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Text <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Free pickup available for all orders over $50"
                required
              />
              <p className="text-xs text-muted-foreground">
                This text will scroll across the top of the homepage
              </p>
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
              <p className="text-xs text-muted-foreground">
                Items are combined in order and separated by bullets
              </p>
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
                {submitting ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
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
              This will permanently delete the marquee item &quot;{deletingItem?.text}&quot;. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingItem(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminMarquee
