import { useEffect, useState } from "react";
import "../styles/index.css"

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface NavigationProps {
  onLinkClick: (href: string) => void;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLinkClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const nav = document.querySelector('.nav') as HTMLElement;
      
      if (nav) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }
      }
      
      setIsScrolled(scrollTop > 50);
      lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <nav className={`nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <div className="nav-logo">
          <img src="/SyngenX.png" alt="SyngenX Logo" className="nav-logo-img" />
          <span className="nav-brand">SyngenX</span>
        </div>
        <div className="nav-links">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              className="nav-link" 
              onClick={(e) => {
                e.preventDefault();
                onLinkClick(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index, isHovered, onHover }) => {
  return (
    <div 
      className={`feature-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="feature-icon">
        <i className={feature.icon}></i>
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </div>
  );
};

const StatsSection: React.FC = () => {
  const stats = [
    { number: '10×', label: 'Faster Insights' },
    { number: '360°', label: 'Project Visibility' },
    { number: 'AI', label: 'Powered Analytics' }
  ];

  return (
    <div className="stats-section">
      {stats.map((stat, index) => (
        <div key={index} className="stat-item">
          <div className="stat-number">{stat.number}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

const FloatingParticles: React.FC = () => {
  return (
    <div className="particles">
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num} className={`particle particle-${num}`}></div>
      ))}
    </div>
  );
};

const BackgroundElements: React.FC = () => {
  return (
    <>
      <div className="background-elements">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>
      <div className="grid-pattern"></div>
    </>
  );
};

export default function SyngenXLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features: Feature[] = [
    {
      icon: "fas fa-user-check",
      title: "Personal Strengths",
      description: "Identify and showcase your core competencies, skills, and areas where you excel the most."
    },
    {
      icon: "fas fa-user-minus",
      title: "Growth Opportunities",
      description: "Uncover areas for improvement and receive actionable suggestions to overcome personal challenges."
    },
    {
      icon: "fas fa-exclamation-triangle",
      title: "Criticality Analysis",
      description: "Understand your critical traits and how they impact your performance and decision-making."
    },
    {
      icon: "fas fa-file-alt",
      title: "Comprehensive Individual Report",
      description: "Receive a detailed, AI-powered report summarizing your strengths, weaknesses, and key insights for personal development."
    }
  ];

  useEffect(() => {
    // Trigger fade-in animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleNavLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <div className="container">
      <Navigation onLinkClick={handleNavLinkClick} />
      
      <BackgroundElements />
      <FloatingParticles />

      <div className={`main-content ${isVisible ? 'visible' : ''}`}>
        {/* Brand Section */}
        <div className="brand-section">
          <div className="logo">
            <img src="/SyngenX.png" alt="SyngenX Logo" className="logo" />
          </div>
          <h1 className="brand-title">SyngenX</h1>
          <div className="brand-line"></div>
        </div>

        {/* Hero Content */}
        <p className="tagline">AI-Powered Personal Analytics</p>
        <p className="subtitle">Detailed Individual Strength & Growth Report</p>

        <p className="description">
          SyngenX analyzes your personal data to deliver a comprehensive report on your strengths, weaknesses, and critical traits. Unlock actionable insights to guide your self-improvement and achieve your full potential.
        </p>

        {/* Features Grid */}
        <div className="features-grid" id="features">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isHovered={hoveredCard === index}
              onHover={setHoveredCard}
            />
          ))}
        </div>
        {/* CTA Section */}
        <div className="cta-section">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/login'}
          >
            Get Started
            <i className="fas fa-sign-in-alt"></i>
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.href = '/signup'}
          >
            Create Account
            <i className="fas fa-user-plus"></i>
          </button>
        </div>

        {/* Stats Section */}
        <StatsSection />
      </div>
    </div>
  );
}