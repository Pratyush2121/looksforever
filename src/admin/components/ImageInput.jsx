import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  ExternalLink,
  Check
} from 'lucide-react';
import { isValidImageUrl, resolveImageUrl } from '../../services/imageService';
import AdminButton from './AdminButton';

export default function ImageInput({
  label = 'Images',
  images = [],
  onChange,
  multiple = true,
  helperText = 'Paste direct image URL (PNG, JPG, WebP) or local /brand/ paths. The first image is the primary thumbnail.',
  required = false,
  error,
  className = ''
}) {
  const [urlInput, setUrlInput] = useState('');
  const [brokenUrls, setBrokenUrls] = useState({});
  const [inputError, setInputError] = useState(null);

  // Normalize images to array
  const imageList = Array.isArray(images) 
    ? images.filter(Boolean) 
    : (images ? [images] : []);

  const handleAdd = () => {
    setInputError(null);
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!isValidImageUrl(trimmed)) {
      setInputError('Please enter a valid HTTP/HTTPS URL or /public relative path.');
      return;
    }

    if (multiple) {
      if (imageList.includes(trimmed)) {
        setInputError('This image URL has already been added.');
        return;
      }
      onChange([...imageList, trimmed]);
    } else {
      onChange(trimmed);
    }
    setUrlInput('');
  };

  const handleRemove = (index) => {
    if (multiple) {
      const updated = imageList.filter((_, i) => i !== index);
      onChange(updated);
    } else {
      onChange('');
    }
  };

  const handleMakePrimary = (index) => {
    if (index === 0 || !multiple) return;
    const item = imageList[index];
    const rest = imageList.filter((_, i) => i !== index);
    onChange([item, ...rest]);
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= imageList.length) return;
    const nextList = [...imageList];
    const temp = nextList[index];
    nextList[index] = nextList[targetIndex];
    nextList[targetIndex] = temp;
    onChange(nextList);
  };

  const handleImageError = (url) => {
    setBrokenUrls(prev => ({ ...prev, [url]: true }));
  };

  const handleImageLoad = (url) => {
    if (brokenUrls[url]) {
      setBrokenUrls(prev => {
        const copy = { ...prev };
        delete copy[url];
        return copy;
      });
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 tracking-wide">
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
        {multiple && imageList.length > 0 && (
          <span className="text-xs text-slate-500 font-medium">
            {imageList.length} {imageList.length === 1 ? 'image' : 'images'}
          </span>
        )}
      </div>

      {/* Input row */}
      {(!multiple && imageList.length >= 1) ? null : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (inputError) setInputError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              placeholder="https://example.com/image.jpg or /brand/logo.png"
              className="w-full text-sm rounded-lg border border-slate-300 pl-9 pr-3.5 py-2.5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <AdminButton 
            type="button" 
            variant="secondary" 
            size="md"
            icon={Plus} 
            onClick={handleAdd}
          >
            Add
          </AdminButton>
        </div>
      )}

      {/* Local input error */}
      {inputError && (
        <p className="flex items-center gap-1 text-xs text-rose-600 font-medium animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{inputError}</span>
        </p>
      )}

      {/* Server/Prop error */}
      {error && (
        <p className="flex items-center gap-1 text-xs text-rose-600 font-medium animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* Image list / Preview cards */}
      {imageList.length > 0 ? (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1 max-w-sm'}`}>
          {imageList.map((url, idx) => {
            const isPrimary = idx === 0;
            const isBroken = Boolean(brokenUrls[url]);

            return (
              <div 
                key={`${url}-${idx}`}
                className={`relative group bg-slate-50 border rounded-xl overflow-hidden transition-all ${
                  isPrimary ? 'border-brand-500 ring-2 ring-brand-500/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Thumbnail Display */}
                <div className="aspect-4/3 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={resolveImageUrl(url)}
                    alt={`Preview ${idx + 1}`}
                    onError={() => handleImageError(url)}
                    onLoad={() => handleImageLoad(url)}
                    className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                      isBroken ? 'opacity-30' : 'opacity-100'
                    }`}
                  />

                  {/* Broken URL warning overlay */}
                  {isBroken && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-slate-900/80 text-white text-center">
                      <AlertCircle className="w-5 h-5 text-rose-400 mb-1" />
                      <span className="text-[11px] font-semibold text-rose-200">Broken Link</span>
                      <span className="text-[10px] text-slate-300 truncate max-w-full px-1">Check URL</span>
                    </div>
                  )}

                  {/* Primary Badge */}
                  {isPrimary && (
                    <div className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-amber-300" />
                      Primary
                    </div>
                  )}
                </div>

                {/* Info & Action Controls */}
                <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between gap-1 text-slate-500">
                  <div className="flex items-center gap-1">
                    {multiple && !isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleMakePrimary(idx)}
                        title="Make Primary Image"
                        className="p-1 hover:text-brand-600 hover:bg-brand-50 rounded transition text-slate-400"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {multiple && idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, -1)}
                        title="Move Left"
                        className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {multiple && idx < imageList.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 1)}
                        title="Move Right"
                        className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in new tab"
                      className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    title="Remove image"
                    className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded transition text-slate-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/50">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600">No images added yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Paste a URL above to add preview</p>
        </div>
      )}

      {helperText && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}

