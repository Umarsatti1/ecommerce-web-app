import { useState, useEffect } from "react";
import { MapPin, Clock, Mail, Phone } from "lucide-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Container } from "@mui/material";

export default function Contact() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingComponent message="Loading Contact Page..." />;

  return (
    <>
      {/* Page Heading */}
      <div className="w-full bg-gray-300 py-6">
        <h1 className="text-center text-4xl font-bold">Contact Us</h1>
      </div>
    <Container>
    <div className="container mx-auto px-4 pb-32 mt-16">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">Get In Touch</h2>

      <div className="flex flex-col md:flex-row md:gap-8">
        {/* Contact Form */}
        <div className="w-full md:w-2/3">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 p-3 rounded-md text-gray-800"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 p-3 rounded-md text-gray-800"
            />
            <input
              type="text"
              placeholder="Subject"
              className="col-span-2 w-full border border-gray-300 p-3 rounded-md text-gray-800"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="col-span-2 w-full border border-gray-300 p-3 rounded-md text-gray-800"
            />
            <button
              type="submit"
              className="col-span-2 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="w-full md:w-1/3 mt-8 md:mt-0">
          <ul className="space-y-6">
            <li className="flex items-start">
              <div className="p-2 rounded-full bg-black text-white">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">Location:</h4>
                <p className="text-gray-600">
                  40 Raymouth Rd, Baltemoer, New York City 40000
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="p-2 rounded-full bg-black text-white">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">Open Hours:</h4>
                <p className="text-gray-600">Sunday-Friday: 11:00 AM - 11:00 PM</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="p-2 rounded-full bg-black text-white">
                <Mail className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">Email:</h4>
                <p className="text-gray-600">info@colorlib.com</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="p-2 rounded-full bg-black text-white">
                <Phone className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">Call:</h4>
                <p className="text-gray-600">+1 1234 55488 55</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </Container>
    </>
  );
}