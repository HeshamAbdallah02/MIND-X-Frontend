# Frontend Copilot Instructions

## Critical Rules for MIND-X Frontend

### 🔴 ALWAYS DO THIS

1. **Use `localStorage.getItem('token')`** - NEVER `adminToken` or `authToken`
2. **Add loading states** for all async operations
3. **Use optional chaining** (`?.`) for nested objects
4. **Await `queryClient.invalidateQueries()`** after mutations
5. **Add confirmation dialogs** for destructive actions

---

## Authentication Pattern

### ✅ Correct Token Usage
```javascript
const token = localStorage.getItem('token');
const response = await axios.get(`${API_BASE_URL}/api/resource/admin/all`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

### ❌ Wrong Token Usage
```javascript
// WRONG! Token key is 'token', not 'adminToken'
const token = localStorage.getItem('adminToken');
```

---

## Dashboard Component Structure

### Folder Structure
```
dashboard/pages/
  feature/
    FeatureManager.js           // Main container
    sections/
      FeatureList.js            // List with CRUD
      FeatureBuilder.js         // Create/Edit form
      FeatureDetails.js         // View details (optional)
```

### FeatureManager.js Template
```javascript
import React, { useState } from 'react';
import FeatureList from './sections/FeatureList';
import FeatureBuilder from './sections/FeatureBuilder';

const FeatureManager = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleCreateNew = () => {
    setEditingItem(null);
    setShowBuilder(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowBuilder(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowBuilder(false);
  };

  const handleSaved = () => {
    setEditingItem(null);
    setShowBuilder(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
      {!showBuilder ? (
        <FeatureList onEdit={handleEdit} onCreateNew={handleCreateNew} />
      ) : (
        <FeatureBuilder 
          item={editingItem} 
          onCancel={handleCancel}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default FeatureManager;
```

---

## React Query Patterns

### List Component with CRUD
```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiEyeOff } from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FeatureList = ({ onEdit, onCreateNew }) => {
  const queryClient = useQueryClient();
  
  // Loading states for each action
  const [deleting, setDeleting] = useState(null);
  const [publishing, setPublishing] = useState(null);
  const [featuring, setFeaturing] = useState(null);

  // Fetch data
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['dashboard-features'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_BASE_URL}/api/features/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    }
  });

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    if (deleting === id) return; // Prevent double-click
    
    setDeleting(id);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/features/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await queryClient.invalidateQueries(['dashboard-features']); // MUST await!
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
    } finally {
      setDeleting(null);
    }
  };

  // Toggle publish handler
  const handleTogglePublish = async (id) => {
    if (publishing === id) return; // Prevent double-click
    
    setPublishing(id);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/features/admin/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await queryClient.invalidateQueries(['dashboard-features']);
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to update status');
    } finally {
      setPublishing(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Failed to load items. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Features</h1>
          <p className="text-gray-600 mt-1">Manage your features</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition"
        >
          <FiPlus className="w-5 h-5" />
          <span>Create New</span>
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No features found</p>
          <button
            onClick={onCreateNew}
            className="px-6 py-3 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition"
          >
            Create Your First Feature
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              
              {item.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Status badges */}
              <div className="flex gap-2 mb-4">
                {item.published && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Published
                  </span>
                )}
                {item.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Featured
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition"
                >
                  <FiEdit2 className="w-4 h-4 inline mr-2" />
                  Edit
                </button>

                <button
                  onClick={() => handleTogglePublish(item._id)}
                  disabled={publishing === item._id}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                    publishing === item._id
                      ? 'bg-gray-100 text-gray-500 cursor-wait'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                  }`}
                >
                  {publishing === item._id ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin inline-block" />
                  ) : item.published ? (
                    <FiEyeOff className="w-4 h-4 inline" />
                  ) : (
                    <FiEye className="w-4 h-4 inline" />
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deleting === item._id}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                    deleting === item._id
                      ? 'bg-gray-100 text-gray-500 cursor-wait'
                      : 'bg-white hover:bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  {deleting === item._id ? (
                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin inline-block" />
                  ) : (
                    <FiTrash2 className="w-4 h-4 inline" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureList;
```

---

## Form Builder Component Pattern

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FeatureBuilder = ({ item, onCancel, onSaved }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  // Initialize form data with fallbacks
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    settings: {
      published: item?.settings?.published || false,
      featured: item?.settings?.featured || false
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (item) {
        // Update existing
        await axios.put(
          `${API_BASE_URL}/api/features/admin/${item._id}`,
          formData,
          config
        );
      } else {
        // Create new
        await axios.post(
          `${API_BASE_URL}/api/features/admin`,
          formData,
          config
        );
      }
      
      await queryClient.invalidateQueries(['dashboard-features']);
      onSaved();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {item ? 'Edit Feature' : 'Create New Feature'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="Enter title"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="Enter description"
            />
          </div>

          {/* Checkboxes */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.settings?.published || false}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, published: e.target.checked }
                }))}
                className="w-4 h-4 text-[#FBB859] rounded focus:ring-2 focus:ring-[#FBB859]"
              />
              <span className="text-gray-700">Publish immediately</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-[#FBB859] hover:bg-[#e9a748] text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{item ? 'Update' : 'Create'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeatureBuilder;
```

---

## Optional Chaining Best Practices

### ✅ Always Use Optional Chaining for Nested Objects
```javascript
// CORRECT
const value = formData.settings?.theme?.primaryColor || '#FBB859';
const spots = event.registration?.spots?.available || 0;
const email = user?.profile?.contact?.email || '';

// Input fields
<input
  value={formData.registration?.spots?.available || 0}
  onChange={(e) => setFormData(prev => ({
    ...prev,
    registration: {
      ...prev.registration,
      spots: { ...(prev.registration?.spots || {}), available: parseInt(e.target.value) || 0 }
    }
  }))}
/>
```

### ❌ Don't Access Nested Properties Directly
```javascript
// WRONG - Will crash if registration or spots is undefined
const spots = event.registration.spots.available;
```

---

## Color Scheme Constants

```javascript
// Primary brand colors - use these consistently
const COLORS = {
  PRIMARY: '#FBB859',        // Orange
  PRIMARY_HOVER: '#e9a748',  // Darker orange
  SECONDARY: '#81C99C',      // Green
  TEXT: '#606161',           // Gray
  WHITE: '#FFFFFF',
  ERROR: '#EF4444',          // Red
  SUCCESS: '#10B981',        // Green
  INFO: '#3B82F6'            // Blue
};

// Tailwind classes
className="bg-[#FBB859] hover:bg-[#e9a748] text-white"
```

---

## Route Registration

### 1. Add to Dashboard.js
```javascript
// frontend/src/pages/Dashboard.js
import FeatureManager from '../components/dashboard/pages/feature/FeatureManager';

<Route path="/feature" element={<FeatureManager />} />
```

### 2. Add to Header.js Navigation
```javascript
// frontend/src/components/layout/Header.js
const navItems = isDashboardRoute
  ? [
      { name: 'Home', path: `/${dashboardPath}` },
      { name: 'Our Story', path: `/${dashboardPath}/our-story` },
      { name: 'Events', path: `/${dashboardPath}/events` },
      { name: 'Feature', path: `/${dashboardPath}/feature` }, // NEW
      { name: 'Forms', path: `/${dashboardPath}/forms` },
      // ...
    ]
  : [
      // public routes
    ];
```

### 3. Add Public Route (if needed)
```javascript
// frontend/src/AppContent.js
import FeaturePage from './pages/FeaturePage';

<Route path="/feature/:slug" element={<Layout><FeaturePage /></Layout>} />
```

---

## Common Mistakes to Avoid

### ❌ Wrong Token Key
```javascript
// WRONG
const token = localStorage.getItem('adminToken');

// CORRECT
const token = localStorage.getItem('token');
```

### ❌ Not Awaiting Query Invalidation
```javascript
// WRONG - fires async but doesn't wait
await axios.delete(url);
queryClient.invalidateQueries(['key']);

// CORRECT - waits for refetch
await axios.delete(url);
await queryClient.invalidateQueries(['key']);
```

### ❌ No Loading State
```javascript
// WRONG - button stays enabled during delete
<button onClick={handleDelete}>Delete</button>

// CORRECT - shows loading, prevents double-click
<button 
  onClick={handleDelete} 
  disabled={deleting === item._id}
>
  {deleting === item._id ? 'Deleting...' : 'Delete'}
</button>
```

### ❌ No Confirmation Dialog
```javascript
// WRONG - deletes immediately
const handleDelete = async (id) => {
  await axios.delete(`/api/items/${id}`);
};

// CORRECT - asks for confirmation
const handleDelete = async (id) => {
  if (!window.confirm('Are you sure?')) return;
  await axios.delete(`/api/items/${id}`);
};
```

### ❌ Missing Optional Chaining
```javascript
// WRONG - crashes if spots is undefined
value={formData.registration.spots.available}

// CORRECT - safe access
value={formData.registration?.spots?.available || 0}
```

---

## Loading States

### Spinner Component
```javascript
const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const colors = {
    blue: 'border-blue-600',
    orange: 'border-[#FBB859]',
    white: 'border-white',
    gray: 'border-gray-600'
  };
  
  return (
    <div className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
  );
};
```

### Button Loading State
```javascript
<button disabled={loading} className="...">
  {loading ? (
    <>
      <Spinner size="sm" color="white" />
      <span>Loading...</span>
    </>
  ) : (
    <span>Submit</span>
  )}
</button>
```

---

## Responsive Design

Always include responsive classes:

```javascript
// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flex layouts
<div className="flex flex-col md:flex-row gap-4">

// Text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Padding/spacing
<div className="p-4 md:p-6 lg:p-8">

// Hidden on mobile
<div className="hidden md:block">
```

---

## Performance Tips

1. **Use React Query's built-in caching** - data persists between route changes
2. **Debounce search inputs** - don't query on every keystroke
3. **Lazy load images** - use `loading="lazy"` attribute
4. **Code split large components** - use `React.lazy()` for routes
5. **Memoize expensive calculations** - use `useMemo` and `useCallback`

---

## Accessibility

1. **Add proper labels** to form inputs
2. **Use semantic HTML** (`<button>` not `<div onClick>`)
3. **Add alt text** to images
4. **Ensure keyboard navigation** works
5. **Use ARIA labels** for icon-only buttons

```javascript
<button aria-label="Delete item">
  <FiTrash2 />
</button>
```

---

## Quick Checklist for New Components

- [ ] Uses `localStorage.getItem('token')` for auth
- [ ] Has loading states for async operations
- [ ] Uses optional chaining for nested objects
- [ ] Awaits `queryClient.invalidateQueries()`
- [ ] Shows confirmation for destructive actions
- [ ] Includes error handling
- [ ] Mobile responsive
- [ ] Uses brand colors (#FBB859, etc.)
- [ ] Prevents double-click on buttons
- [ ] Has proper TypeScript/JSDoc comments
- [ ] Routes registered in Dashboard and Header
- [ ] No console errors or warnings

---

**Remember**: Follow patterns from existing components like `EventsList.js`, `FormsList.js`, or `BlogManager.js`!
