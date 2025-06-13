
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const result = await response.json();

      if (result.success) {
        setServices(result.data);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors du chargement des services",
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
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le service "${title}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Succès",
          description: "Service supprimé avec succès",
        });
        await fetchServices();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de la suppression",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 space-y-8 p-6 md:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Services
          </h2>
          <p className="text-muted-foreground mt-2">
            Gérez vos services et offres • {services.length} services au total
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button
            asChild
            className="gradient-primary text-white shadow-modern-lg hover:shadow-modern-xl transition-all duration-300"
          >
            <Link href="/services/add" className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un service
            </Link>
          </Button>
        </div>
      </div>

      {services.length === 0 ? (
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle>Aucun service trouvé</CardTitle>
            <CardDescription>Commencez par ajouter votre premier service.</CardDescription>
          </CardHeader>
          <Button asChild className="mt-4">
            <Link href="/services/add">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un service
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.id}
              className="group gradient-card border-0 shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                {service.image ? (
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title_fr}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300";
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Aucune image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-gray-900 dark:text-white group-hover:text-[#ffc000] transition-colors">
                      {service.title_fr}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      ID: #{service.id.toString().padStart(3, "0")}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-[#ffc000]/10 hover:text-[#ffc000]"
                      asChild
                    >
                      <Link href={`/services/edit/${service.id}`}>
                        <Pencil className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDelete(service.id, service.title_fr)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-medium text-[#ffc000] uppercase tracking-wide">Français</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {service.description_fr}
                    </p>
                    <ul className="mt-1 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                      {service.features_fr.map((feature, index) => (
                        <li key={index} className="line-clamp-1">{feature}</li>
                      ))}
                      {service.features_fr.length > 2 && <li className="text-xs text-gray-400">+{service.features_fr.length - 2} autres</li>}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-[#ffc000] uppercase tracking-wide">English</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {service.description_en}
                    </p>
                    <ul className="mt-1 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                      {service.features_en.slice(0, 2).map((feature, index) => (
                        <li key={index} className="line-clamp-1">{feature}</li>
                      ))}
                      {service.features_en.length > 2 && <li className="text-xs text-gray-400">+{service.features_en.length - 2} others</li>}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-[#ffc000] uppercase tracking-wide">العربية</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2" dir="rtl">
                      {service.description_ar}
                    </p>
                    <ul className="mt-1 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside" dir="rtl">
                      {service.features_ar.slice(0, 2).map((feature, index) => (
                        <li key={index} className="line-clamp-1">{feature}</li>
                      ))}
                      {service.features_ar.length > 2 && <li className="text-xs text-gray-400">+{service.features_ar.length - 2} أخرى</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
