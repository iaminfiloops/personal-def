import Transition from "@/components/Transition";
import Gallery from "@/components/Gallery";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ImageGalleryStructuredData, PersonStructuredData } from "@/components/SEO/StructuredData";

const GalleryPage = () => {
  // Define gallery images for structured data
  const galleryImages = [
    {
      url: "https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-education-workshop-kolkata.jpg",
      name: "Pinky Paul Mondal Education Workshop in Kolkata",
      description: "Pinky Paul Mondal conducting education workshop for underprivileged students in Kolkata",
      contentUrl: "https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-education-workshop-kolkata.jpg"
    },
    {
      url: "https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-scholarship-ceremony-bengaluru.jpg",
      name: "Pinky Paul Mondal Scholarship Ceremony in Bengaluru",
      description: "Pinky Paul Mondal presenting scholarships to deserving students in Bengaluru",
      contentUrl: "https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-scholarship-ceremony-bengaluru.jpg"
    },
    {
      url: "https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-mentoring-engineering-students.jpg",
      name: "Pinky Paul Mondal Mentoring Engineering Students",
      description: "Pinky Paul Mondal providing guidance to aspiring engineers from backward classes",
      contentUrl: "https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-mentoring-engineering-students.jpg"
    },
    {
      url: "https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-backward-class-education-jharkhand.jpg",
      name: "Pinky Paul Mondal Supporting Backward Class Education in Jharkhand",
      description: "Pinky Paul Mondal's initiative for backward class education in rural Jharkhand",
      contentUrl: "https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-backward-class-education-jharkhand.jpg"
    },
    {
      url: "https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-education-activist-calcutta.jpg",
      name: "Pinky Paul Mondal as Education Activist in Calcutta",
      description: "Pinky Paul Mondal advocating for educational reform in Calcutta",
      contentUrl: "https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-education-activist-calcutta.jpg"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Gallery | Pinky Paul Mondal - Social Entrepreneur & Education Activist</title>
        <meta
          name="description"
          content="Explore Pinky Paul Mondal's gallery showcasing her work as a social entrepreneur and education activist in Kolkata, Bengaluru, and Jharkhand."
        />
        <meta
          name="keywords"
          content="Pinky Paul Mondal, social entrepreneur, education activist, scholarship provider, backward class education, engineering mentor, medical education support, Kolkata, Calcutta, Bengaluru, Bangalore, Jharkhand"
        />
        {/* Add additional meta tags for better image SEO */}
        <link rel="canonical" href="https://pinkypaulmondal.com/gallery" />
        <meta property="og:title" content="Pinky Paul Mondal's Gallery - Social Entrepreneurship & Education Initiatives" />
        <meta property="og:description" content="View Pinky Paul Mondal's impactful work in education and social entrepreneurship through this visual gallery." />
        <meta property="og:image" content="https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-education-workshop-kolkata.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pinkypaulmondal.com/gallery" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pinky Paul Mondal's Gallery - Social Entrepreneurship & Education Initiatives" />
        <meta name="twitter:description" content="View Pinky Paul Mondal's impactful work in education and social entrepreneurship through this visual gallery." />
        <meta name="twitter:image" content="https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-education-workshop-kolkata.jpg" />
      </Helmet>

      {/* Add structured data for better SEO */}
      <PersonStructuredData
        name="Pinky Paul Mondal"
        alternateName="Pinky Paul Mondal Social Entrepreneur"
        jobTitle="Social Entrepreneur and Education Activist"
        description="Pinky Paul Mondal is a visionary social entrepreneur and education activist dedicated to empowering backward class students through scholarships and mentoring programs across Kolkata, Bengaluru, and Jharkhand."
        image="https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-education-workshop-kolkata.jpg"
        url="https://pinkypaulmondal.com"
        sameAs={[
          "https://linkedin.com/in/pinkypaulmondal",
          "https://twitter.com/pinkypaulmondal",
          "https://facebook.com/pinkypaulmondal"
        ]}
      />

      <ImageGalleryStructuredData
        name="Pinky Paul Mondal's Social Entrepreneurship and Education Gallery"
        description="A visual gallery showcasing Pinky Paul Mondal's work as a social entrepreneur and education activist across Kolkata, Bengaluru, and Jharkhand."
        url="https://pinkypaulmondal.com/gallery"
        images={galleryImages}
      />

      <Header />
      <Transition>
        <main className="pt-20">
          <Gallery />
        </main>
      </Transition>
      <Footer />
    </>
  );
};

export default GalleryPage;
