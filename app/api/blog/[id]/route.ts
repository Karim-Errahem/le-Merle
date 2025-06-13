import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import NodeCache from "node-cache"
import pool from '@/lib/db'
// Initialize cache with 5-minute TTL
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 })

// Define interface for blog post data
interface BlogPostData {
  id: number
  title_fr: string
  excerpt_fr: string
  title_en: string
  excerpt_en: string
  title_ar: string
  excerpt_ar: string
  date: string
  author: string
  category: string
  image: string | null
  slug: string
}




// Validate base64 image
const isValidBase64Image = (str: string): boolean => {
  return str.startsWith("data:image/") && str.includes(";base64,") && str.length < 3 * 1024 * 1024 // ~3MB limit
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  let connection
  const { searchParams } = new URL(request.url)
  const includeImage = searchParams.get("includeImage") !== "false"
  const cacheKey = `blog_post:${params.id}:${includeImage}`

  try {
    const id = params.id

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ success: false, error: "ID d'article invalide" }, { status: 400 })
    }

    // Check cache
    const cached = cache.get<BlogPostData>(cacheKey)
    if (cached) {
      return NextResponse.json({ success: true, data: cached })
    }

    connection = await pool.getConnection()

    const fields = includeImage
      ? "`id`, `title_fr`, `excerpt_fr`, `title_en`, `excerpt_en`, `title_ar`, `excerpt_ar`, `date`, `author`, `category`, `image`, `slug`"
      : "`id`, `title_fr`, `excerpt_fr`, `title_en`, `excerpt_en`, `title_ar`, `excerpt_ar`, `date`, `author`, `category`, `slug`"

    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT ${fields} FROM \`blog_posts\` WHERE \`id\` = ?`,
      [id],
    )

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Article non trouvé" }, { status: 404 })
    }

    const post = {
      ...rows[0],
      image: includeImage ? rows[0].image : null,
    } as BlogPostData

    // Cache response
    cache.set(cacheKey, post)

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'article ${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const id = params.id
    const data = await request.json() as Partial<BlogPostData>
    const {
      title_fr,
      excerpt_fr,
      title_en,
      excerpt_en,
      title_ar,
      excerpt_ar,
      date,
      author,
      category,
      image,
      slug,
    } = data

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ success: false, error: "ID d'article invalide" }, { status: 400 })
    }

    if (
      !title_fr ||
      !excerpt_fr ||
      !title_en ||
      !excerpt_en ||
      !title_ar ||
      !excerpt_ar ||
      !date ||
      !author ||
      !category ||
      !slug
    ) {
      return NextResponse.json({ success: false, error: "Tous les champs sont requis" }, { status: 400 })
    }

    if (image && !isValidBase64Image(image)) {
      return NextResponse.json({ success: false, error: "Format ou taille d'image invalide (max 3MB)" }, { status: 400 })
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ success: false, error: "Format de date invalide (YYYY-MM-DD)" }, { status: 400 })
    }

    // Validate category
    const validCategories = ["business", "technology", "marketing", "design", "development"]
    if (!validCategories.includes(category)) {
      return NextResponse.json({ success: false, error: "Catégorie invalide" }, { status: 400 })
    }

    connection = await pool.getConnection()

    // Check for duplicate slug (excluding current post)
    const [existing] = await connection.execute<mysql.RowDataPacket[]>(
      "SELECT `id` FROM `blog_posts` WHERE `slug` = ? AND `id` != ?",
      [slug, id],
    )
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Slug déjà utilisé" }, { status: 400 })
    }

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      "UPDATE `blog_posts` SET `title_fr`=?, `excerpt_fr`=?, `title_en`=?, `excerpt_en`=?, `title_ar`=?, `excerpt_ar`=?, `date`=?, `author`=?, `category`=?, `image`=?, `slug`=? WHERE `id`=?",
      [
        title_fr,
        excerpt_fr,
        title_en,
        excerpt_en,
        title_ar,
        excerpt_ar,
        date,
        author,
        category,
        image || null,
        slug,
        id,
      ],
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Article non trouvé" }, { status: 404 })
    }

    // Invalidate cache
    cache.del(`blog_post:${id}`)
    cache.del("blog_posts:all")

    return NextResponse.json({
      success: true,
      message: "Article mis à jour avec succès",
    })
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'article ${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const id = params.id

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ success: false, error: "ID d'article invalide" }, { status: 400 })
    }

    connection = await pool.getConnection()

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      "DELETE FROM `blog_posts` WHERE `id` = ?",
      [id],
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Article non trouvé" }, { status: 404 })
    }

    // Invalidate cache
    cache.del(`blog_post:${id}`)
    cache.del("blog_posts:all")

    return NextResponse.json({
      success: true,
      message: "Article supprimé avec succès",
    })
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'article ${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}