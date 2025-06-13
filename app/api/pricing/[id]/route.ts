import { type NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import pool from "@/lib/db";


// GET - Récupérer un plan tarifaire par ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  let connection;

  try {
    const planId = params.id;

    // Validation de l'ID
    if (!planId || isNaN(Number(planId))) {
      return NextResponse.json({ error: "ID de plan invalide" }, { status: 400 });
    }

    // Get a connection from the pool
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `
      SELECT id, name_fr, description_fr, name_en, description_en, name_ar, description_ar, 
             price_monthly, price_yearly, popular, features_fr, features_en, features_ar
      FROM pricing_plans
      WHERE id = ?
    `,
      [planId],
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: "Plan tarifaire non trouvé" }, { status: 404 });
    }

    const plan = (rows as any[])[0];
    let features_fr = [];
    let features_en = [];
    let features_ar = [];

    try {
      features_fr = plan.features_fr ? JSON.parse(plan.features_fr) : [];
      if (!Array.isArray(features_fr)) features_fr = [];
    } catch (e) {
      console.error(`Error parsing features_fr for plan ${plan.id}:`, e);
      features_fr = [];
    }

    try {
      features_en = plan.features_en ? JSON.parse(plan.features_en) : [];
      if (!Array.isArray(features_en)) features_en = [];
    } catch (e) {
      console.error(`Error parsing features_en for plan ${plan.id}:`, e);
      features_en = [];
    }

    try {
      features_ar = plan.features_ar ? JSON.parse(plan.features_ar) : [];
      if (!Array.isArray(features_ar)) features_ar = [];
    } catch (e) {
      console.error(`Error parsing features_ar for plan ${plan.id}:`, e);
      features_ar = [];
    }

    return NextResponse.json({
      success: true,
      data: {
        ...plan,
        features_fr,
        features_en,
        features_ar,
        popular: Boolean(plan.popular),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du plan tarifaire:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

// PUT - Mettre à jour un plan tarifaire
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  let connection;

  try {
    const planId = params.id;
    const data = await request.json();

    // Validation de l'ID
    if (!planId || isNaN(Number(planId))) {
      return NextResponse.json({ error: "ID de plan invalide" }, { status: 400 });
    }

    // Validation des données
    if (!data.name_fr || !data.description_fr || !data.price_monthly || !data.price_yearly) {
      return NextResponse.json({ error: "Les champs obligatoires sont manquants" }, { status: 400 });
    }

    // Get a connection from the pool
    connection = await pool.getConnection();

    // Vérifier que le plan existe
    const [existingRows] = await connection.execute("SELECT id FROM pricing_plans WHERE id = ?", [planId]);

    if ((existingRows as any[]).length === 0) {
      return NextResponse.json({ error: "Plan tarifaire non trouvé" }, { status: 404 });
    }

    // Préparation des features en JSON
    const featuresFrJson = JSON.stringify(data.features_fr || []);
    const featuresEnJson = JSON.stringify(data.features_en || []);
    const featuresArJson = JSON.stringify(data.features_ar || []);

    // Mise à jour du plan tarifaire
    const [result] = await connection.execute(
      `UPDATE pricing_plans SET 
       name_fr = ?, description_fr = ?, name_en = ?, description_en = ?, name_ar = ?, description_ar = ?, 
       price_monthly = ?, price_yearly = ?, popular = ?, features_fr = ?, features_en = ?, features_ar = ?
       WHERE id = ?`,
      [
        data.name_fr,
        data.description_fr,
        data.name_en || "",
        data.description_en || "",
        data.name_ar || "",
        data.description_ar || "",
        data.price_monthly,
        data.price_yearly,
        data.popular ? 1 : 0,
        featuresFrJson,
        featuresEnJson,
        featuresArJson,
        planId,
      ],
    );

    const updateResult = result as mysql.ResultSetHeader;

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ error: "Aucune modification effectuée" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Plan tarifaire mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du plan tarifaire:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

// DELETE - Supprimer un plan tarifaire
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  let connection;

  try {
    const planId = params.id;

    // Validation de l'ID
    if (!planId || isNaN(Number(planId))) {
      return NextResponse.json({ error: "ID de plan invalide" }, { status: 400 });
    }

    // Get a connection from the pool
    connection = await pool.getConnection();

    // Vérifier que le plan existe
    const [existingRows] = await connection.execute("SELECT id FROM pricing_plans WHERE id = ?", [planId]);

    if ((existingRows as any[]).length === 0) {
      return NextResponse.json({ error: "Plan tarifaire non trouvé" }, { status: 404 });
    }

    // Suppression du plan tarifaire
    const [result] = await connection.execute("DELETE FROM pricing_plans WHERE id = ?", [planId]);

    const deleteResult = result as mysql.ResultSetHeader;

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Plan tarifaire supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du plan tarifaire:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}