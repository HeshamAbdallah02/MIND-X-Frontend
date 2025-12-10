// frontend/src/components/member-profile/MemberProfileContainer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiUser, FiArrowLeft, FiCalendar, FiClock, FiBookOpen, FiAlertCircle } from 'react-icons/fi';
import useMemberProfile from './hooks/useMemberProfile';
import './MemberProfile.css';

const MemberProfileContainer = () => {
    const { member, isLoading, error } = useMemberProfile();

    // Loading state
    if (isLoading) {
        return (
            <div className="member-profile">
                <div className="member-profile__loading">
                    <div className="member-profile__spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !member) {
        return (
            <div className="member-profile">
                <div className="member-profile__error">
                    <div className="member-profile__error-icon">
                        <FiAlertCircle />
                    </div>
                    <h2>Member Not Found</h2>
                    <p>The profile you're looking for doesn't exist or has been removed.</p>
                    <Link to="/crew" className="member-profile__back-btn">
                        <FiArrowLeft />
                        Back to Crew
                    </Link>
                </div>
            </div>
        );
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <Helmet>
                <title>{member.name} | MIND-X Team</title>
                <meta name="description" content={member.bio || `${member.name} - ${member.fullPosition || member.position} at MIND-X`} />
            </Helmet>

            <div className="member-profile">
                <div className="member-profile__container">
                    {/* Back Button */}
                    <Link to="/crew" className="member-profile__back-btn" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
                        <FiArrowLeft />
                        Back to Crew
                    </Link>

                    {/* Header Section */}
                    <header className="member-profile__header">
                        <div className="member-profile__avatar">
                            {member.avatar?.url ? (
                                <img src={member.avatar.url} alt={member.name} />
                            ) : (
                                <div className="member-profile__avatar-placeholder">
                                    <FiUser />
                                </div>
                            )}
                        </div>

                        <h1 className="member-profile__name">{member.name}</h1>

                        <div className="member-profile__position">
                            {member.fullPosition || member.position}
                        </div>

                        {member.section && (
                            <p className="member-profile__section">{member.section}</p>
                        )}
                    </header>

                    {/* Bio Section */}
                    {member.bio && (
                        <section className="member-profile__bio">
                            <h2>About</h2>
                            <p>{member.bio}</p>
                        </section>
                    )}

                    {/* Blogs Section */}
                    <section className="member-profile__blogs">
                        <h2>
                            <FiBookOpen />
                            Blogs Written
                        </h2>

                        {member.blogs && member.blogs.length > 0 ? (
                            <div className="member-profile__blogs-grid">
                                {member.blogs.map((blog) => (
                                    <Link
                                        key={blog._id}
                                        to={`/blog/${blog.slug}`}
                                        className="member-profile__blog-card"
                                    >
                                        <div className="member-profile__blog-image">
                                            {blog.coverImage?.url && (
                                                <img src={blog.coverImage.url} alt={blog.title} />
                                            )}
                                        </div>
                                        <div className="member-profile__blog-content">
                                            {blog.category && (
                                                <span className="member-profile__blog-category">
                                                    {blog.category}
                                                </span>
                                            )}
                                            <h3 className="member-profile__blog-title">{blog.title}</h3>
                                            <div className="member-profile__blog-meta">
                                                {blog.publishedAt && (
                                                    <span>
                                                        <FiCalendar style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                                        {formatDate(blog.publishedAt)}
                                                    </span>
                                                )}
                                                {blog.readTime && (
                                                    <span>
                                                        <FiClock style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                                        {blog.readTime} min read
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="member-profile__empty-blogs">
                                <p>No blogs written yet.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
};

export default MemberProfileContainer;
