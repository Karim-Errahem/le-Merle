
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PricingPlanData {
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

export default function EditPricingPlanPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [featuresFr, setFeaturesFr] = useState<string[]>([]);
  const [featuresEn, setFeaturesEn] = useState<string[]>([]);
  const [featuresAr, setFeaturesAr] = useState<string[]>([]);
  const [newFeatureFr, setNewFeatureFr] = useState("");
  const [newFeatureEn, setNewFeatureEn] = useState("");
  const [newFeatureAr, setNewFeatureAr] = useState("");
  const [isPopular, setIsPopular] = useState(false);

  const [formData, setFormData] = useState<PricingPlanData>({
    id: 0,
    name_fr: "",
    description_fr: "",
    name_en: "",
    description_en: "",
    name_ar: "",
    description_ar: "",
    price_monthly: "",
    price_yearly: "",
    features_fr: [],
    features_en: [],
    features_ar: [],
    popular: false,
  });

  // Charger les données existantes
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setIsLoadingData(true);
        const response = await fetch(`/api/pricing/${planId}`);
        const result = await response.json();

        if (response.ok) {
          setFormData(result.data);
          setFeaturesFr(result.data.features_fr || []);
          setFeaturesEn(result.data.features_en || []);
          setFeaturesAr(result.data.features_ar || []);
          setIsPopular(result.data.popular);
          setError(null);
        } else {
          setError(result.error || "Erreur lors du chargement du plan tarifaire");
        }
      } catch (error) {
        console.error("Erreur:", error);
        setError("Erreur de connexion");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (planId) {
      fetchPlan();
    }
  }, [planId]);

  const handleInputChange = (field: keyof PricingPlanData, value: string | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addFeature = (lang: "fr" | "en" | "ar") => {
    if (lang === "fr" && newFeatureFr.trim()) {
      const updatedFeatures = [...featuresFr, newFeatureFr.trim()];
      setFeaturesFr(updatedFeatures);
      setFormData((prev) => ({ ...prev, features_fr: updatedFeatures }));
      setNewFeatureFr("");
    } else if (lang === "en" && newFeatureEn.trim()) {
      const updatedFeatures = [...featuresEn, newFeatureEn.trim()];
      setFeaturesEn(updatedFeatures);
      setFormData((prev) => ({ ...prev, features_en: updatedFeatures }));
      setNewFeatureEn("");
    } else if (lang === "ar" && newFeatureAr.trim()) {
      const updatedFeatures = [...featuresAr, newFeatureAr.trim()];
      setFeaturesAr(updatedFeatures);
      setFormData((prev) => ({ ...prev, features_ar: updatedFeatures }));
      setNewFeatureAr("");
    }
  };

  const removeFeature = (lang: "fr" | "en" | "ar", index: number) => {
    if (lang === "fr") {
      const updatedFeatures = featuresFr.filter((_, i) => i !== index);
      setFeaturesFr(updatedFeatures);
      setFormData((prev) => ({ ...prev, features_fr: updatedFeatures }));
    } else if (lang === "en") {
      const updatedFeatures = featuresEn.filter((_, i) => i !== index);
      setFeaturesEn(updatedFeatures);
      setFormData((prev) => ({ ...prev, features_en: updatedFeatures }));
    } else if (lang === "ar") {
      const updatedFeatures = featuresAr.filter((_, i) => i !== index);
      setFeaturesAr(updatedFeatures);
      setFormData((prev) => ({ ...prev, features_ar: updatedFeatures }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation des champs requis
    if (!formData.name_fr || !formData.description_fr || !formData.price_monthly || !formData.price_yearly) {
      setError("Veuillez remplir tous les champs obligatoires");
      setIsLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        features_fr: featuresFr,
        features_en: featuresEn,
        features_ar: featuresAr,
        popular: isPopular,
      };

      const response = await fetch(`/api/pricing/${planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/pricing");
        }, 2000);
      } else {
        setError(result.error || "Erreur lors de la mise à jour du plan tarifaire");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex-1 space-y-4 p-6 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Chargement...</CardTitle>
              <CardDescription>Récupération des données du plan tarifaire</CardDescription>
            </CardHeader>
            <CardContent>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex-1 space-y-4 p-6 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-green-600">✅ Plan tarifaire mis à jour !</CardTitle>
              <CardDescription>Le plan a été modifié with| modifié avec succès. Redirection en cours...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/pricing">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
        </Button>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
          Modifier le plan #{planId}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="gradient-card border-0 shadow-modern-lg">
          <CardHeader>
            <CardTitle>Informations du plan</CardTitle>
            <CardDescription>Modifiez les détails du plan tarifaire.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price_monthly">Prix mensuel En DT *</Label>
                <div className="flex">
                  <div className="flex-shrink-0">
                  
                  </div>
                  <Input
                    id="price_monthly"
                    type="number"
                    className="flex-1 rounded-l-none"
                    min="0"
                    step="0.01"
                    value={formData.price_monthly}
                    onChange={(e) => handleInputChange("price_monthly", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_yearly">Prix annuel En DT *</Label>
                <div className="flex">
                  <div className="flex-shrink-0">
                
                  </div>
                  <Input
                    id="price_yearly"
                    type="number"
                    className="flex-1 rounded-l-none"
                    min="0"
                    step="0.01"
                    value={formData.price_yearly}
                    onChange={(e) => handleInputChange("price_yearly", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="popular" checked={isPopular} onCheckedChange={setIsPopular} disabled={isLoading} />
              <Label htmlFor="popular" className="cursor-pointer">
                Marquer comme plan populaire
              </Label>
            </div>

            <Tabs defaultValue="fr" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="fr">Français</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>

              <TabsContent value="fr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name_fr">Nom (FR) *</Label>
                  <Input
                    id="name_fr"
                    value={formData.name_fr}
                    onChange={(e) => handleInputChange("name_fr", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_fr">Description (FR) *</Label>
                  <Textarea
                    id="description_fr"
                    value={formData.description_fr}
                    onChange={(e) => handleInputChange("description_fr", e.target.value)}
                    rows={3}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Fonctionnalités (FR)</Label>
                  <div className="space-y-2">
                    {featuresFr.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/50 dark:bg-white/5 rounded-md"
                      >
                        <span className="text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeFeature("fr", index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter une fonctionnalité en français"
                      value={newFeatureFr}
                      onChange={(e) => setNewFeatureFr(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={() => addFeature("fr")}
                      className="gradient-primary text-white shadow-modern"
                      disabled={!newFeatureFr.trim() || isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name_en">Name (EN)</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => handleInputChange("name_en", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_en">Description (EN)</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => handleInputChange("description_en", e.target.value)}
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Features (EN)</Label>
                  <div className="space-y-2">
                    {featuresEn.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/50 dark:bg-white/5 rounded-md"
                      >
                        <span className="text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeFeature("en", index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature in English"
                      value={newFeatureEn}
                      onChange={(e) => setNewFeatureEn(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={() => addFeature("en")}
                      className="gradient-primary text-white shadow-modern"
                      disabled={!newFeatureEn.trim() || isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name_ar">الاسم (AR)</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => handleInputChange("name_ar", e.target.value)}
                    dir="rtl"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_ar">الوصف (AR)</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => handleInputChange("description_ar", e.target.value)}
                    rows={3}
                    dir="rtl"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-3">
                  <Label>الميزات (AR)</Label>
                  <div className="space-y-2">
                    {featuresAr.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/50 dark:bg-white/5 rounded-md"
                      >
                        <span className="text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeFeature("ar", index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="إضافة ميزة بالعربية"
                      value={newFeatureAr}
                      onChange={(e) => setNewFeatureAr(e.target.value)}
                      className="flex-1"
                      dir="rtl"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={() => addFeature("ar")}
                      className="gradient-primary text-white shadow-modern"
                      disabled={!newFeatureAr.trim() || isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" className="mr-2" asChild disabled={isLoading}>
              <Link href="/pricing">Annuler</Link>
            </Button>
            <Button type="submit" className="gradient-primary text-white shadow-modern-lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
