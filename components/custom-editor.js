import React, { useState, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Strikethrough, Code, ImageUpload, Image, Link, Heading, FontFamily, Subscript, Superscript, BlockQuote, CodeBlock, Table, TableCaption, Text, Underline, Alignment, FontColor, Highlight, FontSize, Font, OrderedList, BulletedList, Indent, Outdent, List, TodoList, AutoImage, Autosave, ListView, SimpleUploadAdapter, ImageResize ,ImageStyle, ImageToolbar,FileUploader} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useSession } from 'next-auth/react';
import LoadingComp from '../components/LoadingComp'

function CustomEditor() {
    const [editorData, setEditorData] = useState('');
    const [title, setTitle] = useState('');
    const editorRef = useRef(null);
    const { data: session } = useSession();
    const [template, setTemplate] = useState('');
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([null]);
    const [loadingState,setLoadingState] = useState(false);

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
            formData.append('user', session.user.email); 
            
            try {
                setLoadingState(true);
                const res = await fetch('/api/editor', {
                    method: 'POST',
                    body: formData,
                });
    
                if (!res.ok) {
                    alert(`Server error: ${res.statusText}. Make sure you are NOT saving empty content`);
                }
    
                const result = await res.json();
                // console.log(result);
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

                setLoadingState(false);
                window.location.reload(); // Consider updating UI state instead
            } catch (error) {
                alert("Error submitting editor content:", error.message);
                // Inform the user about the error
            }
        }
    };
    const handleTemplate= (template_name)=>{
        if(template_name==="journal"){
            const journal =`
            <h4><strong>DATE : dd-mm-yyyy</strong></h4><p>&nbsp;</p><p><span style="font-family:'Lucida Sans Unicode', 'Lucida Grande', sans-serif;">How was today?&nbsp;</span></p><p>😁(good) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;😊(ok, but .. could've gone better) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;😐(neutral, nothing new) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;🙁(not good) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;😣 (Worst)</p><p>&nbsp;</p><p><i>Brief about your day.&nbsp;</i></p><p><i>What was the highlight of today??&nbsp;</i></p><p><i>What was the memorable experience you had??&nbsp;</i></p><p><i>What lessons did you learn?</i></p><p><i>What are your plans for conquering tomorrow??</i></p><p>&nbsp;</p><p><span style="font-family:'Courier New', Courier, monospace;">Grateful for experiencing yet another day.</span></p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>`
            setTemplate(journal);
        }
        else if(template_name==="notes"){
            const note=`
            <h3><span class="text-big" style="font-family:'Times New Roman', Times, serif;"><strong>Topic: [Insert Topic Name]</strong></span></h3><p>&nbsp;</p><h3><strong>Abstract (Brief Introduction):</strong><br>Lorem ipsum dolor sit amet. Nam quia ratione est voluptate amet sit earum laudantium ut minus minus. Qui neque dolorem eum sint consequatur ut error assumenda sit sint minima. At iure reprehenderit (important words to remember) sit doloribus vero et exercitationem odio sed omnis vitae qui similique consequatur et suscipit similique aut quasi nobis. Non iure facilis et voluptatem maxime ut provident exercitationem.</h3><h4><span style="font-family:Tahoma, Geneva, sans-serif;"><strong>Key Concepts:</strong></span></h4><ul><li><h4>Concept 1: Brief explanation or definition.</h4></li><li><h4>Concept 2: Brief explanation or definition.</h4></li><li><h4>Concept 3: Brief explanation or definition.</h4></li></ul><p>&nbsp;</p><h4><strong>Detailed Explanation:</strong><br>[Expand on the abstract with more details, examples, or theories related to the topic.]</h4><ul><li>Subtopic 1:</li></ul><ol><li>Detail about subtopic.</li><li>Further detail or example.</li></ol><p>&nbsp;</p><ul><li>Subtopic 2:</li></ul><ol><li>Detail about subtopic.</li><li><p>Further detail or example.</p><p>&nbsp;</p></li></ol><h4><strong>Important Terms and Definitions:</strong></h4><ol><li><h4>&nbsp;Definition or explanation.</h4></li><li><h4>Definition or explanation.</h4></li><li><h4>Definition or explanation.</h4><p>&nbsp;</p></li></ol><h4><strong>Examples/Applications:</strong><br>[Provide real-world examples or applications of the topic.]</h4><p>&nbsp;</p><h4><strong>Questions for Further Study</strong>:</h4><ol><li><h4>Open-ended question to explore further.</h4></li><li><h4>Open-ended question to explore further.</h4><p>&nbsp;</p></li></ol><h4><strong>References</strong>:<br>[List books, articles, websites, or other resources for deeper exploration.]</h4><h4><strong>Personal Notes:</strong><br>[Any personal insights, questions, or connections to other topics or subjects.]<br>&nbsp;</h4>`
            setTemplate(note);
            }
    }
    const handleFileChange = (index, e) => {
        const newFiles = [...files];
        newFiles[index] = e.target.files[0]; // Update the specific file input
        setFiles(newFiles);
    };

    const addFileInput = () => {
        setFiles([...files, null]); // Add a new file input (null placeholder)
    };

    return (
        <div className='mt-3'>
            {loadingState && <LoadingComp></LoadingComp>}
            {/* <button onClick={()=>{handleTemplate('journal')}}>Journal Template</button> */}
            <button onClick={()=>{handleTemplate('journal')}} class="mr-3 group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition hover:scale-110"><span>Journal Template</span><div class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]"><div class="relative h-full w-8 bg-white/20"></div></div></button>
            <button onClick={()=>{handleTemplate('notes')}} class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition hover:scale-110"><span>Notes Template</span><div class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]"><div class="relative h-full w-8 bg-white/20"></div></div></button>
            {/* <button onClick={()=>{handleTemplate('notes')}}>Notes Template</button> */}
            <form onSubmit={handleSubmit} className='mt-[3vh]'>
            <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <CKEditor
                    editor={ClassicEditor}
                    data={template}
                    onReady={editor => {
                        editorRef.current = editor;
                    }}
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

                <button type="submit" class="mt-[3vh] focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Save</button>
            </form>
        </div>
    );
}

export default CustomEditor;
