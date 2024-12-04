import React, { useMemo, useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css';
import { saveImageToIndexedDB, getImageFromIndexedDB } from '../../../../utils/indexedDB';

const formats = ['font', 'header', 'bold', 'italic', 'strike', 'indent', 'link', 'color', 'image'];

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
          [{ header: 1 }, { header: 2 }],
        ],
        handlers: {
          image: () => handleImageClick(),
        },
      },
    };
  }, []);

  // 이미지 버튼 클릭 시 hidden input 실행
  const handleImageClick = () => {
    handleImageUpload(fileInputRef, quillRef);
    console.log('imgbutton click');
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (
    fileInputRef: React.RefObject<HTMLInputElement>,
    quillRef: React.RefObject<ReactQuill>
  ) => {
    if (!fileInputRef.current || !quillRef.current) {
      console.error('File input or Quill editor reference is missing');
      return;
    }

    const file = fileInputRef.current.files?.[0];
    console.log(file);

    if (file) {
      try {
        // IndexedDB에 이미지 저장
        const imageId = await saveImageToIndexedDB(file);
        console.log('imageId', imageId);

        // IndexedDB에서 이미지 가져오기
        const savedImage = await getImageFromIndexedDB(imageId);
        console.log('저장된 이미지:', savedImage);

        // Blob URL 생성
        if (savedImage instanceof Blob) {
          const blobUrl = URL.createObjectURL(savedImage);
          console.log('Generated Blob URL:', blobUrl);

          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          if (range) {
            console.log('Insert image at position:', range.index);
            editor.insertEmbed(range.index, 'image', blobUrl); // 이미지 삽입
            editor.setSelection(range.index + 1); // 커서 위치 설정
          }
        } else {
          console.error('저장된 이미지가 Blob이 아닙니다.');
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
      />
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageClick} />
    </div>
  );
};

export default QuillEditor;
