import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingComp from '../../components/LoadingComp';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import Comments from '../../components/Comments';
import { toast } from 'react-toastify'; // Assuming you are using react-toastify for notifications
import 'react-toastify/dist/ReactToastify.css';
// import LoadingComp from '../../components/LoadingComp';

const DisplayPost = dynamic(() => import('../../components/DisplayPost'), { ssr: false });

const Post = () => {
    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);
    const [files, setFiles] = useState([]);
    const { data: session } = useSession();
    const [likeFlag, setLikeFlag] = useState(false);
    const [isLiking, setIsLiking] = useState(false);  // To handle the like button loading state
    const [access,setAccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingFiles, setLoadingFiles] = useState(false);
    useEffect(() => {
        if (id) {
            const fetchPost = async () => {
                try {
                    // setLoading(true);
                    const res = await fetch(`/api/comm_post/get_post_by_id?id=${id}`);
                    const data = await res.json();
                    console.log("got data : ",data[0])
                    console.log("data length : ",data.length)
                    if (data && data.length > 0) {
                        console.log("data setting starts")
                        setPost(data[0]);  // Accessing the first object in the array
                        setLikes(data[0].likes);  // Set initial likes
                        setLikeFlag(data[0].likedBy.includes(session?.user?.name || ''));
                        console.log("data setting ends")
                        console.log("user = ",data[0].user===session.user.name)
                        if(data[0].user === session.user.name){
                            console.log("post.user = ")
                            setAccess(true)
                        }
                        // setLoading(false);
                        // Fetch files if there are any
                        if (data[0].fileIds && data[0].fileIds.length > 0) {
                            console.log("Now staring to retrieve files")
                            setLoadingFiles(true)
                            console.log("Files loading : ",loadingFiles)
                            const filesRes = await fetch(`/api/comm_post/get_file?id=${data[0]._id}`);
                            const filesData = await filesRes.json();
                            setFiles(filesData.files);
                            setLoadingFiles(false);
                            console.log("Files loading : ",loadingFiles)
                            
                        }
                       
                    } else {
                        toast.error('Post not found');
                    }
                } catch (error) {
                    toast.error('Error fetching post: ' + error.message);
                }
            };
            
            fetchPost();
        }
    }, [id, session?.user?.name]);

    const handleLiked = async (postId) => {
        try {
            setIsLiking(true);  // Start loading state
            const res = await fetch(`/api/comm_post/update_likes?id=${postId}&likeflag=${likeFlag}`, {
                method: 'PATCH',
            });
            if (!res.ok) {
                throw new Error('Failed to update likes');
            }
            const data = await res.json();
            setLikes(data.likes);  // Update the likes state with the new count
            setLikeFlag(!likeFlag);  // Toggle like status
            toast.success('You have liked the post!');
        } catch (error) {
            toast.error('Error updating likes: ' + error.message);
        } finally {
            setIsLiking(false);  // End loading state
        }
    };

    if (!session) {
        return <p className="text-center">Please login to view this post.</p>;
    }

    if (!post) {
        return <LoadingComp />;
    }
    if(loading){
        return <LoadingComp />
    }
    return (
        <div className="container mx-auto p-4">
            <div className="post-container max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                <p className="text-sm text-gray-600 mb-4"><strong>Posted by:</strong> {post.user}</p>
                {/* {files.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold">Attached Files:</h2>
                        <ul className="list-disc ml-6 mt-2">
                            {files.map((file, index) => (
                                <li key={index}>
                                    <a href={file.url} download className="text-blue-500 hover:underline">
                                        {file.filename}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )} */}
                {loadingFiles && <p>Files Loading wait for some time please </p>}
                {files.length > 0 && (
                        <div>
                            <h2 style={{ textAlign: "center", fontWeight: "bold", paddingBottom: "6px" }}>
                            Attached Files:
                            </h2>
                            <div 
                            className='items-center'
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: "15px",
                                marginLeft: "10px",
                            }}
                            >
                            {files.map((file, index) => (
                                <div
                                key={index}
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    textAlign: "center",
                                    width: "150px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                                >
                                <a href={file.url} download style={{ textDecoration: "none", color: "#000" }}>
                                    <strong>{file.filename}</strong>
                                    <p style={{ marginTop: "8px", color: "#007bff" }}>Download</p></a>
                                    {access && <button style={{color:"red"}} onClick={()=>{handleFileDelete(file.id)}}>Delete</button>}
                                
                                </div>
                            ))}
                            </div>
                        </div>
                        )}
                <div style={{width:"100%" ,height:'fit-content',}}>
                <DisplayPost post={post.content} /></div>
                
                {session && (
                    <div className="flex items-center space-x-2 mt-4">
                        <button 
                            className={`heart-container ${isLiking ? 'opacity-50' : ''}`} 
                            title="Like" 
                            onClick={() => handleLiked(post._id)} 
                            disabled={isLiking}
                        >
                            <div className="svg-container">
                                {!likeFlag && (
                                    <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                                    </svg>
                                )}
                                {likeFlag && (
                                    <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                                    </svg>
                                )}
                            </div>
                        </button>
                        <p>{likes} likes</p>
                    </div>
                )}

                
                
                <Comments postId={post._id} />
            </div>
        </div>
    );
};

export default Post;
