"use client";
import Image from "next/image";
import styles from "../page.module.css";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { API_CONFIG } from "../../config/api";

function RedefinirSenhaForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) setToken(tokenParam);
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("Token não informado.");
      return;
    }
    if (!newPassword.trim()) {
      setError("Informe a nova senha.");
      return;
    }
    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao redefinir a senha.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.loginBox}>
          <div className={styles.logoContainer}>
            <Image src="/logo-sanem.svg" alt="Logo SANEM" width={120} height={120} className={styles.logo} />
          </div>
          <h2 className={styles.loginTitle}>Senha Redefinida</h2>
          <p style={{ textAlign: "center", color: "#2e7d32", fontWeight: 600 }}>
            Sua senha foi alterada com sucesso!
          </p>
          <a href="/" className={styles.forgot}>Ir para o Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer}>
          <Image src="/logo-sanem.svg" alt="Logo SANEM" width={120} height={120} className={styles.logo} />
        </div>
        <h2 className={styles.loginTitle}>Redefinir Senha</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Token de recuperação"
            className={styles.input}
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nova senha"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Aguarde..." : "Redefinir Senha"}
          </button>
        </form>
        {error && <div className={styles.errorMsg}>{error}</div>}
        <a href="/recuperar-senha" className={styles.forgot}>Solicitar novo token</a>
      </div>
    </div>
  );
}

export default function RedefinirSenha() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RedefinirSenhaForm />
    </Suspense>
  );
}
