import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Code, 
  Eye, 
  Undo,
  AlertCircle
} from 'lucide-react';

export default function RichTextEditor({
  label = 'Content',
  value = '',
  onChange,
  required = false,
  error,
  helperText = 'Rich text format with standard HTML headings, lists, and links.',
  placeholder = 'Write blog content here...',
  className = ''
}) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef(null);

  // Formatting helpers that wrap selected text with markdown/HTML tags
  const applyTag = (openTag, closeTag, defaultText = 'text') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const current = el.value || '';
    const selected = current.substring(start, end) || defaultText;

    const replacement = `${openTag}${selected}${closeTag}`;
    const nextValue = current.substring(0, start) + replacement + current.substring(end);

    onChange(nextValue);

    // Reposition cursor
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('Enter URL (https://...):');
    if (!url) return;
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const current = el.value || '';
    const selected = current.substring(start, end) || 'link text';

    const replacement = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selected}</a>`;
    const nextValue = current.substring(0, start) + replacement + current.substring(end);

    onChange(nextValue);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            {label}
            {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </label>
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
          >
            {isPreview ? (
              <>
                <Code className="w-3.5 h-3.5" /> Edit HTML
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Preview
              </>
            )}
          </button>
        </div>
      )}

      {/* Toolbar */}
      {!isPreview && (
        <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100/90 border border-slate-300 rounded-t-lg text-slate-700">
          <button
            type="button"
            title="Bold"
            onClick={() => applyTag('<strong>', '</strong>', 'bold text')}
            className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition text-xs font-bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={() => applyTag('<em>', '</em>', 'italic text')}
            className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition text-xs"
          >
            <Italic className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-300 mx-1"></span>

          <button
            type="button"
            title="Heading 2"
            onClick={() => applyTag('<h2>', '</h2>', 'Heading')}
            className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition text-xs font-semibold"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => applyTag('<h3>', '</h3>', 'Subheading')}
            className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition text-xs font-semibold"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-300 mx-1"></span>

          <button
            type="button"
            title="Bullet List"
            onClick={() => applyTag('<ul>\n  <li>', '</li>\n</ul>', 'List item')}
            className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition text-xs"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => applyTag('<ol>\n  <li>', '</li>\n</ol>', 'Step 1')}
            className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition text-xs"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Quote"
            onClick={() => applyTag('<blockquote>', '</blockquote>', 'Quote text')}
            className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition text-xs"
          >
            <Quote className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-300 mx-1"></span>

          <button
            type="button"
            title="Insert Link"
            onClick={insertLink}
            className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition text-xs"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Body / Preview */}
      {isPreview ? (
        <div 
          className="min-h-[220px] p-4 bg-white border border-slate-300 rounded-lg prose prose-sm max-w-none prose-slate"
          dangerouslySetInnerHTML={{ __html: value || '<p className="text-slate-400 italic">No content to preview</p>' }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={10}
          className={`block w-full text-sm font-mono border border-slate-300 p-3.5 transition-all bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            ${error ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}
            rounded-b-lg border-t-0
          `}
        />
      )}

      {error ? (
        <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}

