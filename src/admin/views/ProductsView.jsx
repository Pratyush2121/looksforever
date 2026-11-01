import React, { useState, useEffect, useCallback } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import AdminBadge from '../components/AdminBadge';
import AdminInput from '../components/AdminInput';
import AdminSelect from '../components/AdminSelect';
import AdminTextarea from '../components/AdminTextarea';
import AdminToggle from '../components/AdminToggle';
import ImageInput from '../components/ImageInput';
import ConfirmDialog from '../components/ConfirmDialog';
import AdminPagination from '../components/AdminPagination';
import StickyActionBar from '../components/StickyActionBar';
import { useToast } from '../context/ToastContext';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Edit3, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  X, 
  ArrowUpDown, 
  RefreshCw, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { resolveImageUrl } from '../../services/imageService';

const INITIAL_PRODUCT_STATE = {
  name: '',
  slug: '',
  category: 'wigs',
  price: '',
  originalPrice: '',
  shortDescription: '',
  description: '',
  images: [],
  active: true,
  featured: false,
  inStock: true,
  badge: '',
  sku: '',
  seoTitle: '',
  seoDescription: ''
};

export default function ProductsView() {
  const toast = useToast();

  // Catalog State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Form / Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = creating new
  const [formData, setFormData] = useState(INITIAL_PRODUCT_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, product: null, isBulk: false });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Categories for dropdown
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  // Fetch Products
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sort: sortBy
      });
      if (search.trim()) params.append('search', search.trim());
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('active', statusFilter === 'active' ? 'true' : 'false');

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotalCount(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load products from server.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, categoryFilter, statusFilter, sortBy, toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Bulk selection toggles
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Quick Inline Toggle (Active, Featured)
  const handleQuickToggle = async (product, field) => {
    const updatedVal = !product[field];
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product._id,
          [field]: updatedVal
        })
      });

      if (res.ok) {
        setProducts(prev => prev.map(p => p._id === product._id ? { ...p, [field]: updatedVal } : p));
        toast.success(`Product ${field === 'active' ? (updatedVal ? 'activated' : 'hidden') : 'updated'}.`);
      } else {
        toast.error('Failed to update product state.');
      }
    } catch {
      toast.error('Network error updating product.');
    }
  };

  // Open Add Product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(INITIAL_PRODUCT_STATE);
    setFormErrors({});
    setIsDirty(false);
    setIsEditorOpen(true);
  };

  // Open Edit Product
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || 'wigs',
      price: product.price ?? '',
      originalPrice: product.originalPrice ?? '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      images: Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []),
      active: product.active !== false,
      featured: Boolean(product.featured),
      inStock: product.inStock !== false,
      badge: product.badge || '',
      sku: product.sku || '',
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || ''
    });
    setFormErrors({});
    setIsDirty(false);
    setIsEditorOpen(true);
  };

  // Duplicate Product
  const handleDuplicate = async (product) => {
    try {
      const clone = {
        name: `${product.name} (Copy)`,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        shortDescription: product.shortDescription,
        description: product.description,
        images: product.images,
        active: false, // Start copies as inactive for safety
        featured: false,
        inStock: product.inStock,
        badge: product.badge,
        sku: product.sku ? `${product.sku}-COPY` : ''
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clone)
      });

      if (res.ok) {
        toast.success('Product duplicated successfully.');
        loadProducts();
      } else {
        toast.error('Failed to duplicate product.');
      }
    } catch {
      toast.error('Network error during duplication.');
    }
  };

  // Auto-generate slug when name changes in new product mode
  const handleNameChange = (newName) => {
    setFormData(prev => {
      const isAutoSlugAllowed = !editingProduct || prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const nextSlug = isAutoSlugAllowed
        ? newName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : prev.slug;
      return {
        ...prev,
        name: newName,
        slug: nextSlug
      };
    });
    setIsDirty(true);
  };

  // Form Field Change
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (formErrors[field]) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFormErrors({});

    try {
      const isUpdate = Boolean(editingProduct);
      const payload = {
        ...(isUpdate ? { id: editingProduct._id } : {}),
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        shortDescription: formData.shortDescription?.trim(),
        description: formData.description?.trim(),
        images: formData.images,
        active: formData.active,
        featured: formData.featured,
        inStock: formData.inStock,
        badge: formData.badge?.trim(),
        sku: formData.sku?.trim(),
        seoTitle: formData.seoTitle?.trim(),
        seoDescription: formData.seoDescription?.trim()
      };

      const res = await fetch('/api/products', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(isUpdate ? 'Product updated successfully.' : 'Product created successfully.');
        setIsEditorOpen(false);
        setIsDirty(false);
        loadProducts();
      } else {
        // Map server Zod errors to form fields
        if (data.details) {
          const mapped = {};
          data.details.forEach(issue => {
            const field = issue.path?.[0] || 'general';
            mapped[field] = issue.message;
          });
          setFormErrors(mapped);
          toast.error(data.error || 'Please correct the highlighted fields.');
        } else {
          toast.error(data.error || 'Failed to save product.');
        }
      }
    } catch (err) {
      toast.error('Network error saving product.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Action Confirmations
  const confirmDeleteSingle = (product) => {
    setDeleteConfirm({
      isOpen: true,
      product,
      isBulk: false
    });
  };

  const confirmDeleteBulk = () => {
    if (selectedIds.length === 0) return;
    setDeleteConfirm({
      isOpen: true,
      product: null,
      isBulk: true
    });
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteConfirm.isBulk) {
        const res = await fetch('/api/products', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds })
        });
        if (res.ok) {
          toast.success(`Deleted ${selectedIds.length} products.`);
          setSelectedIds([]);
          loadProducts();
        } else {
          toast.error('Failed to delete selected products.');
        }
      } else if (deleteConfirm.product) {
        const res = await fetch(`/api/products?id=${deleteConfirm.product._id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          toast.success(`"${deleteConfirm.product.name}" deleted.`);
          loadProducts();
        } else {
          toast.error('Failed to delete product.');
        }
      }
    } catch {
      toast.error('Network error during deletion.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, product: null, isBulk: false });
    }
  };

  // Bulk Activate/Deactivate
  const handleBulkStatusChange = async (active) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          action: active ? 'activate' : 'deactivate'
        })
      });
      if (res.ok) {
        toast.success(`Updated status for ${selectedIds.length} products.`);
        setSelectedIds([]);
        loadProducts();
      } else {
        toast.error('Failed to update products.');
      }
    } catch {
      toast.error('Network error executing bulk status change.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <AdminPageHeader
        title="Products Catalog"
        description="Add, edit, organize prices, images, and categories for the Looks Forever catalog."
        action={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={loadProducts}
              disabled={isLoading}
            >
              Refresh
            </AdminButton>
            <AdminButton
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleOpenAdd}
            >
              Add Product
            </AdminButton>
          </div>
        }
      />

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, SKU or keyword..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-52">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 pl-3 pr-8 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id || c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-40">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 pl-3 pr-8 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Hidden Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full md:w-44">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 pl-3 pr-8 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>

        </div>

        {/* Bulk Action Bar (when rows are selected) */}
        {selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-brand-50/50 p-2.5 rounded-lg border border-brand-100 animate-in fade-in">
            <div className="text-xs font-semibold text-brand-900">
              {selectedIds.length} product{selectedIds.length === 1 ? '' : 's'} selected
            </div>
            <div className="flex items-center gap-2">
              <AdminButton
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusChange(true)}
              >
                Set Active
              </AdminButton>
              <AdminButton
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusChange(false)}
              >
                Set Inactive
              </AdminButton>
              <AdminButton
                size="sm"
                variant="danger"
                icon={Trash2}
                onClick={confirmDeleteBulk}
              >
                Delete Selected
              </AdminButton>
            </div>
          </div>
        )}
      </div>

      {/* Catalog Table (Desktop) / Cards (Mobile) */}
      <AdminCard noPadding>
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
            <p className="text-xs">Loading products catalog...</p>
          </div>
        ) : products.length > 0 ? (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === products.length && products.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                    </th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Featured</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {products.map((p) => {
                    const isSelected = selectedIds.includes(p._id);
                    const primaryImage = (Array.isArray(p.images) && p.images[0]) || p.images || '/brand/logo-cropped.png';

                    return (
                      <tr 
                        key={p._id} 
                        className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-brand-50/30' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(p._id)}
                            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                        </td>

                        {/* Image + Name + SKU */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                              <img
                                src={resolveImageUrl(primaryImage)}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/brand/logo-cropped.png';
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 text-sm truncate max-w-xs">{p.name}</div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>SKU: {p.sku || p.id || 'N/A'}</span>
                                {p.badge && (
                                  <span className="text-brand-600 font-medium bg-brand-50 px-1.5 py-0.2 rounded text-[10px]">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <AdminBadge variant="default">
                            {p.category}
                          </AdminBadge>
                        </td>

                        {/* Price */}
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">₹{p.price?.toLocaleString()}</div>
                          {p.originalPrice && (
                            <div className="text-[11px] text-slate-400 line-through">₹{p.originalPrice?.toLocaleString()}</div>
                          )}
                        </td>

                        {/* Featured Toggle */}
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleQuickToggle(p, 'featured')}
                            title={p.featured ? 'Remove from Featured' : 'Mark as Featured'}
                            className={`p-1.5 rounded-lg transition ${
                              p.featured ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${p.featured ? 'fill-current' : ''}`} />
                          </button>
                        </td>

                        {/* Status Toggle */}
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleQuickToggle(p, 'active')}
                            title={p.active ? 'Click to hide from store' : 'Click to make visible'}
                          >
                            <AdminBadge 
                              variant={p.active ? 'success' : 'default'} 
                              dot
                            >
                              {p.active ? 'Active' : 'Hidden'}
                            </AdminBadge>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              title="Edit product"
                              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(p)}
                              title="Duplicate as copy"
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => confirmDeleteSingle(p)}
                              title="Delete product"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {products.map((p) => {
                const isSelected = selectedIds.includes(p._id);
                const primaryImage = (Array.isArray(p.images) && p.images[0]) || p.images || '/brand/logo-cropped.png';

                return (
                  <div key={p._id} className={`p-4 space-y-3 ${isSelected ? 'bg-brand-50/30' : ''}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(p._id)}
                        className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <img
                          src={resolveImageUrl(primaryImage)}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/brand/logo-cropped.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 text-sm leading-tight">{p.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <AdminBadge variant="default" size="xs">
                            {p.category}
                          </AdminBadge>
                          <span className="font-bold text-slate-900 text-xs">₹{p.price?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickToggle(p, 'active')}
                        >
                          <AdminBadge variant={p.active ? 'success' : 'default'} dot size="xs">
                            {p.active ? 'Active' : 'Hidden'}
                          </AdminBadge>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickToggle(p, 'featured')}
                          className={`p-1 rounded ${p.featured ? 'text-amber-500' : 'text-slate-300'}`}
                        >
                          <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <AdminButton
                          size="sm"
                          variant="outline"
                          icon={Edit3}
                          onClick={() => handleOpenEdit(p)}
                        >
                          Edit
                        </AdminButton>
                        <button
                          type="button"
                          onClick={() => confirmDeleteSingle(p)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              pageSize={12}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No products match your current search and filter settings. Try clearing the filter or add a new product.
            </p>
            <AdminButton
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleOpenAdd}
            >
              Add First Product
            </AdminButton>
          </div>
        )}
      </AdminCard>

      {/* Product Add / Edit Modal Drawer */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="w-full max-w-3xl bg-white min-h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingProduct ? `Updating SKU ${editingProduct.sku || editingProduct.id || ''}` : 'Configure product information, pricing, images and SEO'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveProduct} className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto">
              
              {/* Card 1: Basic Information */}
              <AdminCard title="Basic Information" description="Product title, category and descriptions">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <AdminInput
                      label="Product Name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Mirage Men Hair Patch 100% Remy Human Hair"
                      error={formErrors.name}
                    />
                  </div>

                  <div>
                    <AdminSelect
                      label="Category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      options={categories.length > 0 ? categories.map(c => ({ value: c.slug, label: c.name })) : [
                        { value: 'wigs', label: 'Hair Wigs' },
                        { value: 'patches', label: 'Hair Patches' },
                        { value: 'extensions', label: 'Hair Extensions' },
                        { value: 'accessories', label: 'Accessories & Tapes' }
                      ]}
                      error={formErrors.category}
                    />
                  </div>

                  <div>
                    <AdminInput
                      label="Badge / Tag (Optional)"
                      name="badge"
                      value={formData.badge}
                      onChange={(e) => handleFieldChange('badge', e.target.value)}
                      placeholder="e.g. Best Seller, Top Rated, New"
                      helperText="Pill shown on product card thumbnail"
                      error={formErrors.badge}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <AdminInput
                      label="Short Tagline / Subtitle"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                      placeholder="e.g. Invisible lace base, natural front hairline, ultra breathable"
                      error={formErrors.shortDescription}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <AdminTextarea
                      label="Detailed Product Description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      placeholder="Provide detailed material description, size specs, maintenance instructions..."
                      error={formErrors.description}
                    />
                  </div>
                </div>
              </AdminCard>

              {/* Card 2: Pricing & Inventory */}
              <AdminCard title="Pricing & Inventory" description="Selling price, MRP and stock tracking">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <AdminInput
                      label="Selling Price (₹)"
                      name="price"
                      type="number"
                      required
                      prefix="₹"
                      value={formData.price}
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      placeholder="18500"
                      error={formErrors.price}
                    />
                  </div>

                  <div>
                    <AdminInput
                      label="Original MRP (₹, Optional)"
                      name="originalPrice"
                      type="number"
                      prefix="₹"
                      value={formData.originalPrice}
                      onChange={(e) => handleFieldChange('originalPrice', e.target.value)}
                      placeholder="26000"
                      helperText="Strikes through to display savings"
                      error={formErrors.originalPrice}
                    />
                  </div>

                  <div>
                    <AdminInput
                      label="SKU / Item Code"
                      name="sku"
                      value={formData.sku}
                      onChange={(e) => handleFieldChange('sku', e.target.value)}
                      placeholder="LF-MIR-01"
                      error={formErrors.sku}
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <AdminToggle
                      label="In Stock & Ready for Delivery"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={(val) => handleFieldChange('inStock', val)}
                      helperText="If disabled, shows Out of Stock badge"
                    />
                  </div>
                </div>
              </AdminCard>

              {/* Card 3: Product Images (Unified ImageInput) */}
              <AdminCard title="Product Gallery" description="Add image URLs with live preview. Reorder or mark primary.">
                <ImageInput
                  label="Images"
                  multiple={true}
                  images={formData.images}
                  onChange={(imgs) => handleFieldChange('images', imgs)}
                  error={formErrors.images}
                />
              </AdminCard>

              {/* Card 4: Visibility & Promotion */}
              <AdminCard title="Visibility & Promotions" description="Configure active status and homepage highlights">
                <div className="space-y-4">
                  <AdminToggle
                    label="Active & Visible in Public Store"
                    name="active"
                    checked={formData.active}
                    onChange={(val) => handleFieldChange('active', val)}
                    helperText="When enabled, this product is live on the public website and included in WhatsApp ordering."
                  />

                  <div className="pt-3 border-t border-slate-100">
                    <AdminToggle
                      label="Featured Product on Homepage"
                      name="featured"
                      checked={formData.featured}
                      onChange={(val) => handleFieldChange('featured', val)}
                      helperText="Highlight this product on the main storefront homepage section."
                    />
                  </div>
                </div>
              </AdminCard>

              {/* Card 5: SEO & URL Slug */}
              <AdminCard title="Search Engine Optimization" description="Customize search engine indexing and clean URL slug">
                <div className="space-y-4">
                  <AdminInput
                    label="URL Slug"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) => handleFieldChange('slug', e.target.value)}
                    prefix="/product/"
                    helperText="Unique permanent link for this product"
                    error={formErrors.slug}
                  />

                  <AdminInput
                    label="Custom Meta Title (Optional)"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => handleFieldChange('seoTitle', e.target.value)}
                    placeholder="Looks Forever - Mirage Hair Patch Noida"
                    error={formErrors.seoTitle}
                  />

                  <AdminTextarea
                    label="Custom Meta Description (Optional)"
                    name="seoDescription"
                    rows={2}
                    value={formData.seoDescription}
                    onChange={(e) => handleFieldChange('seoDescription', e.target.value)}
                    placeholder="Short SEO summary for Google search result snippets..."
                    error={formErrors.seoDescription}
                  />
                </div>
              </AdminCard>

              {/* Sticky Action Footer */}
              <StickyActionBar
                onCancel={() => setIsEditorOpen(false)}
                onSave={handleSaveProduct}
                isSaving={isSaving}
                isDirty={isDirty}
                saveText={editingProduct ? 'Save Product Changes' : 'Create Product'}
              />

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.isBulk ? 'Delete Selected Products' : 'Delete Product'}
        message={
          deleteConfirm.isBulk
            ? `Are you sure you want to permanently delete ${selectedIds.length} products? This cannot be undone.`
            : `Are you sure you want to permanently delete "${deleteConfirm.product?.name}"?`
        }
        confirmText="Delete Permanently"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, product: null, isBulk: false })}
      />

    </div>
  );
}

