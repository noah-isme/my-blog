import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <PostList />
          </PrivateRoute>
        }
      />
      <Route 
        path="/posts/new" 
        element={
          <PrivateRoute>
            <PostForm />
          </PrivateRoute>
        }
      />
      <Route 
        path="/posts/:id/edit" 
        element={
          <PrivateRoute>
            <PostForm />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
