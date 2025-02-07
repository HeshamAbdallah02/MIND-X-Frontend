import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'blog',
    imageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/blogs/${currentBlogId}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/blogs', formData, config);
      }

      setFormData({ title: '', content: '', category: 'blog', imageUrl: '' });
      setIsEditing(false);
      setCurrentBlogId(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      content: blog.content,
      category: blog.category,
      imageUrl: blog.imageUrl
    });
    setIsEditing(true);
    setCurrentBlogId(blog._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>
          <div>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="blog">Blog</option>
              <option value="daily-life">Daily Life</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditing ? 'Update Post' : 'Create Post'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="border-b pb-4">
              <h3 className="font-semibold">{blog.title}</h3>
              <p className="text-gray-600">{blog.content.substring(0, 100)}...</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEdit(blog)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogManager;