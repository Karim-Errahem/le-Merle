"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Upload, Loader2, X, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: number;
  title_fr: string;
  description_fr: string;
  title_en: string;
  description_en: string;
  title_ar: string;
  description_ar: string;
  image?: string;
  features_fr: string[];
  features_en: string[];
  features_ar: string[];
}

export default function EditServicePage() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [featuresFr, setFeaturesFr] = useState<string[]>([]);
  const [featuresEn, setFeaturesEn] = useState<string[]>([]);
  const [featuresAr, setFeaturesAr] = useState<string[]>([]);
  const [newFeatureFr, setNewFeatureFr] = useState<string>("");
  const [newFeatureEn, setNewFeatureEn] = useState<string>("");
  const [newFeatureAr, setNewFeatureAr] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const serviceId = params.id as string;

  const [formData, setFormData] = useState<Service>({
    id: 0,
    title_fr: "",
    description_fr: "",
    title_en: "",
    description_en: "",
    title_ar: "",
    description_ar: "",
    image: "",
    features_fr: [],
    features_en: [],
    features_ar: [],
  });

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${serviceId}`);
      const result = await response.json();

      if (result.success) {
        setFormData(result.data);
        setFeaturesFr(result.data.features_fr || []);
        setFeaturesEn(result.data.features_en || []);
        setFeaturesAr(result.data.features_ar || []);
        setImagePreview(result.data.image);
        setImageBase64(result.data.image);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Service non trouvé",
          variant: "destructive",
        });
        router.push("/services");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
      router.push("/services");
    } finally {
      setPageLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: "Erreur",
        description: "Aucun fichier sélectionné",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImageBase64(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
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

  const handleInputChange = (field: keyof Service, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const data = {
      title_fr: formData.title_fr,
      description_fr: formData.description_fr,
      title_en: formData.title_en,
      description_en: formData.description_en,
      title_ar: formData.title_ar,
      description_ar: formData.description_ar,
      image: imageBase64,
      features_fr: featuresFr,
      features_en: featuresEn,
      features_ar: featuresAr,
    };

    if (
      !data.title_fr ||
      !data.description_fr ||
      !data.title_en ||
      !data.description_en ||
      !data.title_ar ||
      !data.description_ar ||
      data.features_fr.length === 0 ||
      data.features_en.length === 0 ||
      data.features_ar.length === 0
    ) {
      toast({
        title: "Erreur",
        description: "Tous les champs multilingues et au moins une fonctionnalité par langue sont requis",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (imageBase64 && !imageBase64.startsWith("data:image/")) {
      toast({
        title: "Erreur",
        description: "Format d'image invalide",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Succès",
          description: "Service mis à jour avec succès",
        });
        router.push("/services");
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de la mise à jour du service",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  if (pageLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!formData.id) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Service non trouvé</h2>
          <Button asChild className="mt-4">
            <Link href="/services">Retour aux services</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/services">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Modifier le service #{serviceId}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du service</CardTitle>
            <CardDescription>Modifiez les informations du service en plusieurs langues.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Image du service</Label>
              <div
                className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-4 cursor-pointer hover:border-[#ffc000] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-32 w-48 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Aperçu"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <p className="text-sm font-medium">Glissez-déposez ou cliquez pour changer</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5MB</p>
                    <p className="text-xs text-muted-foreground">Recommandé: 600x400px</p>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    Changer l'image
                  </Button>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            <Tabs defaultValue="fr" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="fr">Français</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>

              <TabsContent value="fr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_fr">Titre (FR) *</Label>
                  <Input
                    id="title_fr"
                    value={formData.title_fr}
                    onChange={(e) => handleInputChange("title_fr", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_fr">Description (FR) *</Label>
                  <Textarea
                    id="description_fr"
                    value={formData.description_fr}
                    onChange={(e) => handleInputChange("description_fr", e.target.value)}
                    rows={5}
                    required
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
                          disabled={loading}
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
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={() => addFeature("fr")}
                      className="gradient-primary text-white shadow-modern"
                      disabled={!newFeatureFr.trim() || loading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_en">Title (EN) *</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => handleInputChange("title_en", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_en">Description (EN) *</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => handleInputChange("description_en", e.target.value)}
                    rows={5}
                    required
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
                          disabled={loading}
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
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={() => addFeature("en")}
                      className="gradient-primary text-white shadow-modern"
                      disabled={!newFeatureEn.trim() || loading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_ar">العنوان (AR) *</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => handleInputChange("title_ar", e.target.value)}
                    dir="rtl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_ar">الوصف (AR) *</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => handleInputChange("description_ar", e.target.value)}
                    rows={5}
                    dir="rtl"
                    required
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
                          disabled={loading}
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
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={() => addFeature("ar")}
                      className="gradient-primary text-white shadow-modern"
                      disabled={!newFeatureAr.trim() || loading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" className="mr-2" asChild>
              <Link href="/services">Annuler</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
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