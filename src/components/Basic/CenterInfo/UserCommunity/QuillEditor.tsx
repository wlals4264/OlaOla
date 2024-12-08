import React, { useMemo, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css';
// import { saveImageToIndexedDB, getImageFromIndexedDB } from '../../../../utils/indexedDB';
import { useRecoilState } from 'recoil';
import { editorValueState } from '../../../../datas/recoilData';

const formats = ['font', 'header', 'bold', 'italic', 'strike', 'indent', 'link', 'color', 'image', 'align'];

interface QuillEditorProps {
  content: string;
  setContent: (content: string) => void;
  fileList: File[];
  setFileList: React.Dispatch<React.SetStateAction<File[]>>;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ content, setContent, fileList, setFileList }) => {
  const [editorValue, setEditorValue] = useRecoilState<string>(editorValueState);

  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 초기화 코드
  const resetEditor = () => {
    setEditorValue('');
    setFileList([]);
  };

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
  const Image: any = ReactQuill.Quill.import('formats/image');
  Image.sanitize = (url: string) => {
    if (url.startsWith('blob:')) {
      return url;
    }
    return '';
  };

  const handleImageUpload = async () => {
    if (!fileInputRef.current || !quillRef.current) return;

    const file = fileInputRef.current.files?.[0];

    if (file) {
      // 파일 목록 업데이트
      setFileList((prevFileList) => [...prevFileList, file]);

      // 에디터에 이미지 삽입
      const blobUrl = URL.createObjectURL(file);
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        editor.insertEmbed(range.index, 'image', blobUrl);
        editor.setSelection(range.index + 1);
      }

      // 초기화
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    resetEditor();
  }, []);

  console.log('Editor Value:', editorValue);

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        value={content ? content : editorValue}
        formats={formats}
        onChange={content ? setContent : setEditorValue}
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
