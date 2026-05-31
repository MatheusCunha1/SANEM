"use client";
import Image from "next/image";
import styles from "../page.module.css";
import localStyles from "./recuperar-senha.module.css";
import { useState } from "react";
import { API_CONFIG } from "../../config/api";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setToken("");

    if (!email.trim()) {
      setError("Informe seu email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao solicitar recuperação de senha.");
        return;
      }

      setToken(data.token);
      setSuccess(true);
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer}>
          <Image src="/logo-sanem.svg" alt="Logo SANEM" width={120} height={120} className={styles.logo} />
        </div>
        <h2 className={styles.loginTitle}>Recuperar Senha</h2>

        {!success ? (
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Seu email cadastrado"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Aguarde..." : "Solicitar Recuperação"}
            </button>
          </form>
        ) : (
          <div className={localStyles.successBox}>
            <p className={localStyles.successMsg}>Token gerado com sucesso!</p>
            <p className={localStyles.tokenLabel}>Use o token abaixo para redefinir sua senha:</p>
            <div className={localStyles.tokenBox}>{token}</div>
            <a href={`/redefinir-senha?token=${token}`} className={styles.button + " " + localStyles.resetLink}>
              Redefinir Senha
            </a>
          </div>
        )}

        {error && <div className={styles.errorMsg}>{error}</div>}
        <a href="/" className={styles.forgot}>Voltar ao Login</a>
      </div>
    </div>
  );
}
