// import { useState } from 'react'
// import { Link } from 'react-router-dom'
// import AuthModal from './AuthModal'

// const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
//   const [showAuthModal, setShowAuthModal] = useState(false)
//   const [authMode, setAuthMode] = useState('login')

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         <Link to="/" className="flex items-center space-x-2">
//           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-white font-bold">
//             <img 
//             src="omrlogo.png" alt="" />
//           </div>
//           <span className="text-xl font-semibold">ScanPro</span>
//         </Link>

//         <div className="flex items-center space-x-4">
//           {isLoggedIn ? (
//             <div className="flex items-center space-x-4">
//               <Link to="/dashboard" className="text-gray-600 hover:text-[#E97B58]">
//                 Dashboard
//               </Link>
//               <button 
//                 onClick={() => setIsLoggedIn(false)}
//                 className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-800"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <div className="flex space-x-2">
//               <button 
//                 onClick={() => {
//                   setAuthMode('login')
//                   setShowAuthModal(true)
//                 }}
//                 className="px-4 py-2 text-gray-600 hover:text-[#E97B58]"
//               >
//                 <Link to="/login" className="text-[#E97B58] hover:text-[#e97058]">Login</Link>
//               </button>
//               <button 
//                 onClick={() => {
//                   setAuthMode('register')
//                   setShowAuthModal(true)
//                 }}
//                 className="bg-[#E97B58] text-white hover:bg-[#e97058] px-4 py-2 rounded-md "
//               >
//                 <Link to="/register" className=" text-white">Register</Link>
//               </button>
//             </div>
//           )}
//         </div>

//         <AuthModal 
//           isOpen={showAuthModal}
//           onClose={() => setShowAuthModal(false)}
//           mode={authMode}
//           onLogin={() => {
//             setIsLoggedIn(true)
//             setShowAuthModal(false)
//           }}
//         />
//       </div>
//     </nav>
//   )
// }

// export default Navbar