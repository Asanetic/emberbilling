'use client';
import { useRef , useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

export default function MosyHtmlEditor({value='', field="defname", onChange : handleChange }) {

  const editorRef = useRef(null);

  // ✅ Sync content from props to editor manually after first render
  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.setContents(value); // sets the HTML content
    }
  }, [value]);

  return (
    <SunEditor
     ref={editorRef}
     height='400px'
     name={field}
     id={field}
     defaultValue={value}
     onChange={handleChange}
      setOptions={{
        buttonList: [
          ['undo', 'redo'],
          ['formatBlock'],
          ['bold', 'underline', 'italic', 'strike'],
          ['font', 'fontSize'],
          ['fontColor', 'hiliteColor'],
          ['align', 'horizontalRule', 'list'],
          ['table'],
          ['link', 'image', 'video'],
          ['fullScreen', 'showBlocks', 'codeView'],
        ],
        font: ['Arial', 'Tahoma', 'Comic Sans MS', 'Courier New', 'Georgia'],
        defaultStyle: 'font-family: Arial; font-size: 16px;',
        imageUploadUrl: '/api/upload', // Optional if you want to handle uploads
      }}
    />
  );
}
