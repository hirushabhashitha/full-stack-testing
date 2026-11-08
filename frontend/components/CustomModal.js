'use client';

export default function CustomModal({ isOpen, type = 'success', message, onClose }) {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform scale-100 transition-all">
        
        {/* Status Icon */}
        <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner ${
          isSuccess ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
        }`}>
          {isSuccess ? '✓' : '✕'}
        </div>

        {/* Modal Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {isSuccess ? 'Success!' : 'Error Occurred!'}
        </h3>

        {/* Modal Message */}
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {message}
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 text-white font-semibold rounded-xl transition shadow-md active:scale-[0.98] ${
            isSuccess 
              ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
              : 'bg-red-600 hover:bg-red-700 shadow-red-200'
          }`}
        >
          OK
        </button>

      </div>
    </div>
  );
}