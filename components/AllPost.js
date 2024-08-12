import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    function convertHtmlToPlainText(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }
    

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/comm_post/get_all_posts');
                const data = await res.json();
                const convertedPosts = data.map(post => ({
                    ...post,
                    content: convertHtmlToPlainText(post.content)
                }));
                setPosts(convertedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error.message);
            }
        };

        fetchPosts();
    }, []);

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
                <div key={post._id} className="post p-3" style={{borderColor:"black", backgroundColor:"#dadada", borderBlockColor:"black", borderWidth:"2px"}}>
                    <Link href={`/post/${post._id}`}><h2>{post.title}</h2>
                    <p><strong>Posted by:</strong> {post.user}</p>
                    <div dangerouslySetInnerHTML={{ __html: truncateContent(post.content) }} />
                    Read more</Link>
                </div>
            ))}
        </div>
    );
}

export default AllPosts;
