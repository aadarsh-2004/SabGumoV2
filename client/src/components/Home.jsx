import React from "react";
import HeroSection from "./HeroSection";
import Services from "./Services";
import Destinations from "./Destinations";
// Removed Footer import as it's likely in App.jsx or Layout
import Testimonial from "./Testimonials";
import TripCalendar from "./TripCalendar"; // Import the new calendar component
import HeroDestinationCard from "./HeroDestinationCard"; // Import the new hero destination card component

function Home() {
  return (
    <>
      <HeroSection />
      <Services />
      <HeroDestinationCard />
      <Destinations />
      <TripCalendar /> {/* Add the calendar component here */} 
      <Testimonial />
    </>
  );
}

export default Home;
