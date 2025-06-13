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
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AddServicePage() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  // États pour les champs de titre et description
  const [title_fr, setTitleFr] = useState<string>("");
  const [description_fr, setDescriptionFr] = useState<string>("");
  const [title_en, setTitleEn] = useState<string>("");
  const [description_en, setDescriptionEn] = useState<string>("");
  const [title_ar, setTitleAr] = useState<string>("");
  const [description_ar, setDescriptionAr] = useState<string>("");

  // États pour les fonctionnalités
  const [features_fr, setFeaturesFr] = useState<string[]>([

  ]);
  const [features_ar, setFeaturesAr] = useState<string[]>([

  ]);
  const [features_en, setFeaturesEn] = useState<string[]>([
 
  ]);

  const [newFeatureFr, setNewFeatureFr] = useState<string>("");
  const [newFeatureAr, setNewFeatureAr] = useState<string>("");
  const [newFeatureEn, setNewFeatureEn] = useState<string>("");

  const removeFeatureFr = (index: number) => {
    setFeaturesFr(features_fr.filter((_, i) => i !== index));
  };

  const removeFeatureAr = (index: number) => {
    setFeaturesAr(features_ar.filter((_, i) => i !== index));
  };

  const removeFeatureEn = (index: number) => {
    setFeaturesEn(features_en.filter((_, i) => i !== index));
  };

  const addFeatureFr = () => {
    if (newFeatureFr.trim()) {
      setFeaturesFr([...features_fr, newFeatureFr.trim()]);
      setNewFeatureFr("");
    }
  };

  const addFeatureAr = () => {
    if (newFeatureAr.trim()) {
      setFeaturesAr([...features_ar, newFeatureAr.trim()]);
      setNewFeatureAr("");
    }
  };

  const addFeatureEn = () => {
    if (newFeatureEn.trim()) {
      setFeaturesEn([...features_en, newFeatureEn.trim()]);
      setNewFeatureEn("");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: "Erreur",
        description: "Aucun fichier sélectionné",
        variant: "destructive",
      });
      return;
    }

    // Validation du type de fichier
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide (PNG, JPG, JPEG)",
        variant: "destructive",
      });
      return;
    }

    // Validation de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (!base64) {
          toast({
            title: "Erreur",
            description: "Erreur lors de la conversion de l'image en Base64",
            variant: "destructive",
          });
          return;
        }

        console.log("Taille de la chaîne Base64:", base64.length); // Log pour débogage
        console.log("Début de la chaîne Base64:", base64.substring); // Vérifie le début de la chaîne

        // Vérification que la chaîne Base64 commence correctement
        if (!base64.startsWith("data:image/")) {
          toast({
            title: "Erreur",
            description: "La conversion en Base64 a échoué : format invalide",
            variant: "destructive",
          });
          return;
        }

        setImageBase64(base64);
        setImagePreview(base64);

        // Vérification de l'affichage dans l'aperçu
        const img = new Image();
        img.src = base64;
        img.onload = () => {
          console.log("Image chargée avec succès dans l'aperçu");
        };
        img.onerror = () => {
          toast({
            title: "Erreur",
            description: "L'image ne peut pas être affichée correctement",
            variant: "destructive",
          });
        };
      };
      reader.onerror = () => {
        toast({
          title: "Erreur",
          description: "Erreur lors de la lecture du fichier",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du traitement de l'image",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Soumission du formulaire déclenchée");
    setLoading(true);

    try {
      const data = {
        title_fr,
        description_fr,
        title_en,
        description_en,
        title_ar,
        description_ar,
        image: imageBase64,
        features_fr,
        features_en,
        features_ar,
      };

      console.log("Données à envoyer:", data);

      const requiredFields = [
        title_fr,
        description_fr,
        title_en,
        description_en,
        title_ar,
        description_ar,
      ];

      if (requiredFields.some((field) => !field?.trim())) {
        console.log("Champs manquants:", data);
        toast({
          title: "Erreur",
          description: "Tous les champs sont obligatoires",
          variant: "destructive",
        });
        return;
      }

      // Vérification de l'image
      if (imageBase64 && !imageBase64.startsWith("data:image/")) {
        toast({
          title: "Erreur",
          description: "L'image n'est pas au format Base64 valide",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }

      const result = await response.json();
      console.log("Réponse du serveur:", result);

      if (result.success) {
        toast({
          title: "Succès",
          description: "Service ajouté avec succès",
        });
        router.push("/services");
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de l'ajout du service",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi des données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/services">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Ajouter un service</h2>
      </div>

      <form
        onSubmit={(e) => {
          console.log("Formulaire soumis");
          handleSubmit(e);
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Informations du service</CardTitle>
            <CardDescription>Ajoutez un nouveau service avec des descriptions en plusieurs langues.</CardDescription>
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
                      <img src={imagePreview} alt="Aperçu" className="h-full w-full object-contain" />
                    ) : (
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <p className="text-sm font-medium">Glissez-déposez ou cliquez pour télécharger</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, JPEG jusqu'à 5MB</p>
                    <p className="text-xs text-muted-foreground">Recommandé: 600x400px</p>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    Choisir un fichier
                  </Button>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleImageUpload} className="hidden" />
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
                    name="title_fr"
                    placeholder="Titre du service en français"
                    value={title_fr}
                    onChange={(e) => setTitleFr(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_fr">Description (FR) *</Label>
                  <Textarea
                    id="description_fr"
                    name="description_fr"
                    placeholder="Description du service en français"
                    value={description_fr}
                    onChange={(e) => setDescriptionFr(e.target.value)}
                    rows={5}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label>Fonctionnalités</Label>
                  <div className="space-y-2">
                    {features_fr.map((feature, index) => (
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
                          onClick={() => removeFeatureFr(index)}
                          disabled={loading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter une fonctionnalité"
                      value={newFeatureFr}
                      onChange={(e) => setNewFeatureFr(e.target.value)}
                      className="flex-1"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={addFeatureFr}
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
                    name="title_en"
                    placeholder="Service title in English"
                    value={title_en}
                    onChange={(e) => setTitleEn(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_en">Description (EN) *</Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    placeholder="Service description in English"
                    value={description_en}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    rows={5}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label>Features</Label>
                  <div className="space-y-2">
                    {features_en.map((feature, index) => (
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
                          onClick={() => removeFeatureEn(index)}
                          disabled={loading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature"
                      value={newFeatureEn}
                      onChange={(e) => setNewFeatureEn(e.target.value)}
                      className="flex-1"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={addFeatureEn}
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
                    name="title_ar"
                    placeholder="عنوان الخدمة بالعربية"
                    value={title_ar}
                    onChange={(e) => setTitleAr(e.target.value)}
                    dir="rtl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_ar">الوصف (AR) *</Label>
                  <Textarea
                    id="description_ar"
                    name="description_ar"
                    placeholder="وصف الخدمة بالعربية"
                    value={description_ar}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    rows={5}
                    dir="rtl"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label>الميزات</Label>
                  <div className="space-y-2">
                    {features_ar.map((feature, index) => (
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
                          onClick={() => removeFeatureAr(index)}
                          disabled={loading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="إضافة ميزة"
                      value={newFeatureAr}
                      onChange={(e) => setNewFeatureAr(e.target.value)}
                      className="flex-1"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={addFeatureAr}
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
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}