import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import AdminBadge from '../components/AdminBadge';
import AdminInput from '../components/AdminInput';
import AdminTextarea from '../components/AdminTextarea';
import ImageInput from '../components/ImageInput';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { 
  FolderTree, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  X, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { resolveImageUrl } from '../../services/imageService';

const INITIAL_CATEGORY_STATE = {
  name: '',
  slug: '',
  description: '',
  image: '',
  order: 0,
  active: true
};

export default function CategoriesView() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(INITIAL_CATEGORY_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, category: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error('Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData(INITIAL_CATEGORY_STATE);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
      order: cat.order || 0,
      active: cat.active !== false
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleNameChange = (name) => {
    setFormData(prev => {
      const autoSlug = !editingCategory || prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const nextSlug = autoSlug
        ? name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : prev.slug;
      return { ...prev, name, slug: nextSlug };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFormErrors({});

    try {
      const isUpdate = Boolean(editingCategory);
      const payload = {
        ...(isUpdate ? { id: editingCategory._id } : {}),
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description?.trim(),
        image: formData.image?.trim(),
        order: parseInt(formData.order) || 0,
        active: formData.active
      };

      const res = await fetch('/api/categories', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(isUpdate ? 'Category updated successfully.' : 'Category created successfully.');
        setIsModalOpen(false);
        loadCategories();
      } else {
        if (data.details) {
          const mapped = {};
          data.details.forEach(issue => {
            const field = issue.path?.[0] || 'general';
            mapped[field] = issue.message;
          });
          setFormErrors(mapped);
          toast.error(data.error || 'Please check highlighted fields.');
        } else {
          toast.error(data.error || 'Failed to save category.');
        }
      }
    } catch {
      toast.error('Network error saving category.');
    } finally {
      setIsSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirm.category) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/categories?id=${deleteConfirm.category._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success(`Category "${deleteConfirm.category.name}" deleted.`);
        loadCategories();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete category.');
      }
    } catch {
      toast.error('Network error during category deletion.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, category: null });
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Product Categories"
        description="Organize your hair systems, wigs, and clinic service categories."
        action={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={loadCategories}
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
              Add Category
            </AdminButton>
          </div>
        }
      />

      <AdminCard noPadding>
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
            <p className="text-xs">Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <div 
                key={cat._id} 
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {cat.image ? (
                      <img 
                        src={resolveImageUrl(cat.image)} 
                        alt={cat.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/brand/logo-cropped.png';
                        }}
                      />
                    ) : (
                      <FolderTree className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 text-sm">{cat.name}</h4>
                      <AdminBadge variant={cat.active ? 'success' : 'default'} size="xs" dot>
                        {cat.active ? 'Active' : 'Hidden'}
                      </AdminBadge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                      {cat.description || 'No description provided'}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>Slug: <code className="text-slate-600">/{cat.slug}</code></span>
                      <span>• Order: {cat.order}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                    title="Edit category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm({ isOpen: true, category: cat })}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <FolderTree className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No categories found.</p>
            <AdminButton size="sm" icon={Plus} onClick={handleOpenAdd}>
              Create First Category
            </AdminButton>
          </div>
        )}
      </AdminCard>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
              <AdminInput
                label="Category Name"
                name="name"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Gents Hair Patches"
                error={formErrors.name}
              />

              <AdminInput
                label="URL Slug"
                name="slug"
                required
                value={formData.slug}
                onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                placeholder="gents-hair-patches"
                error={formErrors.slug}
              />

              <AdminTextarea
                label="Description"
                name="description"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Brief description for category listings and SEO..."
                error={formErrors.description}
              />

              <ImageInput
                label="Category Thumbnail / Banner"
                multiple={false}
                images={formData.image}
                onChange={(img) => setFormData(p => ({ ...p, image: img }))}
                error={formErrors.image}
              />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <AdminInput
                  label="Display Order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(p => ({ ...p, order: e.target.value }))}
                  helperText="Lower numbers appear first"
                />

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData(p => ({ ...p, active: e.target.checked }))}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>Active on site</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <AdminButton
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteConfirm.category?.name}"? Any products assigned to this category will remain, but will need reassignment.`}
        confirmText="Delete Category"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, category: null })}
      />
    </div>
  );
}

