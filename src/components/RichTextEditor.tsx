"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useCallback } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Unlink
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent underline hover:text-accent/80',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount.characters();
  const characterLimit = 10000; // Default limit

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('bold') ? 'bg-accent text-white' : 'text-gray-600'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('italic') ? 'bg-accent text-white' : 'text-gray-600'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('strike') ? 'bg-accent text-white' : 'text-gray-600'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('code') ? 'bg-accent text-white' : 'text-gray-600'
            }`}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-accent text-white' : 'text-gray-600'
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-accent text-white' : 'text-gray-600'
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-accent text-white' : 'text-gray-600'
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('bulletList') ? 'bg-accent text-white' : 'text-gray-600'
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('orderedList') ? 'bg-accent text-white' : 'text-gray-600'
            }`}
            title="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('blockquote') ? 'bg-accent text-white' : 'text-gray-600'
            }`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={setLink}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('link') ? 'bg-accent text-white' : 'text-gray-600'
            }`}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive('link')}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.isActive('link') ? 'text-gray-600' : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Remove Link"
          >
            <Unlink className="w-4 h-4" />
          </button>
          <button
            onClick={addImage}
            className="p-2 rounded-lg hover:bg-white transition-colors text-gray-600"
            title="Add Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.can().undo() ? 'text-gray-600' : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`p-2 rounded-lg hover:bg-white transition-colors ${
              editor.can().redo() ? 'text-gray-600' : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[300px]" />

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center text-sm text-gray-600">
        <div>
          {characterLimit && (
            <span className={characterCount > characterLimit * 0.9 ? 'text-red-600' : ''}>
              {characterCount}/{characterLimit} characters
            </span>
          )}
        </div>
        <div className="flex gap-4">
          <span>Auto-saved</span>
        </div>
      </div>
    </div>
  );
}