'use client'; 

import { useState } from 'react';
import { useUser, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function SellerPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // ✨ State for Multiple Sizes
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  async function handleSubmit(e: any) {
    e.preventDefault(); 
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.target);

    // 👇 Clerk Email automatically add ho raha hai
    if (user?.primaryEmailAddress?.emailAddress) {
        formData.append("sellerEmail", user.primaryEmailAddress.emailAddress);
    }

    // 👇 Sizes ko JSON string bana kar bhej rahe hain
    formData.append("sizes", JSON.stringify(selectedSizes));

    try {
      const response = await fetch('/api/create-product', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Product submitted successfully! Waiting for approval.');
        e.target.reset(); 
        setSelectedSizes([]); // Reset checkboxes
      } else {
        setMessage('❌ Error: ' + (data.error || 'Something went wrong'));
      }
    } catch (error) {
      setMessage('❌ Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center p-6 py-20">
      
      <SignedOut>
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full border border-[#D4A373]/20">
          <h1 className="text-3xl font-serif font-bold mb-4">Seller Portal</h1>
          <p className="text-gray-500 mb-8">You need to sign in to upload products.</p>
          <SignInButton mode="modal" forceRedirectUrl="/en/seller">
            <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-[#D4A373] transition-all w-full">
              Sign In with Google
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gray-100 relative mt-10">
          
          <div className="absolute top-4 right-4">
            <UserButton afterSignOutUrl="/en/collection"/>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-serif font-bold text-[#2C2C2C]">Welcome, {user?.firstName}!</h1>
            <p className="text-xs text-[#D4A373] font-bold tracking-widest uppercase mt-2">New Product Listing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Product Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
              <input type="text" name="name" required placeholder="e.g. Royal Silk Kaftan"
                className="w-full p-3 border border-gray-100 rounded bg-gray-50/50 focus:outline-none focus:border-[#D4A373] text-sm transition-all"
              />
            </div>

            {/* 2. Price */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Price (DHS)</label>
              <input type="text" name="price" required placeholder="e.g. 850"
                className="w-full p-3 border border-gray-100 rounded bg-gray-50/50 focus:outline-none focus:border-[#D4A373] text-sm"
              />
            </div>

            {/* 📏 3. SIZE SELECTION */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {allSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeChange(size)}
                    className={`h-10 w-12 text-xs font-bold border transition-all duration-300 ${
                      selectedSizes.includes(size) 
                      ? 'bg-[#2C2C2C] text-white border-[#2C2C2C] shadow-md' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-[#D4A373] hover:text-[#D4A373]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* 🎨 4. COLOR INPUT */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Color Name</label>
              <input type="text" name="colorName" placeholder="e.g. Midnight Black"
                className="w-full p-3 border border-gray-100 rounded bg-gray-50/50 focus:outline-none focus:border-[#D4A373] text-sm"
              />
            </div>

            {/* 5. Category */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
              <select name="category" className="w-full p-3 border border-gray-100 rounded bg-gray-50/50 focus:outline-none focus:border-[#D4A373] text-sm cursor-pointer">
                <option value="Collection 2024">Collection 2024</option>
                <option value="Dresses">Dresses</option>
                <option value="Sets">Sets</option>
                <option value="Abayas">Abayas</option>
              </select>
            </div>

            <hr className="border-gray-50 my-2" />

            {/* 📸 6. MAIN IMAGE */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Cover Photo (Main)</label>
              <input type="file" name="image" accept="image/*" required 
                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-[#2C2C2C] file:text-white hover:file:bg-[#D4A373] transition-all cursor-pointer"
              />
            </div>

            {/* 🎞️ 7. NEW: GALLERY IMAGES */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Additional Photos (Gallery)</label>
              <input 
                type="file" 
                name="gallery" 
                accept="image/*" 
                multiple // 👈 MULTIPLE SELECTION ENABLED
                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 transition-all cursor-pointer"
              />
              <p className="text-[9px] text-gray-400 mt-2 italic">* Select multiple files for the slider.</p>
            </div>

            {message && (
              <p className={`text-sm text-center py-2 px-4 rounded ${message.includes('Error') ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600 font-bold'}`}>
                {message}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-[#2C2C2C] text-white py-4 rounded font-bold tracking-[0.2em] uppercase hover:bg-[#D4A373] hover:shadow-xl transition-all duration-300 disabled:opacity-50 mt-4"
            >
              {loading ? 'Processing Luxury Piece...' : 'Submit to Studio'}
            </button>

          </form>
        </div>
      </SignedIn>

    </div>
  );
}