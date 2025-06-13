import { type NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  let connection;
  console.time("loginHandler");
  try {
    console.time("parseRequest");
    const { email, password } = await request.json();
    console.timeEnd("parseRequest");

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    console.time("getConnection");
    connection = await pool.getConnection();
    console.timeEnd("getConnection");

    console.time("queryUser");
    const [rows] = await connection.execute(
      "SELECT id, email, full_name, role, password, created_at FROM users WHERE email = ?",
      [email]
    );
    console.timeEnd("queryUser");

    const users = rows as any[];
    if (users.length === 0) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const user = users[0];

    console.time("bcryptCompare");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.timeEnd("bcryptCompare");

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const userSession = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      created_at: user.created_at,
      last_login: new Date().toISOString(),
    };

    console.time("updateLastLogin");
    await connection.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);
    console.timeEnd("updateLastLogin");

    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie",
      user: userSession,
    });

    console.log("Session size:", JSON.stringify(userSession).length);
    response.cookies.set("user-session", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.timeEnd("loginHandler");
    return response;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  } finally {
    if (connection) {
      console.time("releaseConnection");
      connection.release();
      console.timeEnd("releaseConnection");
    }
  }
}