"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Send, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate email sending
    setTimeout(() => {
      setIsLoading(false)
      setIsEmailSent(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative w-full max-w-md">
        {/* Back to Login */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-[#ffc000]">
            <Link href="/login" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </Button>
        </div>

        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-modern-xl mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Mot de passe oublié
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEmailSent ? "Vérifiez votre boîte email" : "Entrez votre email pour réinitialiser votre mot de passe"}
          </p>
        </div>

        {/* Reset Password Card */}
        <Card className="gradient-card border-0 shadow-modern-xl backdrop-blur-sm">
          {!isEmailSent ? (
            <>
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-xl font-bold text-center text-gray-900 dark:text-white">
                  Réinitialisation
                </CardTitle>
                <CardDescription className="text-center">
                  Nous vous enverrons un lien de réinitialisation par email
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Adresse email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@lemerle.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:border-[#ffc000] focus:ring-[#ffc000] transition-colors"
                        required
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    type="submit"
                    className="w-full h-12 gradient-primary text-white shadow-modern-lg hover:shadow-modern-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer le lien
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1 pb-6 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Email envoyé !</CardTitle>
                <CardDescription>
                  Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-center">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Vérifiez votre boîte de réception et vos spams. Le lien expire dans 15 minutes.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="pt-6 space-y-3">
                <Button
                  onClick={() => setIsEmailSent(false)}
                  variant="outline"
                  className="w-full h-12 border-gray-200 dark:border-gray-700"
                >
                  Renvoyer l'email
                </Button>
                <Button asChild className="w-full h-12 gradient-primary text-white shadow-modern-lg">
                  <Link href="/login">Retour à la connexion</Link>
                </Button>
              </CardFooter>
            </>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>© 2025 Le Merle Administration. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}
