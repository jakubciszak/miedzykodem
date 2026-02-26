import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Aurora from './Aurora';
import Navigation from './Navigation';
import Footer from './Footer';
import postsData from '../generated/posts-data.js';
import 'highlight.js/styles/github-dark.css';
import './BlogPost.css';

export default function BlogPost() {
  const { slug } = useParams();

  const post = useMemo(() => {
    return postsData.posts.find((p) => p.slug === slug);
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — Blog`;
    } else {
      document.title = 'Nie znaleziono — Blog';
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return (
      <>
        <Aurora variant="subtle" />
        <Navigation />
        <div className="content">
          <div className="empty-state">Nie znaleziono wpisu.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Aurora variant="subtle" />
      <Navigation />

      <div className="content">
        <Link to="/blog" className="post-back fade-in">&larr; Wróć do listy</Link>

        <article className="fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="post-meta">
            <div className="post-meta-date">{post.date}</div>
            <h1>{post.title}</h1>
            {post.tags.length > 0 && (
              <div className="post-meta-tags">
                {post.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            )}
          </div>

          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />
        </article>

        <Footer />
      </div>
    </>
  );
}
