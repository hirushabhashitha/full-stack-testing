'use client';

export default function LoadingModal({ isOpen, message = 'Processing, please wait...' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
      <div className="bg-white px-6 py-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-xs w-full animate-in fade-in zoom-in duration-200">
        
        {/* Loading Spinner Animation */}
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
        
        {/* Message */}
        <div className="text-left">
          <h4 className="text-gray-900 font-bold text-sm">Please wait</h4>
          <p className="text-gray-500 text-xs">{message}</p>
        </div>

      </div>
    </div>
  );
}