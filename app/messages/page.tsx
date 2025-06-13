"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Trash2, Mail, Phone, Calendar, Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: number
  name: string
  email: string
  phone: string
  message: string
  date: string
  read: boolean
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/messages")
      const data = await response.json()

      if (data.success) {
        // Convertir les valeurs numériques en boolean pour le champ read
        const formattedMessages = data.messages.map((msg: any) => ({
          ...msg,
          read: Boolean(msg.read),
        }))
        setMessages(formattedMessages)
      } else {
        setError(data.error || "Erreur lors du chargement des messages")
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  const toggleReadStatus = async (id: number, currentStatus: boolean) => {
    try {
      setActionLoading(id)

      const response = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: !currentStatus }),
      })

      const data = await response.json()

      if (data.success) {
        setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, read: !currentStatus } : msg)))
        toast({
          title: "Succès",
          description: `Message marqué comme ${!currentStatus ? "lu" : "non lu"}`,
        })
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la mise à jour",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const deleteMessage = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      return
    }

    try {
      setActionLoading(id)

      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id))
        toast({
          title: "Succès",
          description: "Message supprimé avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la suppression",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return (
      date.toLocaleDateString("fr-FR") +
      " " +
      date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    )
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Chargement des messages...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <Button onClick={fetchMessages} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchMessages}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {unreadCount} nouveau{unreadCount !== 1 ? "x" : ""} message{unreadCount !== 1 ? "s" : ""}
          </span>
          <Button onClick={fetchMessages} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun message trouvé</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Tous ({messages.length})</TabsTrigger>
            <TabsTrigger value="unread">Non lus ({unreadCount})</TabsTrigger>
            <TabsTrigger value="read">Lus ({messages.length - unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onToggleRead={toggleReadStatus}
                onDelete={deleteMessage}
                actionLoading={actionLoading}
                formatDate={formatDate}
              />
            ))}
          </TabsContent>

          <TabsContent value="unread" className="mt-4 space-y-4">
            {messages
              .filter((m) => !m.read)
              .map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onToggleRead={toggleReadStatus}
                  onDelete={deleteMessage}
                  actionLoading={actionLoading}
                  formatDate={formatDate}
                />
              ))}
            {messages.filter((m) => !m.read).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun message non lu</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="read" className="mt-4 space-y-4">
            {messages
              .filter((m) => m.read)
              .map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onToggleRead={toggleReadStatus}
                  onDelete={deleteMessage}
                  actionLoading={actionLoading}
                  formatDate={formatDate}
                />
              ))}
            {messages.filter((m) => m.read).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun message lu</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function MessageCard({
  message,
  onToggleRead,
  onDelete,
  actionLoading,
  formatDate,
}: {
  message: Message
  onToggleRead: (id: number, currentStatus: boolean) => void
  onDelete: (id: number) => void
  actionLoading: number | null
  formatDate: (date: string) => string
}) {
  const isLoading = actionLoading === message.id

  return (
    <Card className={message.read ? "" : "border-l-4 border-l-[#ffc000]"}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {message.name}
              {!message.read && (
                <Badge variant="default" className="bg-[#ffc000] text-primary-foreground">
                  Nouveau
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Mail className="mr-1 h-3 w-3" />
                {message.email}
              </div>
              <div className="flex items-center">
                <Phone className="mr-1 h-3 w-3" />
                {message.phone}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(message.date)}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onToggleRead(message.id, message.read)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : message.read ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(message.id)}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{message.message}</p>
      </CardContent>
    </Card>
  )
}
