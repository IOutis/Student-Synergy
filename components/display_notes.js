import React, { useState, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, FontColor, Highlight, FontSize, Font, OrderedList, BulletedList, Indent, Outdent, List, TodoList, AutoImage, Autosave, ListView, SimpleUploadAdapter, ImageResize ,ImageStyle, ImageToolbar,} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


function DisplayEditor({note}) {
    const router = useRouter();
    const [editorData, setEditorData] = useState(note.content);
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
    
            // Prepare the form data to include both the content and the user's name
            const formData = new FormData();
            formData.append('content', content);
            formData.append('user', session.user.email); 
            
    
            // Send the form data to the server
            const res = await fetch(`/api/update_editor?id=${note._id}`, {
                method: 'POST',
                body: formData, // Note: Do not manually set Content-Type to application/json when sending FormData
            });
    
            const result = await res.json();
            if (!res.ok){
                alert("Updating process failed");
            }
            else{
                router.push('/services/notes');
            }
        
    
            // window.location.reload(); // Reload the page after successful submission
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={{width:"50vw", display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center", alignItems:"center"}}>
                <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
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
                                'bold', 'highlight', 'italic', 'strikethrough', 'subscript', 'superscript', 'code', 'underline', 'alignment',
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
                {/* <button type="submit">Update</button> */}
                <button type="submit" class="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Update</button>
            </form>
        </div>
    );
}

export default DisplayEditor;
