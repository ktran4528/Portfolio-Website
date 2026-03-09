import { Link } from "react-router-dom";
import { Plus, Loader2, Trash2, Image as ImageIcon, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import cld from "../lib/cloudinary";
import { useAuth } from "../lib/AuthContext";

interface Comic {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  status: string;
}

export default function Series() {
  const { isAdmin } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{id: string, title: string} | null>(null);
  const [showThumbnailModal, setShowThumbnailModal] = useState<{id: string, title: string} | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Form state
  const [newId, setNewId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStatus, setNewStatus] = useState("Ongoing");

  useEffect(() => {
    fetchComics();
  }, []);

  const fetchComics = async () => {
    try {
      const res = await fetch("/api/comics");
      if (res.ok) {
        const data = await res.json();
        setComics(data);
      }
    } catch (err) {
      console.error("Failed to fetch comics", err);
    }
  };

  const handleDeleteComic = async (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmation({ id, title });
  };

  const executeDelete = async () => {
    if (!deleteConfirmation) return;
    
    const { id } = deleteConfirmation;
    setDeletingId(id);
    setDeleteConfirmation(null);

    try {
      const res = await fetch(`/api/comics/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchComics();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete comic");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting comic");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateComic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/comics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId.toLowerCase().replace(/\s+/g, '-'),
          title: newTitle,
          description: newDesc,
          status: newStatus
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewId("");
        setNewTitle("");
        setNewDesc("");
        setNewStatus("Ongoing");
        await fetchComics();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create comic");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating comic");
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showThumbnailModal || !thumbnailFile) return;

    setUploadingThumbnail(true);
    const formData = new FormData();
    formData.append("image", thumbnailFile);

    try {
      const res = await fetch(`/api/comics/${showThumbnailModal.id}/thumbnail`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setShowThumbnailModal(null);
        setThumbnailFile(null);
        fetchComics();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to upload thumbnail");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading thumbnail");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const renderThumbnail = (url: string, className: string) => {
    if (url?.startsWith("cld:")) {
      const publicId = url.replace("cld:", "");
      const myImage = cld.image(publicId);
      myImage.resize(fill().width(600).height(800));
      return (
        <AdvancedImage 
          cldImg={myImage} 
          className={className}
        />
      );
    }
    return (
      <img 
        src={url || `https://picsum.photos/seed/comic/600/800`} 
        alt="Thumbnail"
        className={className}
        referrerPolicy="no-referrer"
      />
    );
  };

  return (
    <div className="min-h-screen bg-comic-bg text-comic-text relative overflow-hidden pt-12">
      {/* Admin Create Button */}
      {isAdmin && (
        <div className="max-w-6xl mx-auto px-4 mb-8 flex justify-end">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-comic-accent text-white px-6 py-2 rounded-full hover:bg-comic-text transition-colors shadow-md z-20"
          >
            <Plus size={20} /> Create New Comic
          </button>
        </div>
      )}

      {/* Create Comic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white text-black p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl mb-6 font-bold font-serif text-comic-text">Create New Comic</h2>
            <form onSubmit={handleCreateComic} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Comic Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newId) setNewId(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-comic-accent outline-none"
                  placeholder="e.g. Falling Rain"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Comic ID (URL Slug)</label>
                <input 
                  type="text" 
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-comic-accent outline-none"
                  placeholder="e.g. falling-rain"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-comic-accent outline-none h-24"
                  placeholder="What is this story about?"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Status</label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-comic-accent outline-none"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Coming Soon">Coming Soon</option>
                  <option value="Hiatus">Hiatus</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`px-6 py-2 bg-comic-accent text-white rounded-lg hover:bg-comic-text transition-colors font-medium flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Creating...
                    </>
                  ) : (
                    "Create Comic"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thumbnail Edit Modal */}
      {showThumbnailModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[120] p-4">
          <div className="bg-white text-black p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl mb-6 font-bold font-serif text-comic-text">Update Thumbnail</h2>
            <p className="mb-4 text-sm text-gray-500">Changing thumbnail for: <strong>{showThumbnailModal.title}</strong></p>
            
            <form onSubmit={handleThumbnailUpload} className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-comic-accent transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
                {thumbnailFile ? (
                  <div className="flex flex-col items-center gap-2 text-comic-accent font-medium">
                    <ImageIcon size={48} className="mb-2" />
                    <span className="text-sm break-all">{thumbnailFile.name}</span>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <Upload className="mx-auto mb-4" size={48} />
                    <p className="font-medium">Click or drag to upload new thumbnail</p>
                    <p className="text-xs mt-2">Recommended: 3:4 aspect ratio</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowThumbnailModal(null);
                    setThumbnailFile(null);
                  }}
                  className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploadingThumbnail || !thumbnailFile}
                  className={`px-8 py-2 bg-comic-accent text-white rounded-xl hover:bg-comic-text transition-all font-medium flex items-center gap-2 shadow-lg ${uploadingThumbnail || !thumbnailFile ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                >
                  {uploadingThumbnail ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Uploading...
                    </>
                  ) : (
                    "Save Thumbnail"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {comics.length > 0 ? (
        <>
          {/* Delete Confirmation Modal */}
          {deleteConfirmation && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4">
              <div className="bg-white text-black p-6 rounded-2xl shadow-2xl w-full max-w-sm">
                <h3 className="text-2xl font-bold mb-3 text-red-600 font-serif">Delete Comic?</h3>
                <p className="mb-6 text-gray-700 leading-relaxed">
                  Are you sure you want to delete <strong>{deleteConfirmation.title}</strong>? <br/>
                  <span className="text-sm text-red-500 mt-2 block font-medium">This will also permanently delete all episodes associated with it.</span>
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setDeleteConfirmation(null)}
                    className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-md"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Featured Comic Section (Dynamic Hero) */}
          <div className="relative z-10 max-w-3xl mx-auto px-4 pb-16 flex flex-col items-center text-center">
            <h1 className="font-script text-5xl md:text-6xl text-comic-accent mb-6 w-full">
              {comics[0].title}
            </h1>
            
            {/* Featured Image */}
            <div className="w-full max-w-[320px] aspect-[3/4] bg-gray-400/30 rounded-2xl overflow-hidden shadow-2xl mb-8 transform hover:scale-[1.02] transition-transform duration-500">
              {renderThumbnail(comics[0].thumbnail_url, "w-full h-full object-cover")}
            </div>

            <div className="max-w-xl space-y-6">
              <p className="font-serif text-lg md:text-xl leading-relaxed opacity-90">
                {comics[0].description || "No description provided yet."}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link 
                  to={`/series/${comics[0].id}/episodes`}
                  className="inline-block bg-comic-nav text-white font-serif text-xl px-8 md:px-12 py-3 rounded-full hover:bg-comic-accent transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
                >
                  Start Reading
                </Link>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowThumbnailModal({ id: comics[0].id, title: comics[0].title })}
                      className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition-all shadow-md hover:scale-110 active:scale-90"
                      title="Edit Thumbnail"
                    >
                      <ImageIcon size={22} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteComic(comics[0].id, comics[0].title, e)}
                      disabled={deletingId === comics[0].id}
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-700 transition-all shadow-md disabled:opacity-50 hover:scale-110 active:scale-90"
                      title="Delete Comic"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Other Comics Section (Dynamic Grid) */}
          {comics.length > 1 && (
            <div className="max-w-6xl mx-auto px-4 pb-20">
              <h2 className="font-script text-5xl text-comic-text mb-8 border-b border-comic-nav/30 pb-4">More Stories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {comics.slice(1).map((comic) => (
                  <div key={comic.id} className="relative group">
                    <Link to={`/series/${comic.id}/episodes`} className="block">
                      <div className="aspect-[3/4] bg-white/40 rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all relative">
                        {renderThumbnail(comic.thumbnail_url, "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500")}
                        
                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowThumbnailModal({ id: comic.id, title: comic.title });
                              }}
                              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition-all"
                              title="Edit Thumbnail"
                            >
                              <ImageIcon size={14} />
                            </button>
                            <button 
                              onClick={(e) => handleDeleteComic(comic.id, comic.title, e)}
                              disabled={deletingId === comic.id}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700 transition-all disabled:opacity-50"
                              title="Delete Comic"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      <h3 className="font-serif text-lg text-center group-hover:text-comic-accent transition-colors">{comic.title}</h3>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-32 text-center">
          <h1 className="font-script text-6xl text-comic-text mb-4">Welcome to the Comic Library</h1>
          <p className="font-serif text-xl opacity-60">
            {isAdmin ? "Click the button above to add your first comic!" : "No comics have been added yet. Check back soon!"}
          </p>
        </div>
      )}
    </div>
  );
}
