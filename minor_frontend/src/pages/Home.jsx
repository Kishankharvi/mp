// "use client"
// // import {coderoomlogo} from "../assets"
// // import {editot} from "../assets"
// import { Link } from "react-router-dom"
// import coderoomlogo from "../assets/coderoomlogo.png"
// import editot from "../assets/editot.png"
// export default function Home() {
//   return (
//     <div className="bg-[#0a0a0b] min-h-screen text-white relative overflow-hidden">

//       {/* HEADER */}
//       <header className="absolute inset-x-0 top-0 z-50">
//         <nav className="flex items-center justify-between p-6 lg:px-12">
          
//           {/* LOGO LEFT */}
//           <div className="flex items-center gap-2">
//             <img 
//               src={coderoomlogo}
//               alt="CodeRoom" 
//               className="h-10 w-auto" 
//             />
//             <span className="text-xl font-bold tracking-wide">CodeRoom</span>
//           </div>

//           {/* Nav Desktop */}
//           <div className="hidden lg:flex gap-x-10 text-gray-300 font-semibold">
//             <Link to="/" className="hover:text-indigo-400">Home</Link>
//             <Link to="/dashboard" className="hover:text-indigo-400">Dashboard</Link>
           
//           </div>

//           {/* Login Button */}
//           <div className="hidden lg:flex">
//             <Link 
//               to="/login" 
//               className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold">
//               Login →
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <button
//             type="button"
//             command="show-modal"
//             commandfor="mobile-menu"
//             className="lg:hidden p-2.5 rounded-lg text-gray-200 bg-white/5 hover:bg-white/10"
//           >
//             ☰
//           </button>
//         </nav>

//         {/* Mobile Menu Dialog */}
//         <el-dialog>
//           <dialog id="mobile-menu" className="backdrop:bg-black/60 lg:hidden">
//             <div tabIndex={0} className="fixed inset-0 flex justify-end">

//               <el-dialog-panel className="bg-[#101113] w-72 p-6 h-full shadow-xl border-l border-white/5">
//                 <div className="flex justify-between items-center mb-8">
//                   <span className="font-bold text-xl">Menu</span>
//                   <button command="close" commandfor="mobile-menu" className="text-gray-300 text-xl">✕</button>
//                 </div>

//                 <nav className="flex flex-col gap-5 text-gray-300 text-lg font-medium">
//                   <Link to="/" command="close" commandfor="mobile-menu" className="hover:text-indigo-400">Home</Link>
//                   <Link to="/dashboard" command="close" commandfor="mobile-menu" className="hover:text-indigo-400">Dashboard</Link>
                 

//                   <Link 
//                     to="/login" 
//                     command="close"
//                     commandfor="mobile-menu"
//                     className="mt-4 px-4 py-2 text-center bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500">
//                     Login
//                   </Link>
//                 </nav>
//               </el-dialog-panel>

//             </div>
//           </dialog>
//         </el-dialog>

//       </header>

//       {/* HERO SECTION */}
//       <section className="pt-36 text-center px-6 sm:px-10">
//         <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
//           Real-Time Collaborative Coding Rooms
//         </h1>

//         <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed">
//           Create coding rooms, pair program, collaborate live, chat and build together in a shared code workspace.  
//           Perfect for hackathons, teaching, interviews & real dev workflow.
//         </p>

//         <div className="mt-10 flex flex-wrap justify-center gap-4">
//           <Link 
//             to="/dashboard"
//             className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold shadow-md">
//             Go to Dashboard
//           </Link>

          
//         </div>
//       </section>

//       {/* EDITOR IMAGE PREVIEW */}
//       <div className="mt-24 flex justify-center pb-20">
//         <img 
//           src={editot}
//           alt="Code Editor Screenshot" 
//           className="rounded-xl w-[80%] max-w-4xl shadow-2xl border border-white/10"
//         />
//       </div>

//     </div>
// //   )
// // }
// "use client"
// import { Link } from "react-router-dom"
// import coderoomlogo from "../assets/coderoomlogo.png"
// import editot from "../assets/editot.png"

// export default function Home() {
//   return (
//     <div className="bg-[#1e1e1e] min-h-screen text-white relative overflow-hidden">

//       {/* HEADER */}
//       <header className="absolute inset-x-0 top-0 z-50 bg-[#1e1e1e]/80 backdrop-blur-sm border-b border-gray-800">
//         <nav className="flex items-center justify-between p-6 lg:px-12">
          
//           {/* LOGO LEFT */}
//           <div className="flex items-center gap-2">
//             <img 
//               src={coderoomlogo}
//               alt="CodeRoom" 
//               className="h-10 w-auto" 
//             />
//             <span className="text-xl font-bold tracking-wide">CodeRoom</span>
//           </div>

//           {/* Nav Desktop */}
//           <div className="hidden lg:flex gap-x-10 text-gray-400 font-semibold">
//             <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
//             <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
//           </div>

//           {/* Login Button */}
//           <div className="hidden lg:flex">
//             <Link 
//               to="/login" 
//               className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold transition-colors">
//               Login →
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <button
//             type="button"
//             command="show-modal"
//             commandfor="mobile-menu"
//             className="lg:hidden p-2.5 rounded-lg text-gray-200 bg-gray-800 hover:bg-gray-700"
//           >
//             ☰
//           </button>
//         </nav>

//         {/* Mobile Menu Dialog */}
//         <el-dialog>
//           <dialog id="mobile-menu" className="backdrop:bg-black/80 lg:hidden">
//             <div tabIndex={0} className="fixed inset-0 flex justify-end">

//               <el-dialog-panel className="bg-[#252526] w-72 p-6 h-full shadow-xl border-l border-gray-700">
//                 <div className="flex justify-between items-center mb-8">
//                   <span className="font-bold text-xl">Menu</span>
//                   <button command="close" commandfor="mobile-menu" className="text-gray-300 text-xl">✕</button>
//                 </div>

//                 <nav className="flex flex-col gap-5 text-gray-300 text-lg font-medium">
//                   <Link to="/" command="close" commandfor="mobile-menu" className="hover:text-blue-400">Home</Link>
//                   <Link to="/dashboard" command="close" commandfor="mobile-menu" className="hover:text-blue-400">Dashboard</Link>

//                   <Link 
//                     to="/login" 
//                     command="close"
//                     commandfor="mobile-menu"
//                     className="mt-4 px-4 py-2 text-center bg-blue-600 rounded-lg font-semibold hover:bg-blue-500">
//                     Login
//                   </Link>
//                 </nav>
//               </el-dialog-panel>

//             </div>
//           </dialog>
//         </el-dialog>

//       </header>

//       {/* HERO SECTION */}
//       <section className="pt-36 text-center px-6 sm:px-10">
//         <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
//           One-to-One & Class Coding Rooms
//         </h1>

//         <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed">
//           Create focused coding rooms for one-on-one mentoring or classroom teaching. Work with one language at a time with read-only mode for students and selective edit privileges. Perfect for teaching, code reviews, and structured learning sessions.
//         </p>

//         <div className="mt-10 flex flex-wrap justify-center gap-4">
//           <Link 
//             to="/dashboard"
//             className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-semibold shadow-lg transition-all hover:shadow-blue-500/30">
//             Go to Dashboard
//           </Link>
//         </div>
//       </section>

//       {/* EDITOR IMAGE PREVIEW WITH GRADIENT FADE */}
//       <div className="mt-24 flex justify-center pb-20 relative">
//         <div className="relative w-[80%] max-w-4xl">
//           <img 
//             src={editot}
//             alt="Code Editor Screenshot" 
//             className="rounded-xl w-full shadow-2xl border border-gray-700"
//           />
//           {/* Gradient overlay - transparent middle to solid bottom */}
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-50% to-[#1e1e1e] rounded-xl pointer-events-none"></div>
//         </div>
//       </div>

    
//     </div>
//   )
// }



"use client"
import { Link } from "react-router-dom"
import coderoomlogo from "../assets/coderoomlogo.png"
import editot from "../assets/editot.png"

export default function Home() {
  return (
    <div className="bg-[#1e1e1e] min-h-screen text-white relative overflow-hidden">
      
      {/* Background Image with Gradient Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${editot})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e1e1e]/50 via-[#1e1e1e]/70 via-50% to-[#1e1e1e] to-75%"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">

        {/* HEADER */}
        <header className="absolute inset-x-0 top-0 z-50 bg-[#1e1e1e]/60 backdrop-blur-md border-b border-gray-800">
          <nav className="flex items-center justify-between p-6 lg:px-12">
            
            {/* LOGO LEFT */}
            <div className="flex items-center gap-2">
              <img 
                src={coderoomlogo}
                alt="CodeRoom" 
                className="h-10 w-auto" 
              />
              <span className="text-xl font-bold tracking-wide">CodeRoom</span>
            </div>

            {/* Nav Desktop */}
            <div className="hidden lg:flex gap-x-10 text-gray-400 font-semibold">
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
            </div>

            {/* Login Button */}
            <div className="hidden lg:flex">
              <Link 
                to="/login" 
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold transition-colors">
                Login →
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              command="show-modal"
              commandfor="mobile-menu"
              className="lg:hidden p-2.5 rounded-lg text-gray-200 bg-gray-800 hover:bg-gray-700"
            >
              ☰
            </button>
          </nav>

          {/* Mobile Menu Dialog */}
          <el-dialog>
            <dialog id="mobile-menu" className="backdrop:bg-black/80 lg:hidden">
              <div tabIndex={0} className="fixed inset-0 flex justify-end">

                <el-dialog-panel className="bg-[#252526] w-72 p-6 h-full shadow-xl border-l border-gray-700">
                  <div className="flex justify-between items-center mb-8">
                    <span className="font-bold text-xl">Menu</span>
                    <button command="close" commandfor="mobile-menu" className="text-gray-300 text-xl">✕</button>
                  </div>

                  <nav className="flex flex-col gap-5 text-gray-300 text-lg font-medium">
                    <Link to="/" command="close" commandfor="mobile-menu" className="hover:text-blue-400">Home</Link>
                    <Link to="/dashboard" command="close" commandfor="mobile-menu" className="hover:text-blue-400">Dashboard</Link>

                    <Link 
                      to="/login" 
                      command="close"
                      commandfor="mobile-menu"
                      className="mt-4 px-4 py-2 text-center bg-blue-600 rounded-lg font-semibold hover:bg-blue-500">
                      Login
                    </Link>
                  </nav>
                </el-dialog-panel>

              </div>
            </dialog>
          </el-dialog>

        </header>

        {/* HERO SECTION */}
        <section className="pt-36 text-center px-6 sm:px-10">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
            One-to-One & Class Coding Rooms
          </h1>

          <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed">
            Create focused coding rooms for one-on-one mentoring or classroom teaching. Work with one language at a time with read-only mode for students and selective edit privileges. Perfect for teaching, code reviews, and structured learning sessions.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link 
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-semibold shadow-lg transition-all hover:shadow-blue-500/30">
              Go to Dashboard
            </Link>
          </div>
        </section>

        {/* EDITOR IMAGE PREVIEW
        <div className="mt-24 flex justify-center pb-20">
          <div className="w-[80%] max-w-4xl">
            <img 
              src={editot}
              alt="Code Editor Screenshot" 
              className="rounded-xl w-full shadow-2xl border border-gray-700"
            />
          </div>
        </div> */}

        {/* FEATURES SECTION */}
        {/* <section className="py-20 px-6 sm:px-10 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-[#252526] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold mb-2">Class Mode</h3>
              <p className="text-gray-400">
                Students join in read-only mode. Grant edit access selectively when needed for hands-on practice.
              </p>
            </div>

            <div className="bg-[#252526] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">One Language Focus</h3>
              <p className="text-gray-400">
                Work with one programming language at a time to maintain clarity and focused learning.
              </p>
            </div>

            <div className="bg-[#252526] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">One-to-One Sessions</h3>
              <p className="text-gray-400">
                Perfect for mentoring, code reviews, and personalized teaching sessions.
              </p>
            </div>

          </div>
        </section> */}

        {/* Footer Spacer */}
        <div className="h-20"></div>

      </div>
    </div>
  )
}