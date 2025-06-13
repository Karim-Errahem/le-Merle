import { type NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import pool from "@/lib/db";


// GET - Récupérer tous les plans tarifaires
export async function GET() {
  let connection;

  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    // Récupération de tous les plans tarifaires
    const [rows] = await connection.execute(`
      SELECT id, name_fr, description_fr, name_en, description_en, name_ar, description_ar, 
             price_monthly, price_yearly, popular, features_fr, features_en, features_ar
      FROM pricing_plans 
    `);

    // Traitement des données pour parser les features JSON
    const plans = (rows as any[]).map((plan) => {
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

      return {
        ...plan,
        features_fr,
        features_en,
        features_ar,
        popular: Boolean(plan.popular),
      };
    });

    return NextResponse.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des plans tarifaires:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

// POST - Ajouter un nouveau plan tarifaire
export async function POST(request: NextRequest) {
  let connection;

  try {
    const data = await request.json();

    // Validation des données
    if (!data.name_fr || !data.description_fr || !data.price_monthly || !data.price_yearly) {
      return NextResponse.json({ error: "Les champs obligatoires sont manquants" }, { status: 400 });
    }

    // Get a connection from the pool
    connection = await pool.getConnection();

    // Préparation des features en JSON
    const featuresFrJson = JSON.stringify(data.features_fr || []);
    const featuresEnJson = JSON.stringify(data.features_en || []);
    const featuresArJson = JSON.stringify(data.features_ar || []);

    // Insertion du nouveau plan tarifaire
    const [result] = await connection.execute(
      `INSERT INTO pricing_plans (name_fr, description_fr, name_en, description_en, name_ar, description_ar, 
       price_monthly, price_yearly, popular, features_fr, features_en, features_ar) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ],
    );

    const insertResult = result as mysql.ResultSetHeader;

    return NextResponse.json({
      success: true,
      message: "Plan tarifaire ajouté avec succès",
      id: insertResult.insertId,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du plan tarifaire:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}