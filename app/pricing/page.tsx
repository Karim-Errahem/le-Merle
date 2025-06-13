"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Check, Loader2, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface PricingPlan {
  id: number;
  name_fr: string;
  description_fr: string;
  name_en: string;
  description_en: string;
  name_ar: string;
  description_ar: string;
  price_monthly: string;
  price_yearly: string;
  features_fr: string[];
  features_en: string[];
  features_ar: string[];
  popular: boolean;
}

export default function PricingPlansPage() {
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [language, setLanguage] = useState<"fr" | "en" | "ar">("fr");

  const fetchPricingPlans = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/pricing");
      const result = await response.json();

      if (response.ok) {
        setPricingPlans(result.data);
        setError(null);
      } else {
        setError(result.error || "Erreur lors du chargement des plans tarifaires");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce plan tarifaire ?")) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/pricing/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        fetchPricingPlans();
      } else {
        setError(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur de connexion");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-6 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Chargement...</CardTitle>
            </CardHeader>
            <CardContent>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Plans tarifaires
          </h2>
          <p className="text-muted-foreground mt-2">
            Gérez vos offres et tarifs • {pricingPlans.length} plans disponibles
          </p>
        </div>
        <div className="flex items-center gap-3">
      
          <Button
            asChild
            className="gradient-primary text-white shadow-modern-lg hover:shadow-modern-xl transition-all duration-300"
          >
            <Link href="/pricing/add" className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un plan
            </Link>
          </Button>
        </div>
      </div>

      {/* Language Selector */}
      <Tabs value={language} onValueChange={(value) => setLanguage(value as "fr" | "en" | "ar")} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="fr">Français</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">العربية</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Pricing Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`group gradient-card border-0 shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 overflow-hidden ${
              plan.popular ? "ring-2 ring-[#ffc000]" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-[#ffc000] text-white text-xs font-bold uppercase py-1 px-3 rounded-bl-lg">
                  Populaire
                </div>
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-[#ffc000] transition-colors">
                    {language === "fr" ? plan.name_fr : language === "en" ? plan.name_en : plan.name_ar}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {language === "fr" ? plan.description_fr : language === "en" ? plan.description_en : plan.description_ar}
                  </CardDescription>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-[#ffc000]/10 hover:text-[#ffc000]"
                    asChild
                  >
                    <Link href={`/pricing/edit/${plan.id}`}>
                      <Pencil className="h-3 w-3" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(plan.id)}
                    disabled={deletingId === plan.id}
                  >
                    {deletingId === plan.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">DT</span>
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{plan.price_monthly}</span>
                  <span className="ml-1 text-sm text-muted-foreground">/mois</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">ou DT{plan.price_yearly}/an</div>
              </div>

              <div className="space-y-2 pt-4">
                {(language === "fr" ? plan.features_fr : language === "en" ? plan.features_en : plan.features_ar).map(
                  (feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-[#ffc000] mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300" dir={language === "ar" ? "rtl" : "ltr"}>
                        {feature}
                      </span>
                    </div>
                  ),
                )}
              </div>

              <div className="pt-4 space-y-3">
                {plan.name_en && language !== "en" && (
                  <div>
                    <h4 className="text-xs font-medium text-[#ffc000] uppercase tracking-wide">English</h4>
                    <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">{plan.name_en}</p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{plan.description_en}</p>
                  </div>
                )}
                {plan.name_ar && language !== "ar" && (
                  <div>
                    <h4 className="text-xs font-medium text-[#ffc000] uppercase tracking-wide">العربية</h4>
                    <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300" dir="rtl">
                      {plan.name_ar}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2" dir="rtl">
                      {plan.description_ar}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pricingPlans.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Aucun plan tarifaire trouvé</p>
            <Button asChild>
              <Link href="/pricing/add">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter le premier plan
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}