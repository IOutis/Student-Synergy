import React, { useState, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, FontColor, Highlight, FontSize, Font, OrderedList, BulletedList, Indent, Outdent, List, TodoList, AutoImage, Autosave, ListView, SimpleUploadAdapter, ImageResize ,ImageStyle, ImageToolbar,} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useSession } from 'next-auth/react';

function CustomEditor({ postId, parentId = null }) {
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
            console.log("Post id =", postId)
            // Prepare the data for submission
            const formData = {
                content: content,
                user: session.user.name,
                email: session.user.email,
                postId: postId ,
                parentId: parentId
            };
            
            try {
                const res = await fetch('/api/comm_post/add_comment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                if (!res.ok) {
                    throw new Error(`Server error: ${res.statusText}`);
                }
    
                const result = await res.json();
                console.log("Comment submitted successfully:", result);
    
                window.location.reload(); // Consider updating UI state instead of reloading
            } catch (error) {
                console.error("Error submitting comment:", error.message);
                alert("There was an error submitting your comment. Please try again.");
            }
        }
    };
    

    return (
        <div>
            <form onSubmit={handleSubmit} className='mt-[3vh]'>
                <CKEditor
                    editor={ClassicEditor}
                    onReady={(editor) => {
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
                <button type="submit" class="mt-[3vh] focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Save</button>
            </form>
        </div>
    );
}

export default CustomEditor;
