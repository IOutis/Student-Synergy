import dynamic from 'next/dynamic';

const CKEditor = dynamic(
  () => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor),
  { ssr: false }
);

const ClassicEditor = dynamic(
  () => import('@ckeditor/ckeditor5-build-classic'),
  { ssr: false }
);

const CKEditorWrapper = ({ data, onChange }) => (
  <CKEditor
    editor={ClassicEditor}
    data={data}
    onReady={(editor) => {
      console.log('Editor is ready to use!', editor);
    }}
    onChange={(event, editor) => {
      const data = editor.getData();
      onChange(data);
      console.log({ event, editor, data });
    }}
    onBlur={(event, editor) => {
      console.log('Blur.', editor);
    }}
    onFocus={(event, editor) => {
      console.log('Focus.', editor);
    }}
  />
);

export default CKEditorWrapper;
