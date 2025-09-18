import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import About from "@/components/sections/about";
import References from "@/components/sections/references";
import BlogPreview from "@/components/sections/blog-preview";
import ContactForm from "@/components/sections/contact-form";
import FAQ from "@/components/sections/faq";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <References />
        <BlogPreview />
        <ContactForm />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
