import { Settings, Utensils, Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-industrial-blue text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <img 
                  src="/images/logos/MOM-Logo-Icon.png"
                  alt="MoM Logo Icon"
                  className="h-8 w-8 object-contain filter brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="font-mechanical text-xl font-bold">MoM</h3>
                <p className="text-xs text-gray-300 font-industrial">MECHANICS OF MOTHERHOOD</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Engineering better meals for working mothers worldwide.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-energetic-orange transition-colors"
                aria-label="Facebook"
                data-testid="social-link-facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-energetic-orange transition-colors"
                aria-label="Instagram"
                data-testid="social-link-instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-energetic-orange transition-colors"
                aria-label="YouTube"
                data-testid="social-link-youtube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Workshop Links */}
          <div>
            <h4 className="font-industrial text-lg font-semibold mb-4">Workshop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/recipes" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-recipe-manual">
                  Recipe Manual
                </Link>
              </li>
              <li>
                <Link href="/recipes?category=quick-fixes" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-quick-fixes">
                  Quick Fixes
                </Link>
              </li>
              <li>
                <Link href="/recipes?category=kid-friendly" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-kid-friendly">
                  Kid-Friendly Builds
                </Link>
              </li>
              <li>
                <Link href="/recipes?category=meal-prep" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-meal-prep">
                  Meal Prep Systems
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-kitchen-tools">
                  Kitchen Tools
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-industrial text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-maintenance-manual">
                  Maintenance Manual
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-troubleshooting">
                  Troubleshooting Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-community-forum">
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-video-tutorials">
                  Video Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-printable-plans">
                  Printable Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-industrial text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-about-mom">
                  About MoM
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-our-story">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-contact">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-partnerships">
                  Partnerships
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-press-kit">
                  Press Kit
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0" data-testid="copyright-text">
            © {currentYear} Mechanics of Motherhood. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-privacy">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-terms">
              Terms of Service
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-cookies">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
