"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSwal } from "@/hooks/use-swal";
import { z } from "zod";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

// Define Zod schema for validation
const loginSchema = z.object({
  no_telepon: z
    .string()
    .min(10, "Nomor telepon minimal 10 karakter")
    .max(15, "Nomor telepon maksimal 15 karakter")
    .regex(/^\d+$/, "Nomor telepon harus berupa angka"),
  password: z.string().min(6, "Sandi minimal 6 karakter"),
});

export default function LoginSopir() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const { showPostRedirectAlert, showAlert } = useSwal();
  const [nope, setNope] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      // Validate input using Zod schema
      const validatedData = loginSchema.parse({
        no_telepon: nope,
        password: password,
      });

      const res = await fetch(`${BASE_URL}/api/supir/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to login");
      }

      const { token, refreshToken } = await res.json();
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      // Tampilkan notifikasi sukses
      showPostRedirectAlert({
        title: "Sukses",
        text: "Berhasil Masuk",
        icon: "success",
      });
      router.push("/sopir");
    } catch (err) {
      // Catch Zod validation errors
      if (err.errors) {
        const fieldErrors = err.errors.reduce((acc, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      } else {
        // Show error using SweetAlert
        showAlert({
          icon: "error",
          title: "Gagal Masuk",
          text: err.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-items-center min-h-screen p-8 bg-gradient-to-br from-blue-500 to-red-500">
      <VeryTopBackButton />
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-2xl text-center">Sopir</CardTitle>
          <CardDescription className="text-center">
            Masukan nomor telepon dan sandi untuk masuk.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nope" className="text-[#2C3192]">
                No. HP
              </Label>
              <Input
                id="no-telepon"
                type="text"
                placeholder="Masukkan Nomor Telepon"
                value={nope}
                onChange={(e) => {
                  setNope(e.target.value);
                  setErrors((prev) => ({ ...prev, no_telepon: null }));
                }}
                className="border-2 border-[#2C3192] focus:border-[#EC1F25] p-2 rounded-md w-full"
              />
              {errors.no_telepon && (
                <p className="text-red-500 text-sm">{errors.no_telepon}</p>
              )}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-[#2C3192]">
                Sandi
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Masukkan Sandi"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  className="border-2 border-[#2C3192] focus:border-[#EC1F25] p-2 rounded-md w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#2C3192]"
                >
                  {showPassword ? (
                    <EyeOff size={20} aria-label="Hide password" />
                  ) : (
                    <Eye size={20} aria-label="Show password" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full text-white rounded-md p-2"
              disabled={loading}
            >
              {loading ? "Menunggu..." : "Masuk"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
