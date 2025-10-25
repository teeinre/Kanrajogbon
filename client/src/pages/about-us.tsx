
import { Link } from "wouter";
import { ArrowLeft, Users, Target, Eye, Heart, Shield, Trophy, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="inline-flex items-center text-finder-red hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-finder-red to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About FinderMeister</h1>
          <p className="text-xl md:text-2xl font-light max-w-4xl mx-auto leading-relaxed">
            One Successful Find at a Time
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Our Story */}
        <section className="mb-16">
          <div className="prose max-w-none text-gray-700 text-lg leading-relaxed space-y-6">
            <p>
              At FinderMeister, we believe that every need — big or small — deserves a solution. 
              Our mission is to connect people who are looking for a product or service with trusted individuals, called Finders, who can help them get it safely, quickly, and efficiently.
            </p>
            <p>
              Whether it's a rare collectible, a home service, or a specific item that's hard to find, FinderMeister empowers people to post a request and get real human help — not just search results.
            </p>
            
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Why We Exist</h2>
            <p>
              Too often, people waste hours searching online or walking store to store without success. At the same time, many others have the skill, time, or network to locate those items but lack a structured, trustworthy way to offer their help.
            </p>
            <p>
              FinderMeister bridges that gap. 
              We've built a human-powered search platform backed by escrow protection, reviews, and gamified reputation levels (from Novice to GrandMeister), ensuring that every transaction is transparent, secure, and rewarding for both sides.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-finder-red transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-finder-red/10 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-finder-red" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Trust</h3>
                <p className="text-gray-600 text-center">
                  Every finder is verified, and every transaction is protected.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-finder-red transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-finder-red/10 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-finder-red" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Community</h3>
                <p className="text-gray-600 text-center">
                  A growing network where help is a value, not just a service.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-finder-red transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-finder-red/10 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-finder-red" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Safety</h3>
                <p className="text-gray-600 text-center">
                  Your funds stay secure in escrow until you confirm delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-finder-red transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-finder-red/10 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-finder-red" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Innovation</h3>
                <p className="text-gray-600 text-center">
                  Combining technology with human intuition to make finding simple again.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Find */}
        <section className="mb-16 bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">What We Find</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-2 text-finder-red">Cultural & Events</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Aso Ebi fabrics for traditional ceremonies</li>
                <li>Vintage props for film and theatre</li>
                <li>Custom event decorations and materials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2 text-finder-red">Real Estate Solutions</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Short-stay vacation rentals</li>
                <li>Long-term property finds</li>
                <li>Commercial and residential spaces</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2 text-finder-red">Rare & Collectibles</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Vintage items and antiques</li>
                <li>Limited edition products</li>
                <li>Hard-to-source materials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2 text-finder-red">Niche Services</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Specialized professional services</li>
                <li>Custom manufacturing and sourcing</li>
                <li>Research and procurement services</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FinderToken Refund Policy */}
        <section className="mb-16 bg-amber-50 rounded-lg shadow-sm border-2 border-amber-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Coins className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl font-bold text-gray-900">FinderToken Refund Policy</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-amber-200">
              <h3 className="text-xl font-semibold text-finder-red mb-4">For Finders (Proposal Tokens)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Tokens spent on proposals <strong>will be refunded</strong> if the Client's post is canceled due to a violation of FinderMeister's Terms of Service (fraudulent, scam, spam, or otherwise invalid).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Tokens are <strong>not refunded</strong> if the proposal is simply unsuccessful (not selected by the Client).</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 border border-amber-200">
              <h3 className="text-xl font-semibold text-finder-red mb-4">For Clients (Boost & High-Budget Posting)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Tokens used for boosts or high-budget postings are <strong>non-refundable under all circumstances</strong>.</span>
                </li>
              </ul>
            </div>

            <div className="bg-finder-red/5 rounded-lg p-4 border border-finder-red/20">
              <p className="text-sm text-gray-600 italic">
                <strong>Note:</strong> All FinderToken policies are subject to our complete Terms of Service. For full details on token expiry, usage limits, and other conditions, please review our <Link href="/terms-and-conditions" className="text-finder-red hover:underline">Terms and Conditions</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Our Vision */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-finder-red/5 to-red-100 border-finder-red/20">
            <CardContent className="pt-8">
              <div className="flex items-center gap-4 mb-4">
                <Eye className="w-10 h-10 text-finder-red" />
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <blockquote className="text-lg text-gray-700 leading-relaxed italic border-l-4 border-finder-red pl-4">
                To become the world's most reliable human-powered search platform — where every request matters, and every solution begins with one successful find.
              </blockquote>
            </CardContent>
          </Card>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-8">
              <div className="flex items-center gap-4 mb-4">
                <Target className="w-10 h-10 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <blockquote className="text-lg text-gray-700 leading-relaxed italic border-l-4 border-blue-600 pl-4">
                To empower people to find what they need through a trusted network of human searchers — delivering solutions, one successful find at a time.
              </blockquote>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-white rounded-lg shadow-lg p-12">
          <Heart className="w-16 h-16 text-finder-red mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're seeking hard-to-find solutions or ready to become a trusted Finder, FinderMeister is your platform for making the impossible, possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-finder-red hover:bg-finder-red-dark text-white px-8 py-6 text-lg">
                Become a Client
              </Button>
            </Link>
            <Link href="/register/finder">
              <Button variant="outline" className="border-finder-red text-finder-red hover:bg-finder-red hover:text-white px-8 py-6 text-lg">
                Become a Finder
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
