import React, { useMemo, useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css';
import { saveImageToIndexedDB, getImageFromIndexedDB } from '../../../../utils/indexedDB';

const formats = ['font', 'header', 'bold', 'italic', 'strike', 'indent', 'link', 'color', 'image', 'align'];

const QuillEditor = () => {
  const [editorValue, setEditorValue] = useState('');
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ['bold', 'italic', 'strike', { color: [] }],
          ['link', 'image'],
          [{ align: [] }],
          [{ header: 1 }, { header: 2 }, { header: 3 }],
        ],
        handlers: {
          // 클릭 이벤트 중복 호출 방지
          image: () => fileInputRef.current?.click(),
        },
      },
    };
  }, []);

  // 이미지 sanitize 함수 설정
  const Image = ReactQuill.Quill.import('formats/image');
  Image.sanitize = (url: string) => {
    if (url.startsWith('blob:')) {
      return url;
    }
    return '';
  };

  const handleImageUpload = async () => {
    if (!fileInputRef.current || !quillRef.current) return;

    const file = fileInputRef.current.files?.[0];
    // 초기화 코드(중복 업로드 방지)
    fileInputRef.current.value = '';

    if (file) {
      try {
        const imageId = await saveImageToIndexedDB(file);
        const savedImage = await getImageFromIndexedDB(imageId);

        if (savedImage instanceof Blob) {
          const blobUrl = URL.createObjectURL(savedImage);
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          if (range) {
            editor.insertEmbed(range.index, 'image', blobUrl);
            editor.setSelection(range.index + 1);
          }
        }
      } catch (error) {
        console.error('이미지 처리 오류:', error);
      }
    }
  };

  console.log('Editor Value:', editorValue);

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        value={editorValue}
        formats={formats}
        onChange={setEditorValue}
        modules={modules}
        theme="snow"
        style={{ height: '360px' }}
      />
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};

export default QuillEditor;
