import React, { useState, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, FontColor, Highlight, FontSize, Font, OrderedList, BulletedList, Indent, Outdent, List, TodoList, AutoImage, Autosave, ListView, SimpleUploadAdapter, ImageResize ,ImageStyle, ImageToolbar,} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


function DisplayEditor({note,access}) {
    const router = useRouter();
    const [editorData, setEditorData] = useState(note.content);
    const editorRef = useRef(null);
    const { data: session } = useSession();
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([null]);
    // console.log("Access in DisplayEditor:", access);

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
                const noteId = result._id

                for (let i = 0; i < files.length; i++) {
                    if (files[i]) {
                        const fileFormData = new FormData();
                        fileFormData.append('file', files[i]);
                        fileFormData.append('noteId', noteId);

                        const fileRes = await fetch('/api/upload_file', {
                            method: 'POST',
                            body: fileFormData,
                        });

                        if (!fileRes.ok) {
                            throw new Error(`File upload error: ${fileRes.statusText}`);
                        }
                    }
                }
                router.push('/services/notes');
            }
        
    
            // window.location.reload(); // Reload the page after successful submission
        }
    };
    const handleFileChange = (index, e) => {
        const newFiles = [...files];
        newFiles[index] = e.target.files[0]; // Update the specific file input
        setFiles(newFiles);
    };

    const addFileInput = () => {
        setFiles([...files, null]); // Add a new file input (null placeholder)
    };

    return (
        <div>
            {/* <p>Access: {access ? "Granted" : "Denied"}</p> */}
            <form onSubmit={handleSubmit} style={{width:"90%", display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center", alignItems:"center",marginLeft:"5%"}}>
                <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onReady={editor => {
                        editorRef.current = editor;
                    }}
                    disabled={!access}
                    config={{
                        plugins: [
                            Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, Highlight, ListView, List, TodoList, AutoImage, SimpleUploadAdapter,ImageResize,ImageStyle,ImageToolbar,FontSize
                        ],
                        toolbar: {
                            items: [
                                'undo', 'redo','cut',
                                '|',
                                'heading',
                                '|',
                                'fontfamily','fontsize',
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
                {access&&<div>
                {files.map((file, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <input 
                            type="file" 
                            onChange={(e) => handleFileChange(index, e)} 
                            style={{ display: 'block', marginBottom: '5px' }} 
                        />
                    </div>
                ))}

                {/* Button to add more file inputs */}
                <button 
                    type="button" 
                    onClick={addFileInput} 
                    style={{ marginBottom: '10px' }}
                    className="mt-3 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                >
                    Add another file
                </button>

                <button type="submit" class="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Update</button>
            </div>}
            </form>
        </div>
    );
}

export default DisplayEditor;
