import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { Lock, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function Navigation() {
  const location = useLocation();
  const { isAdmin, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isActive = (path: string) => {
    return location.pathname === path ? "font-bold border-b-2 border-white" : "";
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Comics", path: "/series" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        login();
        setShowLogin(false);
      } else {
        alert("Invalid credentials");
        setShowLogin(false); // Close modal on wrong login as requested
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
      setShowLogin(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-comic-nav py-4 px-6 md:px-8 flex justify-between items-center text-white text-xl font-serif sticky top-0 z-50 shadow-sm">
      {/* Admin Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white text-black p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl mb-4 font-bold">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowLogin(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-comic-accent text-white rounded hover:bg-comic-text"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {isAdmin ? (
          <button onClick={handleLogout} className="text-sm flex items-center gap-1 opacity-70 hover:opacity-100">
            <LogOut size={16} /> <span className="hidden sm:inline">Admin Logout</span>
          </button>
        ) : (
          <button onClick={() => setShowLogin(true)} className="text-sm flex items-center gap-1 opacity-50 hover:opacity-100">
            <Lock size={16} /> <span className="hidden sm:inline">Admin</span>
          </button>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link, index) => (
          <React.Fragment key={link.path}>
            <Link 
              to={link.path} 
              className={`hover:text-white/80 transition-colors ${isActive(link.path)}`}
            >
              {link.name}
            </Link>
            {index < navLinks.length - 1 && <span className="text-white/50">|</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-comic-nav border-t border-white/10 md:hidden flex flex-col p-4 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              onClick={() => setIsMenuOpen(false)}
              className={`hover:text-white/80 transition-colors py-2 text-center ${isActive(link.path)}`}
            >
              {link.name}
            </Link>
          ))}
          {!isAdmin && (
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                setShowLogin(true);
              }}
              className="text-sm flex items-center justify-center gap-1 opacity-50 hover:opacity-100 py-2 border-t border-white/5"
            >
              <Lock size={14} /> Admin Login
            </button>
          )}
          {isAdmin && (
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="text-sm flex items-center justify-center gap-1 opacity-70 hover:opacity-100 py-2 border-t border-white/5"
            >
              <LogOut size={14} /> Admin Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
