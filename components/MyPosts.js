import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

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
        const maxLength = 150; // Adjust this length as needed
        const plainText = content.replace(/<[^>]+>/g, ''); // Strip HTML tags
        if (plainText.length > maxLength) {
            return plainText.substring(0, maxLength) + '...';
        }
        return plainText;
    };

    return (
        <div>
            {posts.map(post => (
                <div key={post._id} className="post">
                    <a href={`/post/${post._id}`}><h2>{post.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: truncateContent(post.content) }} />
                    Read more</a>
                    {/* <p><strong>Keywords:</strong> {post.keywords.join(', ')}</p> */}
                    {/* <p><strong>Posted by:</strong> {post.user}</p> */}
                </div>
            ))}
        </div>
    );
}

export default MyPosts;
