import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AdvancedImage } from "@cloudinary/react";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { auto } from "@cloudinary/url-gen/qualifiers/format";
import { auto as qAuto } from "@cloudinary/url-gen/qualifiers/quality";
import cld from "../lib/cloudinary";
import { useEffect, useState } from "react";

export default function Reader() {
  const { comicId: routeComicId, chapterId: routeChapterId } = useParams();
  const comicId = routeComicId || "hold-my-hand";
  const chapterId = routeChapterId || "1";
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChapterImages() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/chapter/${chapterId}?comic_id=${comicId}`);
        const data = await response.json();
        
        if (response.ok) {
          setImages(data.images);
        } else {
          // Fallback for demo purposes if API fails (e.g. missing keys)
          console.warn("API Error:", data);
          setError(data.details || "Failed to load images");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    }

    fetchChapterImages();
  }, [chapterId, comicId]);

  return (
    <div className="min-h-screen bg-comic-bg flex flex-col">
      {/* Comic Content Area */}
      <div className="flex-1 bg-gray-400/40 max-w-4xl mx-auto w-full shadow-2xl min-h-[80vh] flex flex-col items-center py-12">
        <h2 className="text-2xl font-serif mb-4 text-white">Chapter {chapterId}</h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p>Loading Chapter {chapterId}...</p>
          </div>
        ) : error ? (
          <div className="text-center text-white p-12 max-w-lg">
            <p className="text-xl font-bold mb-4 text-red-200">Configuration Needed</p>
            <p className="opacity-90 mb-6">{error}</p>
            <div className="bg-black/20 p-6 rounded-lg text-left text-sm">
              <p className="font-bold mb-2 text-blue-200">Current Configuration:</p>
              <ul className="mb-4 space-y-1 opacity-80">
                <li>Cloud Name: <code className="bg-black/40 px-1 rounded">{import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "Not Set (using 'demo')"}</code></li>
                <li>Comic ID: <code className="bg-black/40 px-1 rounded">{comicId}</code></li>
                <li>Chapter: <code className="bg-black/40 px-1 rounded">{chapterId}</code></li>
              </ul>

              <p className="font-bold mb-2">To enable auto-loading:</p>
              <ol className="list-decimal list-inside space-y-2 opacity-90">
                <li>Get your <strong>API Key</strong> and <strong>API Secret</strong> from Cloudinary Dashboard.</li>
                <li>Add them to your <code>.env</code> file:</li>
                <pre className="bg-black/40 p-2 rounded mt-2 overflow-x-auto">
                  CLOUDINARY_API_KEY=...{"\n"}
                  CLOUDINARY_API_SECRET=...
                </pre>
                <li>Upload images to one of these folders in Cloudinary:</li>
                <pre className="bg-black/40 p-2 rounded mt-2 overflow-x-auto text-xs">
                  {comicId}/Chapter{chapterId}{"\n"}
                  {comicId}/chapter{chapterId}{"\n"}
                  {/* Show Title-Case option if different */}
                  {comicId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-') !== comicId && (
                    <>
                      {comicId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')}/Chapter{chapterId}{"\n"}
                    </>
                  )}
                </pre>
              </ol>
            </div>
          </div>
        ) : images.length > 0 ? (
          <div className="w-full flex flex-col gap-0 bg-white">
            {images.map((publicId, index) => {
              const myImage = cld.image(publicId)
                .resize(scale().width(1000))
                .delivery(format(auto()))
                .delivery(quality(qAuto()));
              
              return (
                <div key={index} className="w-full">
                  <AdvancedImage 
                    cldImg={myImage} 
                    className="w-full h-auto block" 
                    alt={`Page ${index + 1}`} 
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-white p-12">
            <p className="opacity-80 mb-4">No images found in Cloudinary folders:</p>
            <code className="block bg-black/20 p-3 rounded mb-4 text-sm">
              {comicId}/Chapter{chapterId} <br/>
              {comicId}/chapter{chapterId} <br/>
              {comicId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-') !== comicId && (
                <>
                  {comicId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')}/Chapter{chapterId}
                </>
              )}
            </code>
            <p className="opacity-60 text-sm">
              Upload images to one of these folders in Cloudinary to see them here.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center py-12 px-4">
        <Link 
          to={`/read/${comicId}/${Number(chapterId) - 1}`}
          className={`flex items-center gap-2 font-serif text-2xl text-comic-text hover:text-comic-accent transition-colors ${Number(chapterId) <= 1 ? 'invisible' : ''}`}
        >
          <ChevronLeft className="w-8 h-8" />
          Previous
        </Link>
        
        <Link 
          to={`/read/${comicId}/${Number(chapterId) + 1}`}
          className="flex items-center gap-2 font-serif text-2xl text-comic-text hover:text-comic-accent transition-colors"
        >
          Next
          <ChevronRight className="w-8 h-8" />
        </Link>
      </div>
    </div>
  );
}
