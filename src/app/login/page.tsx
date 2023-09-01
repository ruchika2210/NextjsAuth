"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast/headless";

export default function LoginPage() {
  const router = useRouter();
  const [user, setuser] = useState({
    email: "",
    password: "",
  });

  const [buttondisabled, setbuttondisabled] = useState(false);
  const [loading, setloading] = useState(false);

  const onLogin = async () => {
    try {
      setloading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("login successful", response.data);
      toast.success("login success");
      router.push("/profile");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (user.email && user.password) {
      setbuttondisabled(false);
    } else {
      setbuttondisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing" : "Login"}</h1>
      <hr />

      <label htmlFor="email">email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        type="text"
        value={user.email}
        onChange={(e) => setuser({ ...user, email: e.target.value })}
        placeholder="email"
      />

      <label htmlFor="password">password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setuser({ ...user, password: e.target.value })}
        placeholder="password"
      />

      <button
        onClick={onLogin}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        Login here
      </button>
      <Link href="/signup">Visit Signup here</Link>
    </div>
  );
}
