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
      url: "https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-education-workshop-kolkata.jpg",
      name: "Ajitesh Mondal Education Workshop in Kolkata",
      description: "Ajitesh Mondal conducting education workshop for underprivileged students in Kolkata",
      contentUrl: "https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-education-workshop-kolkata.jpg"
    },
    {
      url: "https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-scholarship-ceremony-bengaluru.jpg",
      name: "Ajitesh Mondal Scholarship Ceremony in Bengaluru",
      description: "Ajitesh Mondal presenting scholarships to deserving students in Bengaluru",
      contentUrl: "https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-scholarship-ceremony-bengaluru.jpg"
    },
    {
      url: "https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-mentoring-engineering-students.jpg",
      name: "Ajitesh Mondal Mentoring Engineering Students",
      description: "Ajitesh Mondal providing guidance to aspiring engineers from backward classes",
      contentUrl: "https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-mentoring-engineering-students.jpg"
    },
    {
      url: "https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-backward-class-education-jharkhand.jpg",
      name: "Ajitesh Mondal Supporting Backward Class Education in Jharkhand",
      description: "Ajitesh Mondal's initiative for backward class education in rural Jharkhand",
      contentUrl: "https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-backward-class-education-jharkhand.jpg"
    },
    {
      url: "https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-education-activist-calcutta.jpg",
      name: "Ajitesh Mondal as Education Activist in Calcutta",
      description: "Ajitesh Mondal advocating for educational reform in Calcutta",
      contentUrl: "https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-education-activist-calcutta.jpg"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Gallery | Ajitesh Mondal - Social Entrepreneur & Education Activist</title>
        <meta 
          name="description" 
          content="Explore Ajitesh Mondal's gallery showcasing his work as a social entrepreneur and education activist in Kolkata, Bengaluru, and Jharkhand."
        />
        <meta 
          name="keywords" 
          content="Ajitesh Mondal, social entrepreneur, education activist, scholarship provider, backward class education, engineering mentor, medical education support, Kolkata, Calcutta, Bengaluru, Bangalore, Jharkhand"
        />
        {/* Add additional meta tags for better image SEO */}
        <link rel="canonical" href="https://www.ajiteshmondal.com/gallery" />
        <meta property="og:title" content="Ajitesh Mondal's Gallery - Social Entrepreneurship & Education Initiatives" />
        <meta property="og:description" content="View Ajitesh Mondal's impactful work in education and social entrepreneurship through this visual gallery." />
        <meta property="og:image" content="https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-education-workshop-kolkata.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ajiteshmondal.com/gallery" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ajitesh Mondal's Gallery - Social Entrepreneurship & Education Initiatives" />
        <meta name="twitter:description" content="View Ajitesh Mondal's impactful work in education and social entrepreneurship through this visual gallery." />
        <meta name="twitter:image" content="https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-education-workshop-kolkata.jpg" />
      </Helmet>

      {/* Add structured data for better SEO */}
      <PersonStructuredData
        name="Ajitesh Mondal"
        alternateName="Ajitesh Mondal Social Entrepreneur"
        jobTitle="Social Entrepreneur and Education Activist"
        description="Ajitesh Mondal is a visionary social entrepreneur and education activist dedicated to empowering backward class students through scholarships and mentoring programs across Kolkata, Bengaluru, and Jharkhand."
        image="https://www.ajiteshmondal.com/images/gallery/ajitesh-mondal-education-workshop-kolkata.jpg"
        url="https://www.ajiteshmondal.com"
        sameAs={[
          "https://www.linkedin.com/in/ajiteshmondal",
          "https://twitter.com/ajiteshmondal",
          "https://www.facebook.com/ajiteshmondal"
        ]}
      />

      <ImageGalleryStructuredData
        name="Ajitesh Mondal's Social Entrepreneurship and Education Gallery"
        description="A visual gallery showcasing Ajitesh Mondal's work as a social entrepreneur and education activist across Kolkata, Bengaluru, and Jharkhand."
        url="https://www.ajiteshmondal.com/gallery"
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
