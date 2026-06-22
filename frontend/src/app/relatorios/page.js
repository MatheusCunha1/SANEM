"use client";
import { useState, useEffect } from 'react';
import MenuBar from '../components/menubar/menubar';
import Navigation from '../components/navegation/navegation';
import apiService from '../../services/api';
import styles from './relatorios.module.css';

const TABS = ['Retiradas', 'Doações', 'Log de Ações'];

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [donations, setDonations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [w, d, a] = await Promise.all([
          apiService.getWithdrawals().catch(() => []),
          apiService.getDonations().catch(() => []),
          apiService.getAuditLogs().catch(() => []),
        ]);
        setWithdrawals(Array.isArray(w) ? w : []);
        setDonations(Array.isArray(d) ? d : []);
        setAuditLogs(Array.isArray(a) ? a : []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const fmt = (dateStr) => {
    if (!dateStr) return '—';
    try { return new Date(dateStr).toLocaleDateString('pt-BR'); } catch { return dateStr; }
  };

  const fmtDt = (dateStr) => {
    if (!dateStr) return '—';
    try { return new Date(dateStr).toLocaleString('pt-BR'); } catch { return dateStr; }
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    const t = search.toLowerCase();
    return !t ||
      w.beneficiary?.fullName?.toLowerCase().includes(t) ||
      w.attendantUser?.name?.toLowerCase().includes(t);
  });

  const filteredDonations = donations.filter(d => {
    const t = search.toLowerCase();
    return !t ||
      d.donor?.name?.toLowerCase().includes(t) ||
      d.donor?.fullName?.toLowerCase().includes(t);
  });

  const filteredLogs = auditLogs.filter(l => {
    const t = search.toLowerCase();
    return !t ||
      l.action?.toLowerCase().includes(t) ||
      l.details?.toLowerCase().includes(t);
  });

  const ACTION_LABEL = {
    APPROVE_BENEFICIARY: 'Aprovação',
    REJECT_BENEFICIARY: 'Rejeição',
    CREATE_WITHDRAWAL: 'Retirada',
  };

  const ACTION_COLOR = {
    APPROVE_BENEFICIARY: '#28a745',
    REJECT_BENEFICIARY: '#dc3545',
    CREATE_WITHDRAWAL: '#007bff',
  };

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}>
        <h1 className={styles.titulo}>Relatórios</h1>
        <div className={styles.decoracao}></div>

        <div className={styles.summaryCards}>
          <div className={styles.card}>
            <span className={styles.cardNumber}>{withdrawals.length}</span>
            <span className={styles.cardLabel}>Retiradas</span>
          </div>
          <div className={styles.card}>
            <span className={styles.cardNumber}>{donations.length}</span>
            <span className={styles.cardLabel}>Doações</span>
          </div>
          <div className={styles.card}>
            <span className={styles.cardNumber}>{auditLogs.length}</span>
            <span className={styles.cardLabel}>Ações registradas</span>
          </div>
        </div>

        <div className={styles.tabs}>
          {TABS.map((t, i) => (
            <button
              key={t}
              className={`${styles.tab} ${activeTab === i ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab(i); setSearch(''); }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className={styles.searchRow}>
          <input
            type="text"
            placeholder="Filtrar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {loading ? (
          <p className={styles.loading}>Carregando...</p>
        ) : (
          <>
            {activeTab === 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>#</th><th>Data</th><th>Beneficiário</th><th>Atendente</th></tr>
                  </thead>
                  <tbody>
                    {filteredWithdrawals.length === 0 ? (
                      <tr><td colSpan={4} className={styles.empty}>Nenhum registro encontrado.</td></tr>
                    ) : filteredWithdrawals.map(w => (
                      <tr key={w.withdrawalId}>
                        <td>{w.withdrawalId}</td>
                        <td>{fmt(w.withdrawalDate)}</td>
                        <td>{w.beneficiary?.fullName || '—'}</td>
                        <td>{w.attendantUser?.name || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 1 && (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>#</th><th>Data</th><th>Doador</th></tr>
                  </thead>
                  <tbody>
                    {filteredDonations.length === 0 ? (
                      <tr><td colSpan={3} className={styles.empty}>Nenhum registro encontrado.</td></tr>
                    ) : filteredDonations.map((d, i) => (
                      <tr key={d.donationId ?? i}>
                        <td>{d.donationId ?? i + 1}</td>
                        <td>{fmt(d.donationDate ?? d.date)}</td>
                        <td>{d.donor?.name || d.donor?.fullName || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 2 && (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>#</th><th>Ação</th><th>Entidade</th><th>ID</th><th>Data/Hora</th><th>Detalhes</th></tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length === 0 ? (
                      <tr><td colSpan={6} className={styles.empty}>Nenhuma ação registrada ainda.</td></tr>
                    ) : filteredLogs.map(l => (
                      <tr key={l.auditLogId}>
                        <td>{l.auditLogId}</td>
                        <td>
                          <span style={{ background: ACTION_COLOR[l.action] || '#6c757d', color: '#fff', borderRadius: '4px', padding: '2px 8px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {ACTION_LABEL[l.action] || l.action}
                          </span>
                        </td>
                        <td>{l.entityType}</td>
                        <td>{l.entityId}</td>
                        <td>{fmtDt(l.performedAt)}</td>
                        <td>{l.details || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
