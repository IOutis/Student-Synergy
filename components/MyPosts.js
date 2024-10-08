import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function MyPosts() {
    const [posts, setPosts] = useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/comm_post/get_my_posts?user=${session.user.name}`);
                const data = await res.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching my posts:', error.message);
            }
        };

        fetchPosts();
    }, [session]);

    const truncateContent = (content) => {
        const maxLength = 50; // Adjust this length as needed
        const plainText = content.replace(/<[^>]+>/g, ''); // Strip HTML tags
        if (plainText.length > maxLength) {
            return plainText.substring(0, maxLength) + '...';
        }
        return plainText;
    };
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            try {
                const res = await fetch(`/api/comm_post/delete_post?id=${id}`, {
                    method: 'DELETE',
                });

                if (!res.ok) {
                    throw new Error('Failed to delete the post');
                }

                setPosts(posts.filter(post => post._id !== id));
                alert('Post deleted successfully');
            } catch (error) {
                console.error('Error deleting post:', error.message);
                alert('Failed to delete the post. Please try again later.');
            }
        }
    };

    return (
        <div>
            {posts.map(post => (
                <div key={post._id} className="post p-3" style={{borderColor:"black", backgroundColor:"#dadada", borderBlockColor:"black", borderWidth:"2px"}}>
                    <Link href={`/post/${post._id}`}><h2>{post.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: truncateContent(post.content) }} />
                    Read more</Link>
                    <button onClick={()=>{handleDelete(post._id)}}>Delete</button>
                    {/* <p><strong>Keywords:</strong> {post.keywords.join(', ')}</p> */}
                    {/* <p><strong>Posted by:</strong> {post.user}</p> */}
                </div>
            ))}
        </div>
    );
}

export default MyPosts;
