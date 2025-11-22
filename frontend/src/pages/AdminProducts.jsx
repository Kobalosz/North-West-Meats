import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '@/utils/api'
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
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

function AdminProducts() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    desc: '',
    img: '',
    stock: '',
    available: true,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getAllProducts()
      if (response.success) {
        setProducts(response.data)
      }
    } catch (err) {
      toast.error('Error fetching products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenSheet = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        price: product.price.toString(),
        desc: product.desc || '',
        img: product.img,
        stock: product.stock.toString(),
        available: product.available,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        price: '',
        desc: '',
        img: '',
        stock: '',
        available: true,
      })
    }
    setSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setSheetOpen(false)
    setEditingProduct(null)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.img || !formData.stock) {
      toast.error('Please fill in all required fields')
      return
    }

    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      desc: formData.desc.trim(),
      img: formData.img.trim(),
      stock: parseInt(formData.stock),
      available: formData.available,
    }

    try {
      setSubmitting(true)
      let response

      if (editingProduct) {
        response = await updateProduct(editingProduct._id, productData, token)
      } else {
        response = await createProduct(productData, token)
      }

      if (response.success) {
        toast.success(
          editingProduct ? 'Product updated successfully' : 'Product created successfully'
        )
        handleCloseSheet()
        fetchProducts()
      } else {
        toast.error(response.message || 'Failed to save product')
      }
    } catch (err) {
      toast.error('Error saving product')
      console.error('Error saving product:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (product) => {
    setDeletingProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteProduct(deletingProduct._id, token)

      if (response.success) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        toast.error(response.message || 'Failed to delete product')
      }
    } catch (err) {
      toast.error('Error deleting product')
      console.error('Error deleting product:', err)
    } finally {
      setDeleteDialogOpen(false)
      setDeletingProduct(null)
    }
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
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Product Management</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Manage your product inventory and availability
          </p>
        </div>
        <Button onClick={() => handleOpenSheet()} className="w-full text-sm sm:w-auto sm:text-base">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Empty
            title="No products yet"
            description="Get started by adding your first product"
            action={{
              label: 'Add Product',
              onClick: () => handleOpenSheet(),
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product._id}>
              <CardHeader className="p-4 sm:p-6">
                <img
                  src={product.img}
                  alt={product.name}
                  className="mb-3 h-40 w-full rounded-md object-cover sm:mb-4 sm:h-48"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop'
                  }}
                />
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1 text-base sm:text-lg">{product.name}</CardTitle>
                  <Badge variant={product.available ? 'success' : 'destructive'} className="text-xs">
                    {product.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 text-xs sm:text-sm">
                  {product.desc || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Stock:</span>
                  <span className="font-semibold">{product.stock} units</span>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    className="flex-1 text-sm"
                    onClick={() => handleOpenSheet(product)}
                  >
                    <Pencil className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 text-sm"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <Trash2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <SheetHeader className="pb-4">
              <SheetTitle className="text-lg sm:text-xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</SheetTitle>
              <SheetDescription className="text-xs sm:text-sm">
                {editingProduct
                  ? 'Update the product details below'
                  : 'Fill in the details to create a new product'}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-medium sm:text-sm">
                  Product Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Premium Beef Steak"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-xs font-medium sm:text-sm">
                  Price ($) *
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="19.99"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="stock" className="text-xs font-medium sm:text-sm">
                  Stock Quantity *
                </label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="50"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="img" className="text-xs font-medium sm:text-sm">
                  Image URL *
                </label>
                <Input
                  id="img"
                  name="img"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.img}
                  onChange={handleInputChange}
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="desc" className="text-xs font-medium sm:text-sm">
                  Description
                </label>
                <Textarea
                  id="desc"
                  name="desc"
                  placeholder="Describe your product..."
                  value={formData.desc}
                  onChange={handleInputChange}
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="available"
                  name="available"
                  type="checkbox"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="available" className="text-xs font-medium sm:text-sm">
                  Available for purchase
                </label>
              </div>
            </div>

            <SheetFooter className="flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={handleCloseSheet} className="w-full text-sm sm:w-auto sm:text-base">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="w-full text-sm sm:w-auto sm:text-base">
                {submitting ? (
                  <>
                    <Spinner className="mr-2" />
                    {editingProduct ? 'Updating...' : 'Creating...'}
                  </>
                ) : editingProduct ? (
                  'Update Product'
                ) : (
                  'Create Product'
                )}
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
              This will permanently delete "{deletingProduct?.name}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminProducts
