import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavComp from '../../components/NavComp';
import LoadingComp from '../../components/LoadingComp';
// import DisplayPost from '../../components/Display_post';
import dynamic from 'next/dynamic';
const DisplayPost = dynamic( () => import( '../../components/DisplayPost' ), { ssr: false } );


const Post = () => {
    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchPost = async () => {
                try {
                    const res = await fetch(`/api/comm_post/get_post_by_id?id=${id}`);
                    const data = await res.json();
                    console.log("Fetched Data: ", data);
                    if (Array.isArray(data) && data.length > 0) {
                        setPost(data[0]);  // Accessing the first object in the array
                    } else {
                        console.error('Post not found');
                    }
                } catch (error) {
                    console.error('Error fetching post:', error.message);
                }
            };

            fetchPost();
        }
    }, [id]);

    useEffect(() => {
        if (post) {
            console.log("Post: ", post.title);
        }
    }, [post]);

    if (!post) {
        return <LoadingComp />;
    }

    return (
        <div>
            <NavComp />
            <div className='flex justify-center flex-col items-center'>
            <h1>{post.title}</h1>
            <p><strong>Posted by:</strong> {post.user}</p>
            <DisplayPost post= {post.content}></DisplayPost>
            </div>
        </div>
    );
};

export default Post;

