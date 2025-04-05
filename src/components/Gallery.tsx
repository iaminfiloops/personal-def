import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import OptimizedImage from "@/components/ui/optimized-image";

// Define the gallery item interface
interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  blogLink?: string;
}

// Create gallery items with SEO-friendly titles and alt text
const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/images/gallery/ajitesh-mondal-education-workshop-kolkata.jpg",
    alt: "Ajitesh Mondal conducting education workshop in Kolkata",
    title: "Education Workshop in Kolkata",
    blogLink: "/blog/education-initiatives-kolkata"
  },
  {
    id: 2,
    src: "/images/gallery/ajitesh-mondal-scholarship-ceremony-bengaluru.jpg",
    alt: "Ajitesh Mondal at scholarship award ceremony in Bengaluru",
    title: "Scholarship Award Ceremony in Bengaluru",
    blogLink: "/blog/scholarship-program-bengaluru"
  },
  {
    id: 3,
    src: "/images/gallery/ajitesh-mondal-mentoring-engineering-students.jpg",
    alt: "Ajitesh Mondal mentoring engineering students",
    title: "Engineering Mentorship Program",
    blogLink: "/blog/engineering-mentorship-program"
  },
  {
    id: 4,
    src: "/images/gallery/ajitesh-mondal-medical-education-support-program.jpg",
    alt: "Ajitesh Mondal at medical education support program",
    title: "Medical Education Support Initiative",
    blogLink: "/blog/medical-education-support"
  },
  {
    id: 5,
    src: "/images/gallery/ajitesh-mondal-backward-class-education-jharkhand.jpg",
    alt: "Ajitesh Mondal supporting backward class education in Jharkhand",
    title: "Backward Class Education in Jharkhand",
    blogLink: "/blog/backward-class-education-jharkhand"
  },
  {
    id: 6,
    src: "/images/gallery/ajitesh-mondal-social-entrepreneurship-conference.jpg",
    alt: "Ajitesh Mondal speaking at social entrepreneurship conference",
    title: "Social Entrepreneurship Conference",
    blogLink: "/blog/social-entrepreneurship-initiatives"
  },
  {
    id: 7,
    src: "/images/gallery/ajitesh-mondal-education-activist-calcutta.jpg",
    alt: "Ajitesh Mondal as education activist in Calcutta",
    title: "Education Activism in Calcutta",
    blogLink: "/blog/education-activism-calcutta"
  },
  {
    id: 8,
    src: "/images/gallery/ajitesh-mondal-scholarship-distribution-bangalore.jpg",
    alt: "Ajitesh Mondal at scholarship distribution event in Bangalore",
    title: "Scholarship Distribution in Bangalore",
    blogLink: "/blog/scholarship-distribution-bangalore"
  },
  {
    id: 9,
    src: "/images/gallery/ajitesh-mondal-rural-education-initiative.jpg",
    alt: "Ajitesh Mondal leading rural education initiative",
    title: "Rural Education Initiative",
    blogLink: "/blog/rural-education-initiative"
  },
  {
    id: 10,
    src: "/images/gallery/ajitesh-mondal-stem-education-workshop.jpg",
    alt: "Ajitesh Mondal conducting STEM education workshop",
    title: "STEM Education Workshop",
    blogLink: "/blog/stem-education-workshop"
  },
  {
    id: 11,
    src: "/images/gallery/ajitesh-mondal-education-technology-seminar.jpg",
    alt: "Ajitesh Mondal at education technology seminar",
    title: "Education Technology Seminar",
    blogLink: "/blog/education-technology-seminar"
  },
  {
    id: 12,
    src: "/images/gallery/ajitesh-mondal-community-outreach-program.jpg",
    alt: "Ajitesh Mondal during community outreach program",
    title: "Community Outreach Program",
    blogLink: "/blog/community-outreach-program"
  },
  {
    id: 13,
    src: "/images/gallery/ajitesh-mondal-education-policy-discussion.jpg",
    alt: "Ajitesh Mondal participating in education policy discussion",
    title: "Education Policy Discussion",
    blogLink: "/blog/education-policy-discussion"
  },
  {
    id: 14,
    src: "/images/gallery/ajitesh-mondal-student-mentorship-program.jpg",
    alt: "Ajitesh Mondal at student mentorship program",
    title: "Student Mentorship Program",
    blogLink: "/blog/student-mentorship-program"
  },
  {
    id: 15,
    src: "/images/gallery/ajitesh-mondal-educational-resource-distribution.jpg",
    alt: "Ajitesh Mondal distributing educational resources",
    title: "Educational Resource Distribution",
    blogLink: "/blog/educational-resource-distribution"
  },
  {
    id: 16,
    src: "/images/gallery/ajitesh-mondal-career-guidance-workshop.jpg",
    alt: "Ajitesh Mondal leading career guidance workshop",
    title: "Career Guidance Workshop",
    blogLink: "/blog/career-guidance-workshop"
  },
  {
    id: 17,
    src: "/images/gallery/ajitesh-mondal-education-conference-speaker.jpg",
    alt: "Ajitesh Mondal speaking at education conference",
    title: "Education Conference Speaker",
    blogLink: "/blog/education-conference-insights"
  },
  {
    id: 18,
    src: "/images/gallery/ajitesh-mondal-underprivileged-student-support.jpg",
    alt: "Ajitesh Mondal supporting underprivileged students",
    title: "Underprivileged Student Support",
    blogLink: "/blog/underprivileged-student-support"
  },
  {
    id: 19,
    src: "/images/gallery/ajitesh-mondal-education-ngo-collaboration.jpg",
    alt: "Ajitesh Mondal collaborating with education NGOs",
    title: "Education NGO Collaboration",
    blogLink: "/blog/education-ngo-collaboration"
  },
  {
    id: 20,
    src: "/images/gallery/ajitesh-mondal-digital-literacy-program.jpg",
    alt: "Ajitesh Mondal at digital literacy program",
    title: "Digital Literacy Program",
    blogLink: "/blog/digital-literacy-program"
  },
  {
    id: 21,
    src: "/images/gallery/ajitesh-mondal-education-fundraising-event.jpg",
    alt: "Ajitesh Mondal at education fundraising event",
    title: "Education Fundraising Event",
    blogLink: "/blog/education-fundraising-event"
  },
  {
    id: 22,
    src: "/images/gallery/ajitesh-mondal-teacher-training-workshop.jpg",
    alt: "Ajitesh Mondal conducting teacher training workshop",
    title: "Teacher Training Workshop",
    blogLink: "/blog/teacher-training-workshop"
  },
  {
    id: 23,
    src: "/images/gallery/ajitesh-mondal-educational-material-development.jpg",
    alt: "Ajitesh Mondal developing educational materials",
    title: "Educational Material Development",
    blogLink: "/blog/educational-material-development"
  },
  {
    id: 24,
    src: "/images/gallery/ajitesh-mondal-scholarship-selection-committee.jpg",
    alt: "Ajitesh Mondal on scholarship selection committee",
    title: "Scholarship Selection Committee",
    blogLink: "/blog/scholarship-selection-process"
  },
  {
    id: 25,
    src: "/images/gallery/ajitesh-mondal-education-award-recipient.jpg",
    alt: "Ajitesh Mondal receiving education award",
    title: "Education Award Recipient",
    blogLink: "/blog/education-award-recognition"
  },
  {
    id: 26,
    src: "/images/gallery/ajitesh-mondal-educational-leadership-summit.jpg",
    alt: "Ajitesh Mondal at educational leadership summit",
    title: "Educational Leadership Summit",
    blogLink: "/blog/educational-leadership-summit"
  },
  {
    id: 27,
    src: "/images/gallery/ajitesh-mondal-education-innovation-showcase.jpg",
    alt: "Ajitesh Mondal at education innovation showcase",
    title: "Education Innovation Showcase",
    blogLink: "/blog/education-innovation-showcase"
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  return (
    <div className="container mx-auto py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Gallery</h1>
        <p className="text-lg text-muted-foreground mb-12 text-center">
          A visual journey through Ajitesh Mondal's social entrepreneurship and educational initiatives
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryItems.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  onClick={() => setSelectedImage(item)}
                  className="w-full h-full"
                  aria-label={`View larger image of ${item.title}`}
                >
                  <AspectRatio ratio={4/3} className="bg-muted">
                    <OptimizedImage
                      src={item.src}
                      alt={item.alt}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <h3 className="text-white font-medium text-sm">{item.title}</h3>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <div className="flex flex-col space-y-4">
                  <AspectRatio ratio={16/9} className="bg-muted overflow-hidden rounded-lg">
                    <OptimizedImage
                      src={selectedImage?.src || ""}
                      alt={selectedImage?.alt || ""}
                      className="object-contain w-full h-full"
                      priority={true}
                    />
                  </AspectRatio>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{selectedImage?.title}</h3>
                    {selectedImage?.blogLink && (
                      <Link 
                        to={selectedImage.blogLink}
                        className="inline-block text-sm text-accent hover:underline"
                      >
                        Read related blog post
                      </Link>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
