import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Aurora from './Aurora';
import Navigation from './Navigation';
import Footer from './Footer';
import postsData from '../generated/posts-data.js';
import './Blog.css';

export default function Blog() {
  const [activeTags, setActiveTags] = useState(new Set());

  useEffect(() => {
    document.title = 'Blog — Między kodem, a kulturą';
  }, []);

  const { posts, allTags } = postsData;

  const toggleTag = (tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const filteredPosts = useMemo(() => {
    if (activeTags.size === 0) return posts;
    return posts.filter((post) => post.tags.some((t) => activeTags.has(t)));
  }, [posts, activeTags]);

  return (
    <>
      <Aurora variant="subtle" />
      <Navigation />

      <div className="content">
        <div className="blog-header fade-in">
          <h1>Blog</h1>
          <p>Myśli o architekturze, kulturze i ewolucji oprogramowania</p>
        </div>

        {allTags.length > 0 && (
          <div className="tag-filter-bar fade-in">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`tag-filter-btn${activeTags.has(tag) ? ' active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="post-list">
          {filteredPosts.map((post, index) => (
            <Link
              key={post.slug}
              className="post-card fade-in"
              to={`/blog/${post.slug}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="post-card-date">{post.date}</div>
              <div className="post-card-title">{post.title}</div>
              {post.tags.length > 0 && (
                <div className="post-card-tags">
                  {post.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}
              {post.excerpt && (
                <div className="post-card-excerpt">{post.excerpt}</div>
              )}
            </Link>
          ))}

          {filteredPosts.length === 0 && activeTags.size > 0 && (
            <div className="empty-state">Brak wpisów dla wybranych tagów.</div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
