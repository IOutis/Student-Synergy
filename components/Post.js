import React, { useState, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, FontColor, Highlight, FontSize, Font, OrderedList, BulletedList, Indent, Outdent, List, TodoList, AutoImage, Autosave, ListView, SimpleUploadAdapter, ImageResize ,ImageStyle, ImageToolbar,} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useSession } from 'next-auth/react';

function CustomEditor() {
    const [editorData, setEditorData] = useState('');
    const [title, setTitle] = useState('');
    const [keywords, setKeywords] = useState('');
    const editorRef = useRef(null);
    const { data: session } = useSession();

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
    
            // Prepare the form data
            const formData = new FormData();
            formData.append('content', content);
            formData.append('title', title);
            formData.append('user', session.user.name); 
            formData.append('keywords', keywords.split(',')); 
            
            try {
                const res = await fetch('/api/comm_post/post_content', {
                    method: 'POST',
                    body: formData,
                });
    
                if (!res.ok) {
                    alert(`Server error: ${res.statusText}. Make sure you are NOT saving empty content`);
                }
    
                const result = await res.json();
                // console.log(result);
    
                window.location.reload(); // Consider updating UI state instead
            } catch (error) {
                alert("Error submitting editor content:", error.message);
                // Inform the user about the error
            }
        }
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
                /> <p>(Example : The keywords could be subject and/or topic )</p>
                <CKEditor
                    editor={ClassicEditor}
                    onReady={editor => {
                        editorRef.current = editor;
                    }}
                    config={{
                        plugins: [
                            Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, Highlight, ListView, List, TodoList, AutoImage, SimpleUploadAdapter,ImageResize,ImageStyle,ImageToolbar
                        ],
                        toolbar: {
                            items: [
                                'undo', 'redo','cut',
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
                <button type="submit" class="mt-[3vh] focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Post</button>
            </form>
        </div>
    );
}

export default CustomEditor;
