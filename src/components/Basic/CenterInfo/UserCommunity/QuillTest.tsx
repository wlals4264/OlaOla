import React, { RefObject, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const formats = ['font', 'header', 'bold', 'italic', 'strike', 'indent', 'link', 'color', 'h1', 'h2', 'h3', 'image'];

const QuillEditor = () => {
  const [values, setValues] = useState<any>();

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [
            'bold',
            'italic',
            'strike',
            {
              color: [],
            },
          ],
          ['link', 'image'],
          [{ header: [1, 2, 3, false] }],
        ],
      },
    };
  }, []);

  console.log(values);

  return <ReactQuill theme="snow" modules={modules} formats={formats} onChange={setValues} />;
};

export default QuillEditor;
