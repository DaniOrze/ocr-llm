"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(process.env.BASE_URL + "/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          description: errorData.message || "Erro ao cadastrar",
          variant: "destructive",
        });
        return;
      }

      toast({
        description: "Conta criada com sucesso!",
      });

      router.push("/auth/login");
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast({
        description: "Erro na requisição",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Criar Conta
        </h1>

        <form onSubmit={handleSignin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
            Criar Conta
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Já tem uma conta?{" "}
            <a href="/auth/login" className="text-green-500 hover:underline">
              Faça login aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
