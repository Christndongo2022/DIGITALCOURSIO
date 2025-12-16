
import React, { useState } from 'react';
import { Calendar, User as UserIcon, MessageSquare, Send, ChevronRight, ArrowLeft } from 'lucide-react';
import { MOCK_BLOG, MOCK_COMMENTS } from '../constants';
import { BlogPost, BlogComment } from '../types';

interface BlogProps {
  onNavigate: (page: string) => void;
}

export const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>(MOCK_COMMENTS);
  
  // New Comment State
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  const publishedPosts = MOCK_BLOG.filter(p => p.status === 'PUBLISHED');

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setSubmitMessage('');
    setNewCommentContent('');
    window.scrollTo(0, 0);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    const newComment: BlogComment = {
      id: Math.random().toString(36).substr(2, 9),
      postId: selectedPost.id,
      authorName: newCommentAuthor || 'Anonyme',
      content: newCommentContent,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING' // Default status requiring admin validation
    };

    setComments([...comments, newComment]);
    setNewCommentContent('');
    setNewCommentAuthor('');
    setSubmitMessage("Votre commentaire a été envoyé ! Il sera visible après validation par un modérateur.");
  };

  const getPostComments = (postId: string) => {
    return comments.filter(c => c.postId === postId && c.status === 'APPROVED');
  };

  // --- Article Detail View ---
  if (selectedPost) {
    const postComments = getPostComments(selectedPost.id);
    
    return (
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <button 
            onClick={() => setSelectedPost(null)} 
            className="flex items-center text-royal font-bold mb-6 hover:underline"
          >
            <ArrowLeft size={16} className="mr-2"/> Retour aux articles
          </button>
          
          <article className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            {selectedPost.image && (
              <div className="h-64 md:h-80 w-full overflow-hidden">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold text-xs">{selectedPost.category}</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> {selectedPost.date}</span>
                <span className="flex items-center gap-1"><UserIcon size={14}/> {selectedPost.author}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-royal-dark mb-6">{selectedPost.title}</h1>
              <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedPost.content}
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MessageSquare className="text-royal"/> Commentaires ({postComments.length})
            </h3>

            {/* List */}
            <div className="space-y-6 mb-8">
              {postComments.length === 0 ? (
                <p className="text-gray-500 italic text-sm">Soyez le premier à commenter cet article.</p>
              ) : (
                postComments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-royal-dark text-sm">{comment.authorName}</span>
                      <span className="text-xs text-gray-400">{comment.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Form */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="font-bold text-sm text-gray-700 mb-4 uppercase">Laisser une suggestion ou un avis</h4>
              {submitMessage ? (
                <div className="bg-green-100 text-green-700 p-3 rounded text-sm mb-4">
                  {submitMessage}
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit}>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input 
                      type="text" 
                      placeholder="Votre nom (Public)" 
                      value={newCommentAuthor}
                      onChange={(e) => setNewCommentAuthor(e.target.value)}
                      className="w-full border p-2 rounded focus:border-royal outline-none text-sm"
                      required
                    />
                  </div>
                  <textarea 
                    placeholder="Votre commentaire, question ou suggestion..." 
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    className="w-full border p-2 rounded focus:border-royal outline-none text-sm h-24 mb-4"
                    required
                  ></textarea>
                  <button 
                    type="submit" 
                    className="bg-royal text-white px-6 py-2 rounded font-bold text-sm hover:bg-blue-700 flex items-center gap-2 transition"
                  >
                    <Send size={14}/> Envoyer pour validation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Blog List View ---
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-royal mb-4 uppercase">Actualités & Guides</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Retrouvez toutes les informations sur les démarches administratives, les nouveautés de la plateforme et nos conseils d'experts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedPosts.map(post => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col group cursor-pointer"
              onClick={() => handlePostClick(post)}
            >
              <div className="h-48 overflow-hidden bg-gray-200 relative">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-royal-dark text-white">
                    <MessageSquare size={48} opacity={0.5}/>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-gold text-royal-dark text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                   <Calendar size={12}/> {post.date}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-royal transition">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
                
                <div className="flex items-center text-royal font-bold text-sm mt-auto">
                  Lire la suite <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition"/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
