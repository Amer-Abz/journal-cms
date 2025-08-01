'use client';

import React, { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (data: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
  }, []);

  if (!CKEditor) {
    return <div>Loading Editor...</div>;
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
}
