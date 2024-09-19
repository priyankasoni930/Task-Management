import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function authenticate(handler) {
  return async (req, params) => {
    try {
      const token = req.headers.get("Authorization")?.split(" ")[1];
      if (!token) {
        return NextResponse.json(
          { message: "Authentication required" },
          { status: 401 }
        );
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: decoded.userId };

      return handler(req, params);
    } catch (error) {
      console.error("Authentication error:", error);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  };
}
