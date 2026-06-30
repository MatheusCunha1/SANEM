"use client";
import MenuBar from '../components/menubar/menubar';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/navegation/navegation';
import styles from './home.module.css';
import { FaQuestionCircle, FaUsers, FaHandHoldingHeart, FaBoxes, FaExclamationTriangle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import apiService from '../../services/api';

function StatCard({ icon, label, value, color, loading }) {
  return (
    <div className={styles.statCard} style={{ borderLeft: `4px solid ${color}` }}>
      <div className={styles.statIcon} style={{ color }}>{icon}</div>
      <div className={styles.statInfo}>
        <span className={styles.statValue}>{loading ? '...' : value}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const hasNotification = true;
  const [stats, setStats] = useState({ beneficiarios: 0, doadores: 0, doacoes: 0, baixoEstoque: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [beneficiarios, doadores, doacoes, baixoEstoque] = await Promise.allSettled([
          apiService.request('/beneficiary/all'),
          apiService.request('/donor/all'),
          apiService.request('/donation'),
          apiService.request('/item/low-stock'),
        ]);
        setStats({
          beneficiarios: beneficiarios.status === 'fulfilled' ? (beneficiarios.value?.length ?? 0) : 0,
          doadores: doadores.status === 'fulfilled' ? (doadores.value?.length ?? 0) : 0,
          doacoes: doacoes.status === 'fulfilled' ? (doacoes.value?.length ?? 0) : 0,
          baixoEstoque: baixoEstoque.status === 'fulfilled' ? (baixoEstoque.value?.length ?? 0) : 0,
        });
      } catch {
        // silencia erros se backend offline
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className={styles.container}>
      <Navigation />
      <MenuBar hasNotification={hasNotification} />
      <main className={styles.main}>
        <Image
          src="/doantion.jpg"
          alt="Doação"
          width={320}
          height={180}
          className={styles.donationImage}
          style={{ width: 'auto', height: 'auto' }}
          priority
        />
        <h1 className={styles.title}>Bem-vindo à Sanem!</h1>
        <p className={styles.effectPhrase}>
          "A solidariedade transforma vidas. Doe hoje e faça a diferença!"
        </p>

        <div className={styles.statsGrid}>
          <StatCard
            icon={<FaUsers size={28} />}
            label="Beneficiários"
            value={stats.beneficiarios}
            color="var(--color-primary)"
            loading={loading}
          />
          <StatCard
            icon={<FaHandHoldingHeart size={28} />}
            label="Doadores"
            value={stats.doadores}
            color="#43a047"
            loading={loading}
          />
          <StatCard
            icon={<FaBoxes size={28} />}
            label="Doações"
            value={stats.doacoes}
            color="#e08a1e"
            loading={loading}
          />
          <StatCard
            icon={<FaExclamationTriangle size={28} />}
            label="Estoque Baixo"
            value={stats.baixoEstoque}
            color={stats.baixoEstoque > 0 ? '#c0392b' : '#43a047'}
            loading={loading}
          />
        </div>

        <Link href="/ajuda" className={styles.helpButton}>
          <FaQuestionCircle />
          <span>Ajuda</span>
        </Link>
      </main>
    </div>
  );
}
