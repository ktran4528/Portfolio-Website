import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Loader2, Trash2, X } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

interface GalleryItem {
  id: number;
  image_url: string;
  description: string;
  created_at: string;
}

export default function Gallery() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to fetch gallery", err);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (items.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }
  };

  const prev = () => {
    if (items.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    }
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setShowAddModal(false);
        setFile(null);
        setDescription("");
        fetchGallery();
      } else {
        const data = await res.json();
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchGallery();
        if (currentIndex >= items.length - 1) {
          setCurrentIndex(Math.max(0, items.length - 2));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-comic-bg text-comic-text p-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <h1 className="font-script text-7xl md:text-8xl text-comic-text">Gallery</h1>
        {isAdmin && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-comic-accent text-white px-6 py-2 rounded-full hover:bg-comic-text transition-colors shadow-md"
          >
            <Plus size={20} /> Add Picture
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-12 h-12 text-comic-accent" />
        </div>
      ) : items.length > 0 ? (
        <div className="max-w-5xl mx-auto relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <div className="flex items-center justify-center gap-4 w-full md:w-auto order-2 md:order-1">
            <button onClick={prev} className="p-3 bg-comic-nav/10 hover:bg-comic-nav/20 rounded-full transition-colors shrink-0">
              <ChevronLeft className="w-8 h-8 md:w-12 md:h-12 text-comic-accent" />
            </button>
          </div>
          
          <div className="w-full aspect-[4/5] md:aspect-video bg-gray-400/20 rounded-lg overflow-hidden shadow-xl relative group order-1 md:order-2">
            <img 
              src={items[currentIndex].image_url} 
              alt="Gallery Art" 
              className="w-full h-full object-contain bg-black/5"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay for description and delete */}
            <div className="absolute inset-0 flex flex-col items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white p-6">
              <p className="font-serif text-xl md:text-2xl mb-4 text-center leading-relaxed">{items[currentIndex].description}</p>
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(items[currentIndex].id)}
                  className="bg-red-500 hover:bg-red-600 p-3 rounded-full transition-all hover:scale-110 active:scale-90 shadow-lg"
                  title="Delete Image"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>
            
            {/* Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-1.5 rounded-full text-sm font-mono backdrop-blur-sm">
              {currentIndex + 1} / {items.length}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 w-full md:w-auto order-3">
            <button onClick={next} className="p-3 bg-comic-nav/10 hover:bg-comic-nav/20 rounded-full transition-colors shrink-0">
              <ChevronRight className="w-8 h-8 md:w-12 md:h-12 text-comic-accent" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-32 opacity-60">
          <p className="text-2xl font-serif">The gallery is currently empty.</p>
          {isAdmin && <p className="mt-2">Click "Add Picture" to start your collection.</p>}
        </div>
      )}

      {/* Add Picture Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white text-black p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-3xl mb-6 font-bold font-serif text-comic-text">Add to Gallery</h2>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-600">Select Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-comic-accent transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-comic-accent font-medium">
                      <Plus size={18} /> {file.name}
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <Plus className="mx-auto mb-2" size={32} />
                      <p>Click or drag to upload image</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-600">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-comic-accent outline-none h-32 transition-colors resize-none"
                  placeholder="Tell the story behind this piece..."
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploading || !file}
                  className={`px-8 py-2 bg-comic-accent text-white rounded-xl hover:bg-comic-text transition-all font-medium flex items-center gap-2 shadow-lg ${uploading || !file ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Uploading...
                    </>
                  ) : (
                    "Post Image"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
