const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/socialMediaMonitor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  platform: String,
  content: String,
  comments: [String],
  sentiment: String,
});

const Post = mongoose.model('Post', postSchema);

const fetchFacebookPosts = async (accessToken) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/v12.0/{your-page-id}/posts`, {
      params: {
        access_token: accessToken,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    return [];
  }
};

app.get('/api/fetch-posts', async (req, res) => {
  try {
    // Replace 'YOUR_FACEBOOK_ACCESS_TOKEN' with your actual Facebook access token
    const facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN || 'EAAKTUoZCU63oBO1Snm23L5ikTDrYoFwJLYieA0BG7ImjHVrOTBxnEBCp0pXxQws696Atie8O38dWnmsUjaPXSNpbBEaBick5w1xrZCvp4JVTQWqzeB9NrK4EZClrnTTsHtyDPwQjAJeiGDSVrcUDdRSfZCYfFbOSz7Gr8x1Uw8AJUryZCXPDGzyfib5urhUSZCBwJX4OQZAP77hmyDMaCmFIe3cQAUZD';
    
    // Fetch and save posts from Facebook
    const facebookPosts = await fetchFacebookPosts(facebookAccessToken);
    await savePostsToDatabase('Facebook', facebookPosts);

    res.json({ success: true, message: 'Posts fetched and saved successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

const savePostsToDatabase = async (platform, posts) => {
  for (const post of posts) {
    const newPost = new Post({
      platform: platform,
      content: post.message || post.caption || '', // Adjust this based on the actual data structure
      comments: post.comments || [], // Adjust this based on the actual data structure
      sentiment: 'Positive', // Implement sentiment analysis
    });
    await newPost.save();
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
