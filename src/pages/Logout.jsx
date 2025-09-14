import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [countdown, setCountdown] = React.useState(5);

  const handleLogout = () => {
    setIsLoggingOut(true);
    
    setTimeout(() => {

      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      
      // Redirect to login page after logout
      navigate('/login', { replace: true });
    }, 2000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Countdown timer for auto logout
  useEffect(() => {
    if (isLoggingOut) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoggingOut]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {!isLoggingOut ? (
            // Logout confirmation
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
                <svg className="h-8 w-8 text-[#E97B58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Logout</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to logout from your account?</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E97B58] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-[#E97B58] text-white rounded-md hover:bg-[#d86a47] focus:outline-none focus:ring-2 focus:ring-[#E97B58] transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          ) : (
            // Logout in progress
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
                <svg className="animate-spin h-8 w-8 text-[#E97B58]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Logging Out</h2>
              <p className="text-gray-600 mb-6">
                You will be redirected to the login page in {countdown} seconds...
              </p>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#E97B58] h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(5 - countdown) / 5 * 100}%` }}
                ></div>
              </div>
            </>
          )}
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Changed your mind?{' '}
            <Link to="/dashboard" className="text-[#E97B58] hover:text-[#d86a47] font-medium">
              Return to Dashboard
            </Link>
          </p>
        </div>

        {/* Support Information */}
        <div className="mt-8 bg-orange-50 rounded-lg p-4 border border-orange-200 text-center">
          <h3 className="text-sm font-medium text-[#E97B58] mb-2 flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Need Help?
          </h3>
          <p className="text-xs text-gray-600">
            Contact support at{' '}
            <a href="mailto:support@checkify.com" className="text-[#E97B58] hover:text-[#d86a47]">
              support@checkify.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logout;