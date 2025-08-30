import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Leaf, MapPin, Clock, Apple, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import heroImage from '@/assets/hero-image.jpg';
import PaymentModal from '@/components/PaymentModal';
import TransactionHistory from '@/components/TransactionHistory';

const Index = () => {
  const { user, signOut, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Plenti</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
              <Button 
                variant="ghost" 
                onClick={signOut}
                className="text-primary hover:text-primary/80"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero">
        <div className="absolute inset-0 opacity-20">
          <img src={heroImage} alt="Food sharing community" className="w-full h-full object-cover" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Rescue Food, Feed Communities
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect surplus food from farmers and businesses with NGOs and communities. 
            Together, we can reduce waste and fight hunger.
          </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PaymentModal 
                  trigger={
                    <Button size="lg" variant="hero" className="text-lg px-8">
                      <Heart className="mr-2 h-5 w-5" />
                      I Have Food to Share
                    </Button>
                  }
                  paymentType="delivery_fee"
                  suggestedAmount={50}
                />
                <PaymentModal 
                  trigger={
                    <Button size="lg" variant="ghost" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white/30">
                      <Users className="mr-2 h-5 w-5" />
                      Send Donation
                    </Button>
                  }
                  paymentType="donation"
                  suggestedAmount={200}
                />
              </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">12.5K</div>
              <div className="text-muted-foreground">Meals Rescued</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-success">850</div>
              <div className="text-muted-foreground">Families Fed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">3.2T</div>
              <div className="text-muted-foreground">CO₂ Saved (kg)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Food Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Available Food Near You</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fresh produce and prepared food ready for pickup. Every item saves money and reduces waste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Food Item Cards */}
            <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Fresh Produce
                  </Badge>
                  <Badge variant="outline" className="text-warning">
                    <Clock className="mr-1 h-3 w-3" />
                    2 days left
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Apple className="h-8 w-8 text-accent mt-1" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">Mixed Vegetables & Fruits</CardTitle>
                    <CardDescription>
                      Fresh carrots, apples, and leafy greens. Perfect for families.
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    1.2 km away
                  </div>
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4" />
                    Green Valley Farm
                  </div>
                </div>
                <PaymentModal 
                  trigger={
                    <Button className="w-full" variant="outline">
                      Request Pickup + Pay Fee (KES 20)
                    </Button>
                  }
                  paymentType="delivery_fee"
                  suggestedAmount={20}
                />
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    Prepared Food
                  </Badge>
                  <Badge variant="outline" className="text-destructive">
                    <Clock className="mr-1 h-3 w-3" />
                    Today only
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Heart className="h-8 w-8 text-primary mt-1" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">Fresh Sandwiches & Soup</CardTitle>
                    <CardDescription>
                      Vegetarian sandwiches and hot soup, serves 20 people.
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    0.8 km away
                  </div>
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4" />
                    City Cafe
                  </div>
                </div>
                <PaymentModal 
                  trigger={
                    <Button className="w-full">
                      Reserve Now + Donate (KES 50)
                    </Button>
                  }
                  paymentType="donation"
                  suggestedAmount={50}
                />
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Grocery Items
                  </Badge>
                  <Badge variant="outline" className="text-warning">
                    <Clock className="mr-1 h-3 w-3" />
                    3 days left
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Leaf className="h-8 w-8 text-success mt-1" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">Bread & Dairy Products</CardTitle>
                    <CardDescription>
                      Fresh bread, milk, and cheese approaching sell-by date.
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    2.1 km away
                  </div>
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4" />
                    Metro Supermarket
                  </div>
                </div>
                <PaymentModal 
                  trigger={
                    <Button className="w-full" variant="outline">
                      Request Pickup + Pay Fee (KES 30)
                    </Button>
                  }
                  paymentType="delivery_fee"
                  suggestedAmount={30}
                />
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12 space-y-4">
            <Button variant="outline" size="lg">
              View All Available Food
            </Button>
            <TransactionHistory />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">How Plenti Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to rescue food and help your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold">Share Your Surplus</h4>
              <p className="text-muted-foreground">
                Post your extra food with photos, quantity, and pickup details
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-food rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold">Get Matched</h4>
              <p className="text-muted-foreground">
                Our AI connects you with nearby recipients based on location and need
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-earth rounded-full flex items-center justify-center mx-auto">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold">Make Impact</h4>
              <p className="text-muted-foreground">
                Coordinate pickup and see your positive impact on the community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Plenti</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Connecting communities to reduce food waste and fight hunger
          </p>
          <div className="flex flex-wrap justify-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;