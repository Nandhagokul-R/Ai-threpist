"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Heart,
    Sparkles,
    Trash2,
    Download,
    Share2,
    Settings,
    Crown,
    Zap,
    Star,
    CheckCircle2,
    ArrowRight
} from "lucide-react";

export default function ButtonShowcase() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-20 px-4">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Premium Button Showcase
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A collection of unique, professional button designs for your AI Therapist application
                    </p>
                </div>

                {/* Primary Action Buttons */}
                <Card className="backdrop-blur-md bg-card/80">
                    <CardHeader>
                        <CardTitle>Primary Action Buttons</CardTitle>
                        <CardDescription>Eye-catching buttons for main calls-to-action</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Button variant="default" className="w-full" size="lg">
                                <Sparkles className="w-4 h-4" />
                                Default Button
                            </Button>
                            <p className="text-xs text-muted-foreground">Shimmer gradient effect</p>
                        </div>

                        <div className="space-y-2">
                            <Button variant="animated" className="w-full" size="lg">
                                <Zap className="w-4 h-4" />
                                Animated Gradient
                            </Button>
                            <p className="text-xs text-muted-foreground">Continuous color wave</p>
                        </div>

                        <div className="space-y-2">
                            <Button variant="neon" className="w-full" size="lg">
                                <Star className="w-4 h-4" />
                                Neon Glow
                            </Button>
                            <p className="text-xs text-muted-foreground">Pulsing neon effect</p>
                        </div>

                        <div className="space-y-2">
                            <Button variant="premium" className="w-full" size="lg">
                                <Crown className="w-4 h-4" />
                                Premium Gold
                            </Button>
                            <p className="text-xs text-muted-foreground">Luxury gold shimmer</p>
                        </div>

                        <div className="space-y-2">
                            <Button variant="raised" className="w-full" size="lg">
                                <CheckCircle2 className="w-4 h-4" />
                                3D Raised
                            </Button>
                            <p className="text-xs text-muted-foreground">Physical push effect</p>
                        </div>

                        <div className="space-y-2">
                            <Button variant="success" className="w-full" size="lg">
                                <Heart className="w-4 h-4" />
                                Success Green
                            </Button>
                            <p className="text-xs text-muted-foreground">Emerald confirmation</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Secondary Buttons */}
                <Card className="backdrop-blur-md bg-card/80">
                    <CardHeader>
                        <CardTitle>Secondary & Support Buttons</CardTitle>
                        <CardDescription>Subtle, elegant buttons for secondary actions</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Button variant="glass" className="w-full">
                                <Settings className="w-4 h-4" />
                                Glass
                            </Button>
                            <p className="text-xs text-muted-foreground">Frosted glass effect</p>
                        </div>

                        <div className="space-y-2">
                            <Button variant="soft" className="w-full">
                                <Heart className="w-4 h-4" />
                                Soft Pastel
                            </Button>
                            <p className="text-xs text-muted-foreground">Gentle rose gradient</p>
                        </div>

                        <div className="space-y-2">
                            <Button variant="outline" className="w-full">
                                <Download className="w-4 h-4" />
                                Outline
                            </Button>
                            <p className="text-xs text-muted-foreground">Premium glass border</p>
                        </div>

                        <div className="space-y-2">
                            <Button variant="secondary" className="w-full">
                                <Share2 className="w-4 h-4" />
                                Secondary
                            </Button>
                            <p className="text-xs text-muted-foreground">Soft auxiliary style</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Utility Buttons */}
                <Card className="backdrop-blur-md bg-card/80">
                    <CardHeader>
                        <CardTitle>Utility Buttons</CardTitle>
                        <CardDescription>Ghost, link, and dark mode optimized buttons</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Button variant="ghost" className="w-full">
                                Ghost Button
                            </Button>
                            <p className="text-xs text-muted-foreground">Minimal hover effect</p>
                        </div>

                        <div className="space-y-2">
                            <Button variant="link" className="w-full">
                                Link Button →
                            </Button>
                            <p className="text-xs text-muted-foreground">Text with decoration</p>
                        </div>

                        <div className="space-y-2">
                            <Button variant="dark" className="w-full">
                                Dark Theme
                            </Button>
                            <p className="text-xs text-muted-foreground">Slate gradient</p>
                        </div>

                        <div className="space-y-2">
                            <Button variant="destructive" className="w-full">
                                <Trash2 className="w-4 h-4" />
                                Destructive
                            </Button>
                            <p className="text-xs text-muted-foreground">Warning red</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Button Sizes */}
                <Card className="backdrop-blur-md bg-card/80">
                    <CardHeader>
                        <CardTitle>Button Sizes</CardTitle>
                        <CardDescription>Different size options for various use cases</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="space-y-2">
                                <Button variant="animated" size="sm">
                                    Small
                                </Button>
                                <p className="text-xs text-muted-foreground">Compact</p>
                            </div>

                            <div className="space-y-2">
                                <Button variant="animated" size="default">
                                    Default
                                </Button>
                                <p className="text-xs text-muted-foreground">Standard</p>
                            </div>

                            <div className="space-y-2">
                                <Button variant="animated" size="lg">
                                    Large
                                </Button>
                                <p className="text-xs text-muted-foreground">Prominent</p>
                            </div>

                            <div className="space-y-2">
                                <Button variant="animated" size="xl">
                                    Extra Large
                                </Button>
                                <p className="text-xs text-muted-foreground">Hero CTA</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm font-semibold mb-4">Icon Buttons</p>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="space-y-2">
                                    <Button variant="neon" size="icon-sm">
                                        <Heart className="w-4 h-4" />
                                    </Button>
                                    <p className="text-xs text-muted-foreground">Small</p>
                                </div>

                                <div className="space-y-2">
                                    <Button variant="neon" size="icon">
                                        <Heart className="w-4 h-4" />
                                    </Button>
                                    <p className="text-xs text-muted-foreground">Default</p>
                                </div>

                                <div className="space-y-2">
                                    <Button variant="neon" size="icon-lg">
                                        <Heart className="w-5 h-5" />
                                    </Button>
                                    <p className="text-xs text-muted-foreground">Large</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Button Combinations */}
                <Card className="backdrop-blur-md bg-card/80">
                    <CardHeader>
                        <CardTitle>Creative Combinations</CardTitle>
                        <CardDescription>Real-world usage examples with icons and text</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Button variant="animated" size="lg" className="w-full justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    <span>Start Therapy Session</span>
                                </div>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <Button variant="neon" size="lg" className="w-full justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    <span>Mental Health Quiz</span>
                                </div>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <Button variant="premium" size="lg" className="w-full justify-between">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-5 h-5" />
                                    <span>Upgrade to Premium</span>
                                </div>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <Button variant="success" size="lg" className="w-full">
                                <CheckCircle2 className="w-5 h-5" />
                                Save Changes
                            </Button>

                            <Button variant="glass" size="lg" className="w-full">
                                <Settings className="w-5 h-5" />
                                Settings
                            </Button>

                            <Button variant="destructive" size="lg" className="w-full">
                                <Trash2 className="w-5 h-5" />
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Interactive Demo */}
                <Card className="backdrop-blur-md bg-card/80">
                    <CardHeader>
                        <CardTitle>Interactive States</CardTitle>
                        <CardDescription>Try hovering, clicking, and focusing these buttons</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="raised" size="lg" className="w-full">
                            Click Me! (3D Push)
                        </Button>

                        <Button variant="neon" size="lg" className="w-full">
                            Hover for Glow
                        </Button>

                        <Button variant="animated" size="lg" className="w-full">
                            Watch the Gradient ✨
                        </Button>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center pt-8 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        All buttons support dark mode, keyboard navigation, and screen readers
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="glass" size="sm">
                            View Documentation
                        </Button>
                        <Button variant="outline" size="sm">
                            Copy Code Examples
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
