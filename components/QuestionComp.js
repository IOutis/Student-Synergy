import React, { useState, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, FontColor, Highlight, FontSize, Font, OrderedList, BulletedList, Indent, Outdent, List, TodoList, AutoImage, Autosave, ListView, SimpleUploadAdapter, ImageResize ,ImageStyle, ImageToolbar,FileUploader} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useSession } from 'next-auth/react';
import LoadingComp from '../components/LoadingComp'
import { useEffect } from 'react';
function CustomEditor({ initialContent, onContentChange }) {
    const editorRef = useRef(null);
    const [files, setFiles] = useState([null]);
    const [loadingState,setLoadingState] = useState(false);


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (editorRef.current) {
    //         const content = editorRef.current.getData();
    
    //         // Prepare the form data
    //         const formData = new FormData();
    //         formData.append('content', content);
            
    //         try {
    //             setLoadingState(true);
    //             const res = await fetch('/api/editor', {
    //                 method: 'POST',
    //                 body: formData,
    //             });
    
    //             if (!res.ok) {
    //                 alert(`Server error: ${res.statusText}. Make sure you are NOT saving empty content`);
    //             }
    
    //             const result = await res.json();
    //             // console.log(result);
    //             const noteId = result._id

    //             for (let i = 0; i < files.length; i++) {
    //                 if (files[i]) {
    //                     const fileFormData = new FormData();
    //                     fileFormData.append('file', files[i]);
    //                     fileFormData.append('noteId', noteId);

    //                     const fileRes = await fetch('/api/upload_file', {
    //                         method: 'POST',
    //                         body: fileFormData,
    //                     });

    //                     if (!fileRes.ok) {
    //                         throw new Error(`File upload error: ${fileRes.statusText}`);
    //                     }
    //                 }
    //             }

    //             setLoadingState(false);
    //             window.location.reload(); // Consider updating UI state instead
    //         } catch (error) {
    //             alert("Error submitting editor content:", error.message);
    //             // Inform the user about the error
    //         }
    //     }
    // };
    

    const handleContentChange = (event, editor) => {
        const data = editor.getData();
        console.log("Data : ",data)
        onContentChange(data); // Pass the content back to the parent
    };

    return (
        <div className='mt-3'>
            {loadingState && <LoadingComp></LoadingComp>}
            {/* <button onClick={()=>{handleTemplate('journal')}}>Journal Template</button> */}
            
                <CKEditor
                    editor={ClassicEditor}
                    onReady={editor => {
                        editorRef.current = editor;
                    }}
                    data={initialContent}
                    onChange={handleContentChange}
                    config={{
                        plugins: [
                            Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, Highlight, ListView, List, TodoList, AutoImage, SimpleUploadAdapter,ImageResize,ImageStyle,ImageToolbar,FontSize,
                        ],
                        toolbar: {
                            items: [
                                'undo', 'redo','cut',
                                '|',
                                'heading',
                                '|',
                                'fontfamily','fontSize',
                                '|',
                                'bold', 'highlight', 'italic', 'strikethrough', 'subscript', 'superscript', 'underline', 'alignment',
                                '|',
                                'link', 'uploadImage', 'blockQuote', 'codeBlock',
                                '|',
                                'bulletedList', 'numberedList', 'todoList', 
                                '|',
                                'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells',
                            ]
                        },
                        mention: {
                            // Mention configuration
                            editorConfig: {
                                content: {
                                    styles: {
                                        'body': {
                                            color: 'red',
                                            'font-family': 'Arial, sans-serif',
                                            'font-size': '16px'
                                        }
                                    }
                                }
                            }
                        },
                        simpleUpload: {
                            // The URL that the images are uploaded to.
                            uploadUrl: '/api/upload',
                
                            // Enable the XMLHttpRequest.withCredentials property.
                            withCredentials: true,
                
                            // Headers sent along with the XMLHttpRequest to the upload server.
                            headers: {
                                'X-CSRF-TOKEN': 'CSRF-Token',
                                Authorization: 'Bearer <JSON Web Token>'
                            }
                        },
                        image: {
                            toolbar: [  'imageTextAlternative',  'imageStyle:side', 'imageStyle:alignLeft' ,'imageStyle:block']
                        }
                        
                    }}
                />
                {/* <button type="submit">Save</button> */}
                

                {/* <button type="submit" class="mt-[3vh] focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Save</button> */}
            
        </div>
    );
}

export default CustomEditor;
