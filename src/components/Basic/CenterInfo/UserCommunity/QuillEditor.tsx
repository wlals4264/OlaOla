import React, { useMemo, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid'; //
import { useRecoilState } from 'recoil';
import { editorValueState } from '../../../../datas/recoilData';
import { getImageItemListByPostId } from '../../../../utils/indexedDB';

// QuillEditor formats 정의
const formats = ['font', 'header', 'bold', 'italic', 'strike', 'indent', 'link', 'color', 'image', 'align'];

// interface FileWithId {
//   file: File;
//   imgId: string;
// }

interface QuillEditorProps {
  // fileList: FileWithId[];
  fileList: File[];
  // setFileList: React.Dispatch<React.SetStateAction<FileWithId[]>>;
  setFileList: React.Dispatch<React.SetStateAction<File[]>>;
  postId?: number;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ fileList, setFileList, postId }) => {
  const [editorValue, setEditorValue] = useRecoilState<string>(editorValueState);

  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 초기화 코드
  const resetEditor = () => {
    setEditorValue('');
    setFileList([]);
  };

  const imageHandler = () => {
    fileInputRef.current?.click();
  };

  // QuillEditor modules 설정, useMemo로 불필요한 렌더링 제거
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ['bold', 'italic', 'strike', { color: [] }],
          ['link', 'image'],
          [{ align: [] }],
          [{ header: 1 }, { header: 2 }, { header: 3 }],
        ],
        handlers: { image: imageHandler },
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

  // 이미지 미리보기
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
      const imgId = uuidv4();
      if (range) {
        editor.insertEmbed(range.index, 'image', blobUrl);
        editor.setSelection(range.index + 1);
        // DOM 직접 수정
        setTimeout(() => {
          const imgNode = editor.root.querySelector(`[src="${blobUrl}"]`);
          if (imgNode) {
            imgNode.setAttribute('data-img-id', String(imgId));
          }
        }, 10);
        setTimeout(() => {
          const imageNode = editor.root.querySelector(`[src="${blobUrl}"]`);
          console.log(imageNode?.outerHTML); // HTML 코드를 출력
          console.log(editor.getContents());
        }, 100);
      }
      // if (file) {
      //   const imgId = uuidv4();

      //   // 파일 목록 업데이트, imgId를 file 객체에 추가
      //   setFileList((prevFileList) => [
      //     ...prevFileList,
      //     { file: file, imgId: imgId }, // imgId와 함께 file 객체를 저장
      //   ]);

      //   console.log(fileList);

      //   // 에디터에 이미지 삽입
      //   const blobUrl = URL.createObjectURL(file);
      //   const editor = quillRef.current.getEditor();
      //   const range = editor.getSelection();

      //   if (range) {
      //     editor.insertEmbed(range.index, 'image', blobUrl);
      //     editor.setSelection(range.index + 1);

      //     // DOM 직접 수정
      //     setTimeout(() => {
      //       const imgNode = editor.root.querySelector(`[src="${blobUrl}"]`);
      //       if (imgNode) {
      //         imgNode.setAttribute('data-img-id', String(imgId));
      //       }
      //     }, 10);

      //     setTimeout(() => {
      //       const imageNode = editor.root.querySelector(`[src="${blobUrl}"]`);
      //       const updatedContent = editor.root.innerHTML;
      //       setEditorValue(updatedContent);
      //       console.log(imageNode?.outerHTML);
      //       console.log(editor.getContents());
      //     }, 100);
      //   }

      // 초기화
      fileInputRef.current.value = '';
      // URL.revokeObjectURL(blobUrl);
    }
  };

  // 이미지를 `postId`에 맞춰서 Quill 에디터에 추가
  useEffect(() => {
    const insertImagesFromPostId = async () => {
      try {
        const imageItems = await getImageItemListByPostId(Number(postId));
        const editor = quillRef.current?.getEditor();

        if (editor) {
          imageItems.forEach((imageItem, index) => {
            const imgId = imageItem.imgId;

            // image에 data-img-id를 명시적으로 추가
            const imageNode = editor.root.querySelectorAll('img')[index];

            setTimeout(() => {
              if (imageNode) {
                imageNode.setAttribute('data-img-id', String(imgId));
                console.log(editor.getContents());
              }
            }, 10);

            setTimeout(() => {
              const imageNode = editor.root.querySelectorAll('img')[index];
              console.log(imageNode?.outerHTML); // HTML 코드를 출력
              console.log(editor.getContents());
            }, 100);
          });
        }
      } catch (error) {
        console.error('이미지 가져오기 실패:', error);
      }
    };

    if (postId) {
      insertImagesFromPostId();
    }
  }, [postId]);

  // 첫 렌더링 시 초기화 함수 실행
  useEffect(() => {
    resetEditor();
  }, []);

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
