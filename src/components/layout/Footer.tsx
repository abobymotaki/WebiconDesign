import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-screen-2xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center space-x-2">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
                <path d="M6.5 3L2 7V17L6.5 21L11 17V7L6.5 3ZM4 7.5L6.5 5L9 7.5V16.5L6.5 19L4 16.5V7.5Z" />
                <path d="M17.5 3L13 7V17L17.5 21L22 17V7L17.5 3ZM15 7.5L17.5 5L20 7.5V16.5L17.5 19L15 16.5V7.5Z" />
              </svg>
              <span className="font-extrabold text-2xl text-foreground">WebiconDesign</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting talent with opportunity. Find your next freelance project or hire experts for your needs.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Platform</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How it Works</Link></li>
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link></li>
                <li><Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} WebiconDesign. All rights reserved.</p>
          <div className="mt-4 flex space-x-6 sm:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
