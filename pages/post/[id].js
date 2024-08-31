import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavComp from '../../components/NavComp';
import LoadingComp from '../../components/LoadingComp';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import Comments from '../../components/Comments';

const DisplayPost = dynamic(() => import('../../components/DisplayPost'), { ssr: false });

const Post = () => {
    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);
    const [files, setFiles] = useState([]);
    const { data: session } = useSession();
    const [likeFlag, setLikeFlag] = useState(false);
    // if(!session){
    //     return <><NavComp></NavComp> <p>Login</p></>
    // }

    useEffect(() => {
        if (id) {
            const fetchPost = async () => {
                try {
                    const res = await fetch(`/api/comm_post/get_post_by_id?id=${id}`);
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setPost(data[0]);  // Accessing the first object in the array
                        setLikes(data[0].likes);  // Set initial likes
                        setLikeFlag(data[0].likedBy.includes(session?.user?.name || ''));
                        
                        // Fetch files if there are any
                        if (data[0].fileIds && data[0].fileIds.length > 0) {
                            const filesRes = await fetch(`/api/comm_post/get_file?id=${data[0]._id}`);
                            const filesData = await filesRes.json();
                            setFiles(filesData.files);
                            const filesArray = Object.values(files);
                            console.log("Files",filesArray)
                        }
                    } else {
                        console.error('Post not found');
                    }
                } catch (error) {
                    console.error('Error fetching post:', error.message);
                }
            };
            
            fetchPost();
        }
    }, [id, session?.user?.name]); // Adding session.user.name as a dependency

    const handleLiked = async (postId) => {
        try {
            const res = await fetch(`/api/comm_post/update_likes?id=${postId}&likeflag=${likeFlag}`, {
                method: 'PATCH',
            });
            if (!res.ok) {
                throw new Error('Failed to update likes');
            }
            const data = await res.json();
            setLikes(data.likes); // Update the likes state with the new count
            await fetchPost(); // Reload the post data to get the latest state
        } catch (error) {
            console.error('Error updating likes:', error.message);
        }
    };

    if (!session) {
        return (
            <>
                <NavComp />
                <p>Login</p>
            </>
        );
    }

    if (!post) {
        return <LoadingComp />;
    }

    return (
        <div>
            <NavComp />
            <div className='flex justify-center flex-col items-center'>
                <h1>{post.title}</h1>
                <p><strong>Posted by:</strong> {post.user}</p>
                <DisplayPost post={post.content} />
                {session && (
                    <div className="heart-container" title="Like" onClick={() => handleLiked(post._id)}>
                        <div className="svg-container">
                            {!post.likedBy.includes(session.user.name) && (
                                <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
                                    </path>
                                </svg>
                            )}
                            {post.likedBy.includes(session.user.name) && (
                                <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
                                    </path>
                                </svg>
                            )}
                        </div>
                    </div>
                )}
                <p>Number of likes: {likes}</p>
           
                {files.length > 0 && (
                    <div>
                        <h2 style={{ textAlign: "center", fontWeight: "bold" }}>Attached Files:</h2>
                        <ul>
                            {files.map((file, index) => (
                                <li key={index}>
                                    <a href={file.url} download>{file.filename}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
             
                <Comments postId={post._id} />
            </div>
        </div>
    );
};

export default Post;
