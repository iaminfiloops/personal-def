
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, BookOpen, GraduationCap, Briefcase } from "lucide-react";

const About = () => {
  // Timeline data
  const timeline = [
    {
      year: "2010",
      title: "MSW in Social Work",
      description: "Graduated with honors from Columbia University, specializing in community development.",
      icon: GraduationCap,
    },
    {
      year: "2012",
      title: "Social Worker at Urban Center",
      description: "Worked directly with underserved communities to develop support programs.",
      icon: BookOpen,
    },
    {
      year: "2015",
      title: "MBA in Social Entrepreneurship",
      description: "Combined business acumen with social impact at Stanford Business School.",
      icon: GraduationCap,
    },
    {
      year: "2017",
      title: "Founded First Social Enterprise",
      description: "Launched EcoSolutions to address urban waste management challenges.",
      icon: Briefcase,
    },
    {
      year: "2020",
      title: "Impact Investor",
      description: "Began investing in and advising early-stage social impact ventures.",
      icon: Award,
    },
    {
      year: "2022",
      title: "Published 'Purpose & Profit'",
      description: "Released book on balancing social impact with sustainable business models.",
      icon: BookOpen,
    },
  ];

  return (
    <>
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="pt-24 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-background -z-10" />
          
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="chip bg-secondary text-foreground mb-3">About Me</span>
              <h1 className="text-4xl md:text-5xl font-semibold mb-6">My Journey as a Social Entrepreneur</h1>
              <p className="text-xl text-muted-foreground">
                The story behind my mission to create sustainable social impact through entrepreneurship.
              </p>
            </div>
          </div>
        </section>
        
        {/* Profile Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-glass">
                  <img 
                    src="https://via.placeholder.com/800x1200" 
                    alt="Emily Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Floating accent elements */}
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
              </div>
              
              <div>
                <h2 className="text-3xl font-semibold mb-6">Emily Chen</h2>
                <p className="text-muted-foreground mb-4">
                  I'm a social worker turned entrepreneur with a passion for creating sustainable solutions to social challenges. With over 15 years of experience spanning both non-profit and for-profit sectors, I've developed a unique approach to social innovation.
                </p>
                <p className="text-muted-foreground mb-4">
                  My background in social work gave me deep insights into the systemic issues facing vulnerable communities. However, I quickly realized that traditional charity models often struggle with sustainability and scale. This realization led me to explore the world of social entrepreneurship.
                </p>
                <p className="text-muted-foreground mb-8">
                  Today, I build and invest in social enterprises that address critical needs while generating the resources required for long-term impact. I believe that the most effective social change happens at the intersection of purpose and profit.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-xl font-medium mb-2">Expertise</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Social Entrepreneurship</li>
                      <li>Impact Investing</li>
                      <li>Community Development</li>
                      <li>Non-profit Management</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Education</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>MBA, Stanford University</li>
                      <li>MSW, Columbia University</li>
                      <li>BA Psychology, NYU</li>
                    </ul>
                  </div>
                </div>
                
                <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-white">
                  <Link to="/contact" className="flex items-center">
                    Connect with Me <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="chip bg-secondary text-foreground mb-3">My Path</span>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">Professional Journey</h2>
              <p className="text-muted-foreground">
                Key milestones in my career from social worker to social entrepreneur.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-border"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div 
                    key={index}
                    className={`relative flex flex-col md:flex-row ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-accent/10 border-4 border-background flex items-center justify-center z-10">
                      <item.icon size={16} className="text-accent" />
                    </div>
                    
                    {/* Content */}
                    <div className={`md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    } pl-12 md:pl-0`}>
                      <div className="glass-panel p-6">
                        <div className="text-sm font-semibold text-accent mb-1">{item.year}</div>
                        <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="chip bg-secondary text-foreground mb-3">My Values</span>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">Guiding Principles</h2>
              <p className="text-muted-foreground">
                The core beliefs that shape my approach to social entrepreneurship.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-panel p-8">
                <h3 className="text-xl font-medium mb-4">Sustainable Impact</h3>
                <p className="text-muted-foreground">
                  I believe in creating solutions that can sustain themselves over time, reducing dependency on donations or grants. True impact should be both profound and lasting.
                </p>
              </div>
              
              <div className="glass-panel p-8">
                <h3 className="text-xl font-medium mb-4">Community-Centered Design</h3>
                <p className="text-muted-foreground">
                  The most effective solutions emerge when we design with, not just for, the communities we aim to serve. Inclusive co-creation leads to better outcomes.
                </p>
              </div>
              
              <div className="glass-panel p-8">
                <h3 className="text-xl font-medium mb-4">Bridging Divides</h3>
                <p className="text-muted-foreground">
                  I strive to connect different worlds—business and social impact, technology and human needs, policy and practice—to create innovative approaches to complex problems.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-white to-secondary/20">
          <div className="container mx-auto px-6">
            <div className="glass-panel p-12 md:p-16 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                Let's Create Change Together
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                I'm always open to connecting with fellow changemakers, potential partners, or anyone passionate about social impact.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white">
                  <Link to="/contact">Get in Touch</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/portfolio">View My Portfolio</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default About;
