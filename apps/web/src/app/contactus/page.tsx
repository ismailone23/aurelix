"use client";

import React, { useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const API_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Get In Touch
            </h1>
            <p className="text-base md:text-lg opacity-70 max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question about our
              products, pricing, or anything else, our team is ready to help.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Side - Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-6 md:p-8 text-white">
                <h2 className="text-xl md:text-2xl font-bold mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="opacity-90 text-sm md:text-base">
                        aurelixperfume@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="opacity-90 text-sm md:text-base">
                        +880 1XXX-XXXXXX
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="opacity-90 text-sm md:text-base">
                        Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <div className="space-y-1 text-sm opacity-70">
                  <p>Saturday - Thursday: 10:00 AM - 8:00 PM</p>
                  <p>Friday: Closed</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3">
              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-800 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>
                    Thank you for your message! We'll get back to you within 24
                    hours.
                  </span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
                  {error}
                </div>
              )}

              <form
                onSubmit={onSubmit}
                className="bg-neutral-50 dark:bg-neutral-900 p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800"
              >
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-11"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-11"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4 md:mb-6">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    className="h-11"
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please tell us more about your inquiry..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="resize-none"
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
