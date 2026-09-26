"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Minus
} from "lucide-react";

const ToolbarButton = ({
  onClick,
  isActive,
  disabled,
  "aria-label": ariaLabel,
  children
}: {
  onClick: () => void,
  isActive?: boolean,
  disabled?: boolean,
  "aria-label": string,
  children: React.ReactNode
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`w-10 h-10 rounded-md transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        ${isActive
          ? "bg-surface-dark-elevated text-on-dark border border-surface-dark-soft"
          : "text-on-dark-soft hover:bg-surface-dark-elevated hover:text-on-dark border border-transparent"}
        ${disabled ? "opacity-30 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  );
};

export default function TipTapEditor({ initialContent }: { initialContent: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: initialContent,
  })

  if (!editor) {
    return null
  }

  return (
    <div className="w-full flex flex-col bg-surface-dark rounded-xl overflow-hidden border border-surface-dark-elevated shadow-sm">

      {/* TOOLBAR */}
      <div className="bg-[#282623] border-b border-surface-dark-soft px-4 py-2.5 flex flex-wrap gap-1 sticky top-[112px] z-30">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} disabled={!editor.can().chain().focus().toggleBold().run()} aria-label="Format Text Bold">
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} disabled={!editor.can().chain().focus().toggleItalic().run()} aria-label="Format Text Italic">
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} disabled={!editor.can().chain().focus().toggleStrike().run()} aria-label="Format Text Strikethrough">
          <Strikethrough size={18} />
        </ToolbarButton>

        <div className="w-[1px] h-8 bg-surface-dark-soft mx-2 my-auto"></div>

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} aria-label="Heading 1">
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} aria-label="Heading 2">
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} aria-label="Heading 3">
          <Heading3 size={18} />
        </ToolbarButton>

        <div className="w-[1px] h-8 bg-surface-dark-soft mx-2 my-auto"></div>

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} aria-label="Bullet List">
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} aria-label="Numbered List">
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} aria-label="Blockquote">
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} aria-label="Horizontal Divider">
          <Minus size={18} />
        </ToolbarButton>

        <div className="w-[1px] h-8 bg-surface-dark-soft mx-2 my-auto"></div>

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} aria-label="Undo">
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} aria-label="Redo">
          <Redo size={18} />
        </ToolbarButton>
      </div>

      {/* EDITOR CONTENT */}
      <div className="p-8 md:p-12 min-h-[600px] bg-surface-dark">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
