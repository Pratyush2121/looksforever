import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import AdminBadge from '../components/AdminBadge';
import AdminInput from '../components/AdminInput';
import AdminTextarea from '../components/AdminTextarea';
import AdminToggle from '../components/AdminToggle';
import ImageInput from '../components/ImageInput';
import RichTextEditor from '../components/RichTextEditor';
import ConfirmDialog from '../components/ConfirmDialog';
import StickyActionBar from '../components/StickyActionBar';
import { useToast } from '../context/ToastContext';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  X, 
  Calendar, 
  User, 
  Eye, 
  ExternalLink 
} from 'lucide-react';
import { resolveImageUrl } from '../../services/imageService';

const INITIAL_BLOG_STATE = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  author: 'Dr. Looks Forever Team',
  category: 'Hair Care & Maintenance',
  tags: '',
  published: true,
  seoTitle: '',
  seoDescription: ''
};

export default function BlogsView() {
  const toast = useToast();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Drawer / Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState(INITIAL_BLOG_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Delete State
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, blog: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || (Array.isArray(data) ? data : []));
      }
    } catch {
      toast.error('Failed to load blogs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setFormData(INITIAL_BLOG_STATE);
    setFormErrors({});
    setIsDirty(false);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      featuredImage: blog.featuredImage || '',
      author: blog.author || 'Dr. Looks Forever Team',
      category: blog.category || 'Hair Care & Maintenance',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
      published: blog.published !== false,
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || ''
    });
    setFormErrors({});
    setIsDirty(false);
    setIsEditorOpen(true);
  };

  const handleTitleChange = (title) => {
    setFormData(prev => {
      const autoSlug = !editingBlog || prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const nextSlug = autoSlug
        ? title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : prev.slug;
      return { ...prev, title, slug: nextSlug };
    });
    setIsDirty(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFormErrors({});

    try {
      const isUpdate = Boolean(editingBlog);
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const payload = {
        ...(isUpdate ? { id: editingBlog._id } : {}),
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt?.trim(),
        content: formData.content,
        featuredImage: formData.featuredImage?.trim(),
        author: formData.author?.trim(),
        category: formData.category?.trim(),
        tags: tagsArray,
        published: formData.published,
        seoTitle: formData.seoTitle?.trim(),
        seoDescription: formData.seoDescription?.trim()
      };

      const res = await fetch('/api/blogs', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(isUpdate ? 'Article updated successfully.' : 'Article published successfully.');
        setIsEditorOpen(false);
        setIsDirty(false);
        loadBlogs();
      } else {
        if (data.details) {
          const mapped = {};
          data.details.forEach(i => mapped[i.path?.[0] || 'general'] = i.message);
          setFormErrors(mapped);
          toast.error(data.error || 'Please correct highlighted errors.');
        } else {
          toast.error(data.error || 'Failed to save blog post.');
        }
      }
    } catch {
      toast.error('Network error saving article.');
    } finally {
      setIsSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirm.blog) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blogs?id=${deleteConfirm.blog._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success(`Article "${deleteConfirm.blog.title}" deleted.`);
        loadBlogs();
      } else {
        toast.error('Failed to delete blog.');
      }
    } catch {
      toast.error('Network error deleting article.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, blog: null });
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Clinical Guides & Blog Articles"
        description="Publish educational articles on hair patches, wig maintenance, and scalp health to boost SEO."
        action={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={loadBlogs}
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
              Write Article
            </AdminButton>
          </div>
        }
      />

      <AdminCard noPadding>
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
            <p className="text-xs">Loading articles...</p>
          </div>
        ) : blogs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {blogs.map((blog) => (
              <div 
                key={blog._id} 
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img
                      src={resolveImageUrl(blog.featuredImage)}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/brand/logo-cropped.png';
                      }}
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-slate-900 text-sm">{blog.title}</h4>
                      <AdminBadge variant={blog.published ? 'success' : 'default'} size="xs" dot>
                        {blog.published ? 'Published' : 'Draft'}
                      </AdminBadge>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                      {blog.excerpt || 'No summary excerpt provided.'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{blog.author || 'Team'}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(blog.createdAt || Date.now()).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span>Slug: /{blog.slug}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <AdminButton
                    size="sm"
                    variant="outline"
                    icon={Edit3}
                    onClick={() => handleOpenEdit(blog)}
                  >
                    Edit
                  </AdminButton>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm({ isOpen: true, blog })}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No blog articles published yet.</p>
            <AdminButton size="sm" icon={Plus} onClick={handleOpenAdd}>
              Create First Article
            </AdminButton>
          </div>
        )}
      </AdminCard>

      {/* Blog Editor Drawer */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="w-full max-w-4xl bg-white min-h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingBlog ? 'Edit Article' : 'Write New Clinical Article'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compose educational content with headings, lists, and formatted guides
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto">
              
              <AdminCard title="Article Overview" description="Title, author, category and URL slug">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <AdminInput
                      label="Article Title"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. How to Clean & Maintain Your Hair Patch in Summer"
                      error={formErrors.title}
                    />
                  </div>

                  <div>
                    <AdminInput
                      label="URL Slug"
                      required
                      value={formData.slug}
                      onChange={(e) => {
                        setFormData(p => ({ ...p, slug: e.target.value }));
                        setIsDirty(true);
                      }}
                      prefix="/blog/"
                      error={formErrors.slug}
                    />
                  </div>

                  <div>
                    <AdminInput
                      label="Author Name"
                      value={formData.author}
                      onChange={(e) => {
                        setFormData(p => ({ ...p, author: e.target.value }));
                        setIsDirty(true);
                      }}
                      placeholder="Dr. Looks Forever Team"
                    />
                  </div>

                  <div>
                    <AdminInput
                      label="Category"
                      value={formData.category}
                      onChange={(e) => {
                        setFormData(p => ({ ...p, category: e.target.value }));
                        setIsDirty(true);
                      }}
                      placeholder="Hair Care & Maintenance"
                    />
                  </div>

                  <div>
                    <AdminInput
                      label="Tags (comma-separated)"
                      value={formData.tags}
                      onChange={(e) => {
                        setFormData(p => ({ ...p, tags: e.target.value }));
                        setIsDirty(true);
                      }}
                      placeholder="hair patch, maintenance, swiss lace"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <AdminTextarea
                      label="Short Excerpt"
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) => {
                        setFormData(p => ({ ...p, excerpt: e.target.value }));
                        setIsDirty(true);
                      }}
                      placeholder="Brief teaser summary for article card..."
                    />
                  </div>
                </div>
              </AdminCard>

              <AdminCard title="Featured Cover Image" description="Banner image displayed on the blog list and header">
                <ImageInput
                  label="Featured Image"
                  multiple={false}
                  images={formData.featuredImage}
                  onChange={(img) => {
                    setFormData(p => ({ ...p, featuredImage: img }));
                    setIsDirty(true);
                  }}
                  helperText="Recommended size 1200x630 or 16:9 ratio"
                />
              </AdminCard>

              <AdminCard title="Article Body" description="Format with headings, lists, bold, and links">
                <RichTextEditor
                  label="Content"
                  value={formData.content}
                  onChange={(content) => {
                    setFormData(p => ({ ...p, content }));
                    setIsDirty(true);
                  }}
                  error={formErrors.content}
                />
              </AdminCard>

              <AdminCard title="Search Engine Optimization (SEO)" description="Page title and meta description for Google snippets">
                <div className="space-y-4">
                  <AdminInput
                    label="Meta Title (Optional)"
                    value={formData.seoTitle}
                    onChange={(e) => {
                      setFormData(p => ({ ...p, seoTitle: e.target.value }));
                      setIsDirty(true);
                    }}
                    placeholder="Looks Forever - Article Title"
                  />
                  <AdminTextarea
                    label="Meta Description (Optional)"
                    rows={2}
                    value={formData.seoDescription}
                    onChange={(e) => {
                      setFormData(p => ({ ...p, seoDescription: e.target.value }));
                      setIsDirty(true);
                    }}
                    placeholder="Search snippet summary..."
                  />
                  <div className="pt-2 border-t border-slate-100">
                    <AdminToggle
                      label="Publish Immediately"
                      checked={formData.published}
                      onChange={(val) => {
                        setFormData(p => ({ ...p, published: val }));
                        setIsDirty(true);
                      }}
                      helperText="If disabled, saved as draft and not visible to public visitors"
                    />
                  </div>
                </div>
              </AdminCard>

              <StickyActionBar
                onCancel={() => setIsEditorOpen(false)}
                onSave={handleSave}
                isSaving={isSaving}
                isDirty={isDirty}
                saveText={editingBlog ? 'Save Article' : 'Publish Article'}
              />

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Article"
        message={`Are you sure you want to permanently delete "${deleteConfirm.blog?.title}"?`}
        confirmText="Delete Article"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, blog: null })}
      />
    </div>
  );
}

