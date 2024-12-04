import { useState, useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Container } from "@mui/material";

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingComponent message="Loading About Page..." />;

  return (
    <>
      {/* Page Heading */}
      <div className="w-full bg-gray-300 py-6">
        <h1 className="text-center text-4xl font-bold">About Us</h1>
      </div>
      <div className="py-12 mb-24">
        <Container>
          <div className="container mx-auto px-4">
            {/* Our Story Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                  consequat consequat enim, non auctor massa ultrices non. Morbi
                  sed odio massa. Quisque at vehicula tellus, sed tincidunt augue.
                  Orci varius natoque penatibus et magnis dis parturient montes,
                  nascetur ridiculus mus. Maecenas varius egestas diam, eu sodales
                  metus scelerisque congue. Pellentesque habitant morbi tristique
                  senectus et netus et malesuada fames ac turpis egestas.
                </p>
                <p className="text-gray-600 mb-6">
                  Donec gravida lorem elit, quis condimentum ex semper sit amet.
                  Fusce eget ligula magna. Aliquam aliquam imperdiet sodales.
                </p>
                <p className="text-gray-600">
                  Any questions? Let us know in store at 8th floor, 379 Hudson St,
                  New York, NY 10018 or call us on (+1) 96 716 6879.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/images/about-1.jpg"
                  alt="Our Story Image"
                  className="h-80 object-cover rounded-md"
                />
              </div>
            </div>

            {/* Our Mission Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="flex items-center justify-center order-last md:order-first">
                <img
                  src="/images/about-2.jpg"
                  alt="Our Mission Image"
                  className="h-80 object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                  Mauris non lacinia magna. Sed nec lobortis dolor. Vestibulum
                  rhoncus dignissim risus, sed consectetur erat. Pellentesque
                  habitant morbi tristique senectus et netus et malesuada fames ac
                  turpis egestas.
                </p>
                <blockquote className="border-l-4 border-gray-300 pl-4 text-gray-600 italic">
                  Creativity is just connecting things. When you ask creative people
                  how they did something, they feel a little guilty because they
                  didn’t really do it, they just saw something. It seemed obvious to
                  them after a while.
                  <br />
                  <span className="font-bold">- Steve Jobs</span>
                </blockquote>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
