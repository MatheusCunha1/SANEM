"use client";
import React, { useEffect, useState, useCallback } from "react";
import MenuBar from "../components/menubar/menubar";
import Navigation from "../components/navegation/navegation";
import styles from "./cartoes.module.css";
import apiService from "../../services/api";
import { useNotification } from "../../components/notifications/NotificationProvider";
import ConfirmationModal from "../../components/confirmation/ConfirmationModal";
import { FaIdCard, FaTrash, FaDownload, FaSearch } from "react-icons/fa";

export default function Cartoes() {
  const { showNotification } = useNotification();

  const [cartoes, setCartoes] = useState([]);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null,
    message: "",
    title: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cartoesData, beneficiariosData] = await Promise.all([
        apiService.getCards(),
        apiService.getBeneficiaries(),
      ]);
      setCartoes(Array.isArray(cartoesData) ? cartoesData : []);
      setBeneficiarios(Array.isArray(beneficiariosData) ? beneficiariosData : []);
    } catch (err) {
      showNotification(err.message || "Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getBeneficiarioNome = (beneficiaryId) => {
    const b = beneficiarios.find((b) => b.beneficiaryId === beneficiaryId || b.id === beneficiaryId);
    return b?.fullName || b?.nomeCompleto || `Beneficiário #${beneficiaryId}`;
  };

  const getBeneficiariosComCartao = () => {
    const idsComCartao = new Set(cartoes.map((c) => c.beneficiaryId));
    return beneficiarios.filter(
      (b) => !idsComCartao.has(b.beneficiaryId || b.id)
    );
  };

  const handleGerarCartao = async (beneficiaryId) => {
    setGeneratingId(beneficiaryId);
    try {
      await apiService.generateCardForBeneficiary(beneficiaryId);
      showNotification("Cartão gerado e PDF baixado com sucesso!", "success");
      await loadData();
    } catch (err) {
      showNotification(err.message || "Erro ao gerar cartão", "error");
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDownloadPdf = async (beneficiaryId) => {
    setGeneratingId(beneficiaryId);
    try {
      await apiService.generateCardForBeneficiary(beneficiaryId);
      showNotification("PDF do cartão baixado com sucesso!", "success");
    } catch (err) {
      showNotification(err.message || "Erro ao baixar PDF", "error");
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDelete = (cardId) => {
    setConfirmModal({
      isOpen: true,
      action: async () => {
        try {
          await apiService.deleteCard(cardId);
          showNotification("Cartão excluído com sucesso!", "success");
          await loadData();
        } catch (err) {
          showNotification(err.message || "Erro ao excluir cartão", "error");
        }
      },
      message: "Tem certeza que deseja excluir este cartão? O beneficiário perderá o acesso.",
      title: "Confirmar Exclusão",
    });
  };

  const handleConfirm = async () => {
    if (confirmModal.action) await confirmModal.action();
    setConfirmModal({ isOpen: false, action: null, message: "", title: "" });
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return "-";
    return new Date(dateVal).toLocaleDateString("pt-BR");
  };

  const cartoesFiltrados = cartoes.filter((c) => {
    const nome = getBeneficiarioNome(c.beneficiaryId).toLowerCase();
    const numero = (c.uniqueNumber || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return nome.includes(term) || numero.includes(term);
  });

  const semCartao = getBeneficiariosComCartao().filter((b) => {
    const nome = (b.fullName || b.nomeCompleto || "").toLowerCase();
    return nome.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}>
        <div className={styles.listContainer}>
          <h1 className={styles.titulo}>Cartões de Beneficiários</h1>
          <div className={styles.decoracao}></div>

          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nome ou número do cartão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Cartões emitidos */}
          <h2 className={styles.sectionTitle}>Cartões Emitidos</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.cartoesTable}>
              <thead>
                <tr>
                  <th>Beneficiário</th>
                  <th>Número do Cartão</th>
                  <th>Data de Emissão</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className={styles.loadingMessage}>Carregando...</td>
                  </tr>
                ) : cartoesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.noDataMessage}>
                      {searchTerm ? "Nenhum cartão encontrado para esta busca." : "Nenhum cartão emitido ainda."}
                    </td>
                  </tr>
                ) : (
                  cartoesFiltrados.map((c) => (
                    <tr key={c.cardId}>
                      <td data-label="Beneficiário">{getBeneficiarioNome(c.beneficiaryId)}</td>
                      <td data-label="Número">{c.uniqueNumber}</td>
                      <td data-label="Data de Emissão">{formatDate(c.issueDate)}</td>
                      <td data-label="Ações" className={styles.actionButtons}>
                        <button
                          className={styles.downloadButton}
                          onClick={() => handleDownloadPdf(c.beneficiaryId)}
                          disabled={generatingId === c.beneficiaryId}
                          title="Baixar PDF do Cartão"
                        >
                          <FaDownload />
                          {generatingId === c.beneficiaryId ? " Gerando..." : " PDF"}
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(c.cardId)}
                          disabled={loading}
                          title="Excluir Cartão"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Beneficiários sem cartão */}
          {semCartao.length > 0 && (
            <>
              <h2 className={styles.sectionTitle} style={{ marginTop: "40px" }}>
                Beneficiários sem Cartão
              </h2>
              <div className={styles.tableWrapper}>
                <table className={styles.cartoesTable}>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semCartao.map((b) => {
                      const bid = b.beneficiaryId || b.id;
                      return (
                        <tr key={bid}>
                          <td data-label="Nome">{b.fullName || b.nomeCompleto}</td>
                          <td data-label="Ações" className={styles.actionButtons}>
                            <button
                              className={styles.generateButton}
                              onClick={() => handleGerarCartao(bid)}
                              disabled={generatingId === bid}
                              title="Emitir Cartão"
                            >
                              <FaIdCard />
                              {generatingId === bid ? " Gerando..." : " Emitir Cartão"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, message: "", title: "" })}
        onConfirm={handleConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}
