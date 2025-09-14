import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [activeNav, setActiveNav] = useState('home');
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [activeCard, setActiveCard] = useState(0);
  const carouselRef = useRef(null);

  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is OMR technology?",
      answer: "Optical Mark Recognition (OMR) is a technology that detects human-marked data on specially designed forms. It's widely used for surveys, tests, and assessments where responses are marked as bubbles or checkboxes.",
      tags: ["OMR"]
    },
    {
      question: "How accurate is Checkify's OMR recognition?",
      answer: "Checkify achieves over 99% accuracy in ideal conditions. Our advanced algorithms can handle minor imperfections in scanning, skewed images, and even light markings.",
      tags: ["Accuracy"]
    },
    {
      question: "What types of forms can Checkify process?",
      answer: "Checkify can process various OMR sheet designs, including multiple-choice answer sheets, surveys, feedback forms, and assessments with bubble patterns.",
      tags: ["Forms"]
    },
    {
      question: "Do I need special hardware to use Checkify?",
      answer: "No special hardware is required. You can use any standard scanner or even a smartphone camera to capture images of your OMR sheets for processing.",
      tags: ["Hardware"]
    },
    {
      question: "What is the difference between OMR and OCR?",
      answer: "OMR detects marks such as filled bubbles or checkboxes, while OCR focuses on recognizing printed or handwritten characters. Both are image processing technologies but serve different purposes.",
      tags: ["OMR"]
    },
    {
      question: "How does computer vision enhance OMR systems?",
      answer: "Computer vision techniques improve OMR by accurately identifying marked regions, correcting distortions, and distinguishing between valid marks and stray pen strokes.",
      tags: ["Computer Vision"]
    },
    {
      question: "Why is image preprocessing important in OMR?",
      answer: "Preprocessing steps like noise removal, binarization, and rotation correction prepare the scanned sheet for reliable mark detection and reduce recognition errors.",
      tags: ["Image Processing"]
    },
    {
      question: "Can OMR be used on mobile devices?",
      answer: "Yes, OMR can be implemented on mobile devices by using the camera to capture forms. Advanced mobile image processing makes it possible to analyze marks instantly.",
      tags: ["Technology"]
    },
    {
      question: "What role does thresholding play in OMR?",
      answer: "Thresholding converts grayscale or colored scans into clear black-and-white images, making it easier to separate filled marks from the background.",
      tags: ["Image Processing"]
    },
    {
      question: "Is deep learning applied in modern OMR solutions?",
      answer: "Deep learning is increasingly used in OMR to improve accuracy, adapt to various form layouts, and handle irregular markings with greater reliability.",
      tags: ["Machine Learning"]
    }
  ];

  const allTags = ["OMR", "Technology", "Accuracy", "Forms", "Compatibility", "Hardware", "Accessibility", "Machine Learning", "Image Processing", "Computer Vision"];

  const handleTagClick = (tag) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  const handleDotClick = (index) => {
    setActiveCard(index);
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0].offsetWidth + 20;
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollPos = carouselRef.current.scrollLeft;
        const cardWidth = carouselRef.current.children[0].offsetWidth + 20;
        const newActiveCard = Math.round(scrollPos / cardWidth);
        setActiveCard(newActiveCard);
      }
    };

    if (carouselRef.current) {
      carouselRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const filteredItems = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = activeTags.length === 0 || 
                        item.tags.some(tag => activeTags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-[#E97B58]">Checkify</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a
                  href="#"
                  onClick={() => handleNavClick('home')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeNav === 'home'
                      ? 'border-[#E97B58] text-gray-900 font-bold'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Home
                </a>
                <a
                  href="#features"
                  onClick={() => handleNavClick('features')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeNav === 'features'
                      ? 'border-[#E97B58] text-gray-900 font-bold'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Features
                </a>
                <a
                  href="#technology"
                  onClick={() => handleNavClick('technology')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeNav === 'technology'
                      ? 'border-[#E97B58] text-gray-900 font-bold'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Technology
                </a>
                <a
                  href="#knowledge"
                  onClick={() => handleNavClick('knowledge')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeNav === 'knowledge'
                      ? 'border-[#E97B58] text-gray-900 font-bold'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Knowledge
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/login" className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E97B58] shadow-sm hover:bg-[#d86a47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E97B58]">
                  Sign in
                </Link>
                <Link to="/register" className="ml-3 relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#E97B58] bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E97B58]">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Fast, Accurate OMR Sheet Evaluation
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Checkify simplifies OMR sheet checking with advanced scanning technology and instant result generation. Perfect for educational institutions and competitive exams.
        </p>
        <div className="mt-10 flex justify-center">
          <div className="rounded-md shadow">
            <Link to="/setup-answer-key" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#E97B58] hover:bg-[#d86a47] md:py-4 md:text-lg md:px-10">
              Get Started
            </Link>
          </div>
          <div className="ml-3 rounded-md shadow">
            <Link to="/dashboard" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#E97B58] bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#E97B58] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10,000+</p>
              <p className="text-orange-100">Sheets Processed Daily</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">99.8%</p>
              <p className="text-orange-100">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-orange-100">Exam Templates</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-orange-100">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#E97B58] tracking-wide uppercase">Features</h2>
            <h3 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Why Choose Checkify?
            </h3>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Everything you need for efficient OMR evaluation in one platform
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-[#E97B58] rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">High Accuracy</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Our advanced algorithms ensure 99.8% accuracy in OMR sheet evaluation, minimizing errors and rescans.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-[#E97B58] rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Fast Processing</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Process hundreds of OMR sheets in minutes instead of hours with our optimized scanning technology.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-[#E97B58] rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Data Storage</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Securely store all evaluation results with easy access through your personalized dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div id="technology" className="bg-[#E97B58] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-200 tracking-wide uppercase">Technology</h2>
            <h3 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
              How OMR Technology Works
            </h3>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-orange-200 sm:mt-4">
              Understanding the science behind accurate optical mark recognition
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Image Processing in OMR Systems</h3>
              <p className="text-white mb-4">
                Checkify uses advanced image processing algorithms to accurately detect and interpret marks on OMR sheets. Our system goes through several sophisticated steps:
              </p>
              <ul className="list-disc pl-5 text-white space-y-2">
                <li>Image preprocessing to enhance contrast and remove noise</li>
                <li>Automatic alignment and deskewing of scanned documents</li>
                <li>Bubble detection using pattern recognition algorithms</li>
                <li>Mark identification with adaptive thresholding techniques</li>
                <li>Result validation and error checking mechanisms</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Best Practices for Optimal Results</h3>
              <p className="text-white mb-4">
                To achieve the highest accuracy with Checkify, follow these guidelines when preparing your OMR sheets:
              </p>
              <ul className="list-disc pl-5 text-white space-y-2">
                <li>Use high-contrast printing (dark bubbles on light background)</li>
                <li>Ensure bubbles are completely filled with dark ink</li>
                <li>Maintain consistent lighting when scanning or photographing sheets</li>
                <li>Keep the OMR sheet flat and avoid shadows on the surface</li>
                <li>Use the recommended bubble size for optimal recognition</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* KNOWLEDGE SHARING */}
      <section id="knowledge" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#E97B58] tracking-wide uppercase">Knowledge Center</h2>
            <h3 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Knowledge Sharing <span className="text-[#E97B58]">💡</span>
            </h3>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Learn more about OMR technology and how to get the best results
            </p>
          </div>
          
          <div className="knowledge-section">
            <div className="search-tags-container">
              <div className="flex items-center mb-6 bg-white rounded-full shadow-sm border border-gray-200 px-4 py-2">
                <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  className="w-full border-0 focus:ring-0 focus:outline-none"
                  placeholder="Search questions or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="tags-container mb-6">
                {allTags.map(tag => (
                  <span
                    key={tag}
                    className={`tag-chip ${activeTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="carousel-container">
              <div className="q-card-carousel" ref={carouselRef}>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, i) => (
                    <div className="q-card" key={i}>
                      <div className="q-question">{item.question}</div>
                      <div className="q-answer">{item.answer}</div>
                      <div className="q-card-tags">
                        {item.tags.map(tag => (
                          <span
                            key={tag}
                            className={`tag-chip ${activeTags.includes(tag) ? 'active' : ''}`}
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-5 w-100">
                    No questions found for your search or tags.
                  </div>
                )}
              </div>
              {filteredItems.length > 1 && (
                <div className="carousel-dots">
                  {filteredItems.map((_, i) => (
                    <span
                      key={i}
                      className={`dot ${activeCard === i ? 'active' : ''}`}
                      onClick={() => handleDotClick(i)}
                    ></span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .knowledge-section {
            background: rgba(255,255,255,0.9);
            border-radius: 1rem;
            padding: 1.5rem;
            border: 1px solid rgba(233, 123, 88, 0.2);
            box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          }
          
          .search-tags-container { display: flex; flex-direction: column; gap: 0.75rem; }
          
          .tags-container { display:flex; flex-wrap:wrap; gap:0.5rem; }
          
          .tag-chip {
            padding: 0.45rem 0.95rem;
            border-radius: 999px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform .14s ease, background .14s ease, color .14s ease;
            border: 2px solid #E97B58;
            background: #ffefe8;
            color: #E97B58;
            user-select: none;
          }
          
          .tag-chip:hover { transform: translateY(-2px); }
          .tag-chip:active { transform: translateY(0); }
          .tag-chip.active { background: #E97B58; color: #fff; }
          
          .carousel-container { position: relative; padding-bottom: 3rem; }
          
          .q-card-carousel {
            display: flex;
            gap: 1.25rem;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding: 0.5rem 0;
          }
          .q-card-carousel::-webkit-scrollbar { display: none; }
          
          .q-card {
            flex: 0 0 100%;
            scroll-snap-align: center;
            border-radius: 1rem;
            padding: 1.5rem;
            background: #fff8f5;
            border: 2px solid rgba(233, 123, 88, 0.12);
            box-shadow: 0 8px 18px rgba(0,0,0,0.04);
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .q-question { font-size: 1.2rem; font-weight: 700; color: #0f172a; }
          .q-answer { font-size: 1rem; color: #475569; line-height:1.6; }
          
          .q-card-tags { display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.5rem; }
          .q-card .tag-chip { font-size:0.8rem; padding:0.25rem 0.6rem; border-width:1.5px; }
          
          .carousel-dots { position:absolute; left:50%; transform:translateX(-50%); bottom:0.5rem; display:flex; gap:0.5rem; }
          .dot { width:10px; height:10px; background: rgba(0,0,0,0.12); border-radius:50%; cursor:pointer; transition: all .22s ease; }
          .dot.active { width:28px; height:10px; border-radius:10px; background: #E97B58; }
          
          @media(min-width: 768px) {
            .q-card { flex: 0 0 48%; }
            .q-card-carousel { gap: 1rem; }
          }
        `}</style>
      </section>

      {/* CTA Section */}
      <div className="bg-[#E97B58]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-orange-200">Start evaluating OMR sheets in minutes.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/setup-answer-key"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#E97B58] bg-white hover:bg-orange-50"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="xl:col-span-1">
              <span className="text-2xl font-bold text-[#E97B58]">Checkify</span>
              <p className="mt-4 text-base text-gray-500">
                Making OMR evaluation faster, accurate, and hassle-free for educational institutions.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Solutions</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Schools</a></li>
                    <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Universities</a></li>
                    <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Competitive Exams</a></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Documentation</a></li>
                    <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Guides</a></li>
                    <li><a href="#knowledge" className="text-base text-gray-600 hover:text-gray-900">Knowledge Base</a></li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">About</a></li>
                    <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Blog</a></li>
                    <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Contact</a></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Privacy</a></li>
                    <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Terms</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2023 Checkify. All rights reserved.
            </p>
          </div>
        </div>
        </footer>
    </div>
  );
};

export default Home;