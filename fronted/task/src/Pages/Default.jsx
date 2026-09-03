import React from 'react'
import Navbar from '../Compoment/Navbar.jsx'
import Hero from '../Compoment/Hero.jsx'
import About from '../Compoment/About.jsx'
import Contact from '../Compoment/Contact.jsx'
import MemberSection from '../Compoment/MemberSection.jsx'
import ProjectsSection from '../Compoment/ProjectsSection.jsx'
import Footer from '../Compoment/Footer.jsx'
import ChatAI from '../Compoment/ChatAI.jsx'

function Default() {
  return (
    <div>
      <Navbar />
      <Hero />
      <MemberSection />
      <ProjectsSection />
      <About />
      <Contact />
      <Footer />
      <ChatAI />
    </div>
  )
}

export default Default