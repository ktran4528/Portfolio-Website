import { Instagram, Mail, Upload, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";

export default function About() {
  const { isAdmin } = useAuth();
  const [aboutImage, setAboutImage] = useState("https://picsum.photos/seed/about/800/800");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAboutImage();
  }, []);

  const fetchAboutImage = async () => {
    try {
      const res = await fetch("/api/settings/about_image");
      if (res.ok) {
        const data = await res.json();
        setAboutImage(data.value);
      }
    } catch (err) {
      console.error("Failed to fetch about image:", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/settings/about_image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAboutImage(data.value);
      } else {
        alert("Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-comic-bg text-comic-text p-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <h1 className="font-script text-7xl md:text-8xl text-comic-text">Rain</h1>
          
          <p className="font-serif text-xl leading-relaxed opacity-90">
            "Hey! I'm Rain, and I love drawing and cats. Thank you so much for reading this and supporting me in doing what I love! I'm always open to criticism, if you'd like you can shoot me an email or message me on instagram about your thoughts! Since this is my first webcomic, please be kind and expect some mistakes - as it's pretty much just me working on this!"
          </p>
          
          <div className="pt-8">
            <p className="font-serif text-xl mb-4">Follow me or reach out and say hi!</p>
            <div className="flex gap-6">
              <a 
                href="https://www.instagram.com/xfallingraindropletx?igsh=MWcxZDczdnNndXpqOA==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-comic-text hover:text-comic-accent transition-colors"
              >
                <Instagram className="w-10 h-10" />
              </a>
              <a 
                href="mailto:fallingraindroplet@gmail.com" 
                className="text-comic-text hover:text-comic-accent transition-colors"
              >
                <Mail className="w-10 h-10" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="aspect-square bg-gray-400/30 rounded-lg flex items-center justify-center text-white/50 font-sans p-4 shadow-lg overflow-hidden">
             <img 
                src={aboutImage} 
                alt="More cool art" 
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
          </div>
          
          {isAdmin && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
              <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-comic-accent hover:text-white transition-all shadow-xl">
                {uploading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                <span>{uploading ? "Uploading..." : "Change Image"}</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
