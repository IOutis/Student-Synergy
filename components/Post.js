import React, { useState, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, Highlight, ListView, SimpleUploadAdapter, ImageResize, ImageStyle, ImageToolbar,List,TodoList,AutoImage } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useSession } from 'next-auth/react';

function CustomEditor({ private: isPrivate, id }) {
    const [editorData, setEditorData] = useState('');
    const [title, setTitle] = useState('');
    const [keywords, setKeywords] = useState('');
    const editorRef = useRef(null);
    const { data: session } = useSession();
    const [files, setFiles] = useState([null]);

    function saveData(data) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Saved', data);
                resolve();
            }, 1000);
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editorRef.current) {
            const content = editorRef.current.getData();
    
            const formData = new FormData();
            formData.append('content', content);
            formData.append('title', title);
            formData.append('user', session.user.name);
            formData.append('email', session.user.email);
            formData.append('keywords', keywords.split(','));

            if (isPrivate) {
                formData.append('isPrivate', true);
                if (id) {
                    formData.append('id', id);
                }

                for (let i = 0; i < files.length; i++) {
                    if (files[i]) {
                        formData.append('files', files[i]);
                    }
                }
            }
            
            try {
                const res = await fetch('/api/comm_post/post_content', {
                    method: 'POST',
                    body: formData,
                });
    
                if (!res.ok) {
                    alert(`Server error: ${res.statusText}. Make sure you are NOT saving empty content`);
                }
    
                const result = await res.json();
                console.log("Result : ",result)
                const postId = result._id
                for (let i = 0; i < files.length; i++) {
                    if (files[i]) {
                        const fileFormData = new FormData();
                        fileFormData.append('file', files[i]);
                        fileFormData.append('postId', postId);

                        const fileRes = await fetch('/api/comm_post/upload_file', {
                            method: 'POST',
                            body: fileFormData,
                        });

                        if (!fileRes.ok) {
                            throw new Error(`File upload error: ${fileRes.statusText}`);
                        }
                    }
                } 
                window.location.reload(); // Consider updating UI state instead
            } catch (error) {
                alert("Error submitting editor content: " + error.message);
            }
            
        }
    };

    const handleFileChange = (index, e) => {
        const newFiles = [...files];
        newFiles[index] = e.target.files[0];
        setFiles(newFiles);
    };

    const addFileInput = () => {
        setFiles([...files, null]);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='mt-[3vh]'>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                /> <br />
                <input
                    type="text"
                    placeholder="Keywords (comma separated)"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                />
                <p>(Example: The keywords could be subject and/or topic)</p>

                <CKEditor
                    editor={ClassicEditor}
                    onReady={editor => {
                        editorRef.current = editor;
                    }}
                    config={{
                        plugins: [
                            Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, Highlight, ListView, List, TodoList, AutoImage, SimpleUploadAdapter, ImageResize, ImageStyle, ImageToolbar,
                        ],
                        toolbar: {
                            items: [
                                'undo', 'redo', 'cut',
                                '|',
                                'heading',
                                '|',
                                'fontfamily',
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
                        simpleUpload: {
                            uploadUrl: '/api/upload',
                            withCredentials: true,
                            headers: {
                                'X-CSRF-TOKEN': 'CSRF-Token',
                                Authorization: 'Bearer <JSON Web Token>'
                            }
                        },
                        image: {
                            toolbar: ['imageTextAlternative', 'imageStyle:side', 'imageStyle:alignLeft', 'imageStyle:block']
                        },
                    }}
                />

                {isPrivate && (
                    <div>
                        {files.map((file, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <input 
                                    type="file" 
                                    onChange={(e) => handleFileChange(index, e)} 
                                    style={{ display: 'block', marginBottom: '5px' }} 
                                />
                            </div>
                        ))}

                        <button 
                            type="button" 
                            onClick={addFileInput} 
                            style={{ marginBottom: '10px' }}
                            className="mt-3 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                        >
                            Add another file
                        </button>
                    </div>
                )}

                <button type="submit" className="mt-[3vh] focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Post</button>
            </form>
        </div>
    );
}

export default CustomEditor;
