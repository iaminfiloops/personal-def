import Transition from "@/components/Transition";
import Gallery from "@/components/Gallery";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const GalleryPage = () => {
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
      </Helmet>
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
