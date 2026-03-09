import { Link, useParams } from "react-router-dom";
import { ChevronRight, Trash2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import cld from "../lib/cloudinary";
import { useAuth } from "../lib/AuthContext";

interface Episode {
  id: number;
  chapter_number: number;
  title: string;
  thumbnail_url: string;
}

export default function Episodes() {
  const { id } = useParams();
  const comicId = id || "hold-my-hand";
  const { isAdmin } = useAuth();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChapterNum, setNewChapterNum] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/episodes?comic_id=${comicId}`);
      if (res.ok) {
        const data = await res.json();
        setEpisodes(data);
      } else {
        setError("Failed to load episodes");
      }
    } catch (err) {
      console.error("Failed to fetch episodes", err);
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{id: number, title: string} | null>(null);

  const confirmDelete = (id: number, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmation({ id, title });
  };

  const executeDelete = async () => {
    if (!deleteConfirmation) return;
    
    const { id } = deleteConfirmation;
    setDeletingId(id);
    setDeleteConfirmation(null); // Close modal

    try {
      const res = await fetch(`/api/episodes/${id}`, { method: "DELETE" });
      
      if (res.ok) {
        await fetchEpisodes();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting episode");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    // Deprecated in favor of confirmDelete
  };

  const handleAddEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter_number: parseInt(newChapterNum),
          title: newTitle,
          comic_id: comicId
        }),
      });
      
      if (res.ok) {
        setShowAddModal(false);
        setNewChapterNum("");
        setNewTitle("");
        fetchEpisodes();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add episode");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding episode");
    }
  };

  const renderThumbnail = (url: string) => {
    if (url.startsWith("cld:")) {
      const publicId = url.replace("cld:", "");
      const myImage = cld.image(publicId);
      myImage.resize(fill().width(300).height(300));
      return (
        <AdvancedImage 
          cldImg={myImage} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      );
    }
    return (
      <img 
        src={url} 
        alt="Thumbnail"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
    );
  };

  return (
    <div className="min-h-screen bg-comic-bg text-comic-text p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-4xl text-comic-text">Season 1</h2>
            <ChevronRight className="w-8 h-8 text-comic-accent" />
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-comic-accent text-white px-4 py-2 rounded-full hover:bg-comic-text transition-colors"
            >
              <Plus size={20} /> Add Episode
            </button>
          )}
        </div>

        {/* Add Episode Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white text-black p-8 rounded-lg shadow-xl w-96">
              <h2 className="text-2xl mb-4 font-bold">Add New Episode</h2>
              <form onSubmit={handleAddEpisode} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Chapter Number</label>
                  <input 
                    type="number" 
                    value={newChapterNum}
                    onChange={(e) => setNewChapterNum(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Will search Cloudinary for folders: 
                    <code className="block mt-1 bg-gray-100 p-1 rounded">
                      {comicId}/Chapter{newChapterNum} <br/>
                      {comicId}/chapter{newChapterNum} <br/>
                      {comicId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-') !== comicId && (
                        <>
                          {comicId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')}/Chapter{newChapterNum}
                        </>
                      )}
                    </code>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Title</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-comic-accent text-white rounded hover:bg-comic-text"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-white opacity-60">
            <p className="text-xl animate-pulse">Loading episodes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-300">
            <p className="text-xl">{error}</p>
            <button onClick={fetchEpisodes} className="mt-4 underline hover:text-white">Try Again</button>
          </div>
        ) : (
          <>
            {episodes.length === 0 ? (
              <div className="text-center py-20 text-white opacity-60">
                <p className="text-xl">No episodes found.</p>
                {isAdmin && <p className="mt-2 text-sm">Click "Add Episode" to create one.</p>}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {episodes.map((ep) => (
                  <div key={ep.id} className="relative group">
                    <div className="aspect-square bg-gray-300 mb-4 overflow-hidden rounded-md shadow-sm group-hover:shadow-md transition-all relative">
                      <Link to={`/read/${comicId}/${ep.chapter_number}`} className="block w-full h-full">
                        {renderThumbnail(ep.thumbnail_url)}
                      </Link>
                      
                      {/* Admin Delete Button */}
                      {isAdmin && (
                        <button 
                          onClick={(e) => confirmDelete(ep.id, ep.title, e)}
                          disabled={deletingId === ep.id}
                          className={`absolute top-2 right-2 p-2 rounded-full transition-all z-10 ${
                            deletingId === ep.id 
                              ? "bg-gray-500 opacity-100 cursor-wait" 
                              : "bg-red-500 text-white opacity-0 group-hover:opacity-100 hover:bg-red-700"
                          }`}
                          title="Delete Episode"
                        >
                          {deletingId === ep.id ? (
                            <span className="text-xs font-bold">...</span>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      )}
                    </div>
                    
                    <Link to={`/read/${comicId}/${ep.chapter_number}`} className="block">
                      <h3 className="font-serif text-center text-lg group-hover:text-comic-accent transition-colors">
                        {ep.title}
                      </h3>
                      <p className="text-center text-sm opacity-60">Chapter {ep.chapter_number}</p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110]">
            <div className="bg-white text-black p-6 rounded-lg shadow-xl w-80 max-w-full mx-4">
              <h3 className="text-xl font-bold mb-2 text-red-600">Delete Episode?</h3>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete <strong>{deleteConfirmation.title}</strong>? This cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
