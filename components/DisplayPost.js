import React, { useState, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, FontColor, Highlight, FontSize, Font, OrderedList, BulletedList, Indent, Outdent, List, TodoList, AutoImage, Autosave, ListView, SimpleUploadAdapter, ImageResize ,ImageStyle, ImageToolbar,} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


function DisplayPost({post}) {
    const router = useRouter();
    const { id } = router.query;
    // const [post, setPost] = useState(null);

    

    return (
        <div>
            <div  style={{width:"90%", display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center", alignItems:"center"}}>
                <CKEditor
                    editor={ClassicEditor}
                    data={post}
                    disabled = {true}
                    config={{
                        plugins: [
                            Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, Highlight, ListView, List, TodoList, AutoImage, SimpleUploadAdapter,ImageResize,ImageStyle,ImageToolbar
                        ],
                        // toolbar: {
                        //     items: [
                        //         'undo', 'redo','cut',
                        //         '|',
                        //         'heading',
                        //         '|',
                        //         'fontfamily',
                        //         '|',
                        //         'bold', 'highlight', 'italic', 'strikethrough', 'subscript', 'superscript', 'code', 'underline', 'alignment',
                        //         '|',
                        //         'link', 'uploadImage', 'blockQuote', 'codeBlock',
                        //         '|',
                        //         'bulletedList', 'numberedList', 'todoList', 
                        //         '|',
                        //         'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells',
                        //     ]
                        // },
                        toolbar:[],
                        isReadOnly: true,
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
            </div>
        </div>
    );
}

export default DisplayPost;
