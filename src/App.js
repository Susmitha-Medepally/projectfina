import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from server
    const fetchPosts = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL || 'http://localhost:5000/api/fetch-posts');
        const postsArray = Array.isArray(response.data) ? response.data : []; // Ensure it's an array
        // Update state with fetched posts
        setPosts(postsArray);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Social Media Monitor</h1>
      <iframe src='https://widgets.sociablekit.com/instagram-feed/iframe/25379947' frameborder='0' width='100%' height='1000'></iframe>
      <iframe src='https://widgets.sociablekit.com/facebook-page-posts/iframe/25379957' frameborder='0' width='100%' height='1000'></iframe>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            <p>{post.content}</p>
            <p>Sentiment: {post.sentiment}</p>
            <ul>
              {post.comments && Array.isArray(post.comments) ? (
                post.comments.map((comment, commentIndex) => (
                  <li key={commentIndex}>{comment}</li>
                ))
              ) : (
                <li>No comments available</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
