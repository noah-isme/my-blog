import { useState, useEffect } from 'react';
import { createPost, updatePost, getPost } from '../api';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function PostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const post = await getPost(id);
          if (post) {
            setTitle(post.title);
            setBody(post.body);
          }
        } catch (error) {
          setMessage(`Failed to fetch post: ${error.message}`);
          setMessageType('error');
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      if (id) {
        await updatePost(id, { title, body });
        setMessage('Post updated successfully!');
      } else {
        await createPost({ title, body });
        setMessage('Post created successfully!');
      }
      setMessageType('success');
      navigate('/');
    } catch (error) {
      setMessage(`Failed to save post: ${error.message}`);
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
          {id ? 'Edit Post' : 'New Post'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="body"
            label="Body"
            multiline
            rows={4}
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {id ? 'Update' : 'Create'}
          </Button>
          {message && (
            <Alert severity={messageType} sx={{ width: '100%', mt: 2 }}>
              {message}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default PostForm;
