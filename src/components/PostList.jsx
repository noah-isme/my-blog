import { useState, useEffect } from 'react';
import { getPosts, deletePost } from '../api';
import { Container, Typography, Box, Alert, List, ListItem, ListItemText, Button, IconButton } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      setMessage(`Failed to fetch posts: ${error.message}`);
      setMessageType('error');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      fetchPosts();
    } catch (error) {
      setMessage(`Failed to delete post: ${error.message}`);
      setMessageType('error');
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Posts
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2, mb: 2 }}>
          <Button variant="contained" component={Link} to="/posts/new">
            New Post
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </Box>
        {message && (
          <Alert severity={messageType} sx={{ width: '100%', mt: 2 }}>
            {message}
          </Alert>
        )}
        <List sx={{ width: '100%' }}>
          {posts.map((post) => (
            <ListItem 
              key={post.id}
              secondaryAction={
                <>
                  <IconButton component={Link} to={`/posts/${post.id}/edit`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(post.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={post.title} secondary={post.body} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default PostList;
