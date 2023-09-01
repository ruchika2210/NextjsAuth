import { connect } from "@/dbConfig/dbconfig";

import User from "@/models/userModel";

import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    //check if the user is exisiting or not
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    //check if password is correct
    const validpassword = await bcryptjs.compare(password, user.password);
    if (!validpassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    //create the token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const responseToken = NextResponse.json({
      message: "login Sucessful",
      success: true,
    });

    responseToken.cookies.set("token", token, { httpOnly: true });
    return responseToken;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
