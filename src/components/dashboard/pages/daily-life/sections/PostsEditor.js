import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../config/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Workspace', 'Team Activities', 'Events', 'Behind the Scenes', 'Fun Moments', 'Learning'];

export default function PostsEditor() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ author: { name: '', role: '' }, caption: '', category: 'Workspace' });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem('token');
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchPosts = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/daily-life/admin/posts`, authHeaders);
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const handleCreate = async () => {
        if (!form.author.name || !form.category) {
            toast.error('Author name and category are required');
            return;
        }
        setSaving(true);
        try {
            // 1. Create post
            const { data: post } = await axios.post(`${API_BASE_URL}/api/daily-life/admin/posts`, form, authHeaders);

            // 2. Upload images if any
            if (selectedFiles.length > 0) {
                const fd = new FormData();
                selectedFiles.forEach(f => fd.append('images', f));
                await axios.post(`${API_BASE_URL}/api/daily-life/admin/posts/${post._id}/images`, fd, {
                    ...authHeaders,
                    headers: { ...authHeaders.headers, 'Content-Type': 'multipart/form-data' }
                });
            }

            toast.success('Post created!');
            setForm({ author: { name: '', role: '' }, caption: '', category: 'Workspace' });
            setSelectedFiles([]);
            setShowForm(false);
            fetchPosts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create post');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/daily-life/admin/posts/${id}`, authHeaders);
            toast.success('Post deleted');
            fetchPosts();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleTogglePublish = async (id) => {
        try {
            await axios.patch(`${API_BASE_URL}/api/daily-life/admin/posts/${id}/publish`, {}, authHeaders);
            fetchPosts();
        } catch {
            toast.error('Failed to update');
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[#81C99C] rounded-full animate-spin" />
        </div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">📸 Daily Posts</h3>
                    <p className="text-sm text-gray-500 mt-1">{posts.length} posts</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-[#81C99C] text-white rounded-lg text-sm font-medium hover:bg-[#6db888] transition">
                    {showForm ? 'Cancel' : '+ New Post'}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-xl border p-5 space-y-4">
                    <h4 className="font-medium text-gray-800 text-sm">Create New Post</h4>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Author Name</label>
                            <input type="text" value={form.author.name}
                                onChange={e => setForm(f => ({ ...f, author: { ...f.author, name: e.target.value } }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. Ahmed" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Author Role</label>
                            <input type="text" value={form.author.role}
                                onChange={e => setForm(f => ({ ...f, author: { ...f.author, role: e.target.value } }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. Team Leader" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                            className="w-full border rounded-lg px-3 py-2 text-sm">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Caption</label>
                        <textarea value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                            rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="What's happening today..." />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Images (max 10) — {selectedFiles.length} selected
                        </label>
                        <input type="file" multiple accept="image/*"
                            onChange={e => setSelectedFiles(Array.from(e.target.files).slice(0, 10))}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                    </div>

                    <button onClick={handleCreate} disabled={saving}
                        className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-sm font-medium hover:bg-[#2a2a4e] transition disabled:opacity-50">
                        {saving ? 'Creating...' : 'Create Post'}
                    </button>
                </div>
            )}

            {/* Posts List */}
            {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p className="text-4xl mb-3">📸</p>
                    <p>No posts yet. Create your first daily life post!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map(post => (
                        <div key={post._id} className="bg-white rounded-xl border p-4 flex items-start gap-4">
                            {/* Thumbnail */}
                            {post.images?.[0] ? (
                                <img src={post.images[0].url} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                            ) : (
                                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-2xl">📷</div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-800 text-sm">{post.author?.name}</span>
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg">{post.category}</span>
                                    {!post.isPublished && (
                                        <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-lg">Draft</span>
                                    )}
                                </div>
                                <p className="text-gray-500 text-sm truncate">{post.caption || 'No caption'}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {post.images?.length || 0} images · ❤️ {post.likes || 0} · {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => handleTogglePublish(post._id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${post.isPublished
                                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                            : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                        }`}>
                                    {post.isPublished ? 'Published' : 'Publish'}
                                </button>
                                <button onClick={() => handleDelete(post._id)}
                                    className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
