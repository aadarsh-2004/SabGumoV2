import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, ChevronRight, ChevronDown, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi there! I'm SubGumo's assistant. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tripDestinations, setTripDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  // Fetch trips from the database when component mounts
  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await axios.get(`${API_URL}/trips`);
        if (response.data && Array.isArray(response.data)) {
          // Format trips for dropdown display
          const formattedTrips = response.data.map(trip => ({
            id: trip.id,
            name: trip.title || 'Unnamed Trip',
            description: trip.location_name || trip.subtitle || 'Explore this destination',
            data: trip // Store the full trip data for detailed responses
          }));
          setTripDestinations(formattedTrips);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
        setLoadError('Could not load destinations');
        // Set fallback destinations if fetch fails
        setTripDestinations([
          { id: 1, name: "Kashmir", description: "Paradise on Earth" },
          { id: 2, name: "Ladakh", description: "Land of High Passes" },
          { id: 3, name: "Rajasthan", description: "Land of Kings" }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch when chat is opened to save resources
    if (isOpen && tripDestinations.length === 0) {
      fetchTrips();
    }
  }, [isOpen, API_URL]);

  // Sample trip destinations - replace with actual data from your API
  const quickReplies = [
    { id: 'destinations', text: 'Where can I travel to?', handler: () => handleDestinationsQuery() },
    { id: 'inquiry', text: 'I want to send an inquiry', handler: () => handleInquiryRedirect() },
    { id: 'packages', text: 'Show me your best packages', handler: () => handlePackagesQuery() },
    { id: 'contact', text: 'How can I contact you?', handler: () => handleContactQuery() },
  ];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowInput(false); // Reset to dropdown view when chat is closed/opened
    setIsDropdownOpen(false);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // For now, just echo back a response - we'll add real responses later
    setTimeout(() => {
      handleBotResponse(inputValue);
    }, 500);
    
    setInputValue('');
    setShowInput(false); // Reset to dropdown after sending message
  };

  const handleQuickReply = (reply) => {
    // Add the quick reply as a user message
    const userMessage = {
      id: Date.now(),
      text: reply.text,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Call the handler function for the quick reply
    reply.handler();
  };

  // Handlers for different queries
  const handleDestinationsQuery = () => {
    setTimeout(() => {
      let tripText = "We offer amazing trips to various destinations! ";
      
      // Only add destination names if we have them loaded
      if (tripDestinations.length > 0) {
        const destinationNames = tripDestinations.slice(0, 3).map(d => d.name).join(', ');
        tripText += destinationNames ? `Some popular destinations include ${destinationNames}, and more!` : '';
      }
      
      const botResponse = {
        id: Date.now(),
        text: tripText + " Would you like to browse our destinations?",
        sender: 'bot',
        actions: [
          { text: 'Show All Destinations', handler: () => navigate('/destinations') }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleInquiryRedirect = () => {
    setTimeout(() => {
      const botResponse = {
        id: Date.now(),
        text: "Great! I'd be happy to help you send an inquiry. You can either fill out our inquiry form or I can collect some information here.",
        sender: 'bot',
        actions: [
          { text: 'Go to Inquiry Form', handler: () => navigate('/IForm') }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handlePackagesQuery = () => {
    setTimeout(() => {
      const botResponse = {
        id: Date.now(),
        text: "We have several popular packages! Our Kashmir and Ladakh trips are currently trending. Would you like to see what's available?",
        sender: 'bot',
        actions: [
          { text: 'View Packages', handler: () => navigate('/destinations') }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleContactQuery = () => {
    setTimeout(() => {
      const botResponse = {
        id: Date.now(),
        text: "You can reach us via email at support@subgumo.com or call us at +91 7877XXXX01. Would you like to see our contact page?",
        sender: 'bot',
        actions: [
          { text: 'Contact Us', handler: () => navigate('/IForm') }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  // Generic bot response handler - will be expanded later
  const handleBotResponse = (userInput) => {
    const lowercaseInput = userInput.toLowerCase().trim();
    
    // Check for greetings
    if (lowercaseInput.match(/^(hello|hi|hey|greetings|howdy)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Hello! How can I help you with your travel plans today?",
        sender: 'bot'
      }]);
      return;
    }

    // Check for thanks
    if (lowercaseInput.match(/(thanks|thank you|thx|ty)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "You're welcome! Is there anything else I can help you with?",
        sender: 'bot'
      }]);
      return;
    }

    // Handle trip timing questions
    if (lowercaseInput.match(/(when|next trip|upcoming trip|schedule|upcoming|next)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "We have several upcoming trips. Would you like to see all our available trips?",
        sender: 'bot',
        actions: [
          { text: 'View All Trips', handler: () => navigate('/destinations') }
        ]
      }]);
      return;
    }

    // Handle price/cost questions
    if (lowercaseInput.match(/(cost|price|pricing|how much|fee|expense)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Our trip packages vary in price based on destination, duration, and included amenities. Would you like to see detailed pricing?",
        sender: 'bot',
        actions: [
          { text: 'See Package Prices', handler: () => navigate('/destinations') }
        ]
      }]);
      return;
    }

    // Handle booking questions
    if (lowercaseInput.match(/(book|booking|reserve|reservation|availability)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "You can book any of our trips by sending an inquiry first. Would you like to send an inquiry now?",
        sender: 'bot',
        actions: [
          { text: 'Send Inquiry', handler: () => navigate('/IForm') }
        ]
      }]);
      return;
    }

    // Handle accommodation questions
    if (lowercaseInput.match(/(accommodation|hotel|stay|lodge|room|sleeping)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Details about accommodations can be found on each trip's page. Would you like to browse our trips?",
        sender: 'bot',
        actions: [
          { text: 'Browse Packages', handler: () => navigate('/destinations') }
        ]
      }]);
      return;
    }

    // Handle transportation questions
    if (lowercaseInput.match(/(transport|travel|journey|vehicle|car|bus|train|flight)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Transportation details are available on each trip's page. Would you like to view our packages?",
        sender: 'bot',
        actions: [
          { text: 'View Trip Details', handler: () => navigate('/destinations') }
        ]
      }]);
      return;
    }

    // Handle food/meal questions
    if (lowercaseInput.match(/(food|meal|breakfast|lunch|dinner|cuisine|eat)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Meal information is available on each specific trip page. Would you like to browse our offerings?",
        sender: 'bot',
        actions: [
          { text: 'View Trip Details', handler: () => navigate('/destinations') }
        ]
      }]);
      return;
    }

    // Handle group size questions
    if (lowercaseInput.match(/(group size|how many people|group|people count|travel group)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Group size information is available on each trip's details page.",
        sender: 'bot',
        actions: [
          { text: 'Browse Trips', handler: () => navigate('/destinations') }
        ]
      }]);
      return;
    }

    // Handle safety questions
    if (lowercaseInput.match(/(safe|safety|security|covid|dangerous|risk)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Safety is our top priority. For specific safety protocols on each trip, please check the trip details.",
        sender: 'bot',
        actions: [
          { text: 'View Trips', handler: () => navigate('/destinations') }
        ]
      }]);
      return;
    }

    // Handle destination-specific questions
    if (lowercaseInput.match(/(kashmir|srinagar|dal lake|gulmarg)/i)) {
      // Find matching trip from fetched data
      const kashmir = tripDestinations.find(trip => 
        trip.name.toLowerCase().includes('kashmir') || 
        (trip.description && trip.description.toLowerCase().includes('kashmir'))
      );
      
      const destinationId = kashmir ? kashmir.id : null;
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Kashmir is known as 'Paradise on Earth' with beautiful landscapes, mountains, and lakes.",
        sender: 'bot',
        actions: [
          { text: 'View Kashmir Details', handler: () => navigate(destinationId ? `/destination/${destinationId}` : '/destinations') }
        ]
      }]);
      return;
    }

    if (lowercaseInput.match(/(ladakh|leh|pangong|nubra)/i)) {
      const ladakh = tripDestinations.find(trip => 
        trip.name.toLowerCase().includes('ladakh') || 
        (trip.description && trip.description.toLowerCase().includes('ladakh'))
      );
      
      const destinationId = ladakh ? ladakh.id : null;
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Ladakh is a high-altitude desert with stunning landscapes and Buddhist monasteries.",
        sender: 'bot',
        actions: [
          { text: 'View Ladakh Details', handler: () => navigate(destinationId ? `/destination/${destinationId}` : '/destinations') }
        ]
      }]);
      return;
    }

    if (lowercaseInput.match(/(rajasthan|jaipur|udaipur|jodhpur|jaisalmer)/i)) {
      const rajasthan = tripDestinations.find(trip => 
        trip.name.toLowerCase().includes('rajasthan') || 
        (trip.description && trip.description.toLowerCase().includes('rajasthan'))
      );
      
      const destinationId = rajasthan ? rajasthan.id : null;
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Rajasthan showcases India's royal heritage with magnificent palaces, imposing forts, and vibrant culture.",
        sender: 'bot',
        actions: [
          { text: 'View Rajasthan Details', handler: () => navigate(destinationId ? `/destination/${destinationId}` : '/destinations') }
        ]
      }]);
      return;
    }

    // Handle payment questions
    if (lowercaseInput.match(/(payment|pay|transaction|money|transfer|deposit|refund)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "For detailed payment information, please visit our booking page.",
        sender: 'bot',
        actions: [
          { text: 'Booking Info', handler: () => navigate('/IForm') }
        ]
      }]);
      return;
    }

    // Handle visa/documents questions
    if (lowercaseInput.match(/(visa|document|passport|id|identity|paperwork)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Document requirements vary by destination. For specific information, please check individual trip pages or send an inquiry.",
        sender: 'bot',
        actions: [
          { text: 'Send Inquiry', handler: () => navigate('/IForm') }
        ]
      }]);
      return;
    }

    // Handle weather/climate questions
    if (lowercaseInput.match(/(weather|climate|temperature|rain|monsoon|season|cold|hot)/i)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Weather conditions vary by destination and season. For specific climate information, please check individual trip pages.",
        sender: 'bot',
        actions: [
          { text: 'Browse Trips', handler: () => navigate('/destinations') }
        ]
      }]);
      return;
    }

    // Default response if no patterns match
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: "I don't have specific information about that. Would you like to browse our destinations or send an inquiry?",
      sender: 'bot',
      actions: [
        { text: 'Browse Destinations', handler: () => navigate('/destinations') },
        { text: 'Send Inquiry', handler: () => navigate('/IForm') }
      ]
    }]);
  };

  const handleDestinationSelect = (destination) => {
    // Add user message showing what they selected
    const userMessage = {
      id: Date.now(),
      text: `I'd like to learn about ${destination.name}`,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsDropdownOpen(false);
    
    // Create a response based on the selected destination
    setTimeout(() => {
      // Use actual trip data to provide a link to the specific destination page
      const responseText = `${destination.name} is a beautiful destination. Would you like to see available packages?`;
      
      // Navigate to the specific destination page using the actual trip ID
      const actions = [{ 
        text: `View ${destination.name} Packages`, 
        handler: () => navigate(`/destination/${destination.id}`) 
      }];
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: responseText,
        sender: 'bot',
        actions: actions
      }]);
    }, 600);
  };

  const toggleInputMode = () => {
    setShowInput(!showInput);
    setIsDropdownOpen(false);
    
    if (!showInput) {
      // Add a helper message when switching to text input mode
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "You can ask me anything about our trips, like prices, accommodations, or travel dates!",
        sender: 'bot'
      }]);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-gray-700 rotate-90' : 'bg-orange-600 hover:bg-orange-700'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-16 sm:bottom-24 right-2 sm:right-6 z-40 w-[calc(100%-16px)] sm:w-80 md:w-96 bg-white rounded-xl shadow-xl 
          transition-all duration-300 overflow-hidden flex flex-col max-w-full
          ${isOpen ? 'opacity-100 max-h-[80vh] sm:max-h-[600px]' : 'opacity-0 max-h-0 pointer-events-none'}`}
        style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      >
        {/* Chat header */}
        <div className="bg-gradient-to-r from-black to-black text-white p-3 sm:p-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm sm:text-base">SubGumo Travel Assistant</h3>
            <p className="text-xs sm:text-sm opacity-90">Ask me anything about your travel plans!</p>
          </div>
          <button 
            onClick={toggleChat} 
            className="text-white p-1 rounded-full hover:bg-orange-700/50"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3" style={{ maxHeight: 'calc(80vh - 220px)', minHeight: '180px' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-2.5 sm:p-3 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-orange-500 text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                <p className="break-words">{message.text}</p>
                
                {/* Action buttons if available */}
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.handler}
                        className="text-xs bg-white text-orange-600 px-2 py-1 rounded font-medium hover:bg-orange-50 active:bg-orange-100 touch-action-manipulation"
                      >
                        {action.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        <div className="px-3 sm:px-4 py-4 sm:py-5 border-t border-gray-200">
          <div className="mb-2 text-xs text-gray-500 font-medium">Popular questions:</div>
          <div className="overflow-x-auto pb-2 touch-pan-x -mx-1 px-1">
            <div className="flex flex-wrap gap-2 min-w-max">
              {quickReplies.map((reply) => (
                <button
                  key={reply.id}
                  onClick={() => handleQuickReply(reply)}
                  className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 text-xs sm:text-sm px-3.5 py-2.5 rounded-full whitespace-nowrap flex items-center touch-action-manipulation shadow-sm transition-colors duration-150"
                >
                  <span className="mr-1">{reply.text}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
          {/* Scroll indicator for mobile */}
          <div className="flex justify-center sm:hidden mt-1">
            <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Message input */}
        <div className="p-2 sm:p-3 border-t border-gray-200">
          {showInput ? (
            /* Text input mode */
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-black hover:bg-black active:bg-black text-white p-2 rounded-md touch-action-manipulation"
                disabled={!inputValue.trim()}
                aria-label="Send message"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                type="button"
                onClick={toggleInputMode}
                className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 p-2 rounded-md touch-action-manipulation"
                aria-label="Switch to destination selector"
              >
                <Map className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </form>
          ) : (
            /* Dropdown selector mode */
            <div className="space-y-2">
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="w-full flex items-center justify-between p-2 text-sm sm:text-base border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                >
                  <span className="text-gray-700">Select a destination to explore</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                    {tripDestinations.map((destination) => (
                      <button
                        key={destination.id}
                        onClick={() => handleDestinationSelect(destination)}
                        className="w-full text-left px-3 py-2 hover:bg-orange-50 focus:bg-orange-50 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-800">{destination.name}</div>
                          <div className="text-xs text-gray-500">{destination.description}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Want to ask something specific?</div>
                <button
                  onClick={toggleInputMode}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full"
                >
                  Type a message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatBot; 