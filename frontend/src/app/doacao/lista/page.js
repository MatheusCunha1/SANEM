"use client";
import React, { useState, useEffect } from "react";
import MenuBar from "../../components/menubar/menubar";
import Navigation from "../../components/navegation/navegation";
import styles from "./lista.module.css";
import apiService from "../../../services/api";
import { useNotification } from "../../../components/notifications/NotificationProvider";
import { FaPlus, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../../../components/confirmation/ConfirmationModal";
import { mapDonorFromBackend, mapItemFromBackend } from "../../../services/dataMapper";
import authService from "../../../services/authService";

export default function ListaDoacoesPage() {
  const { showNotification } = useNotification();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: "", title: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [donors, setDonors] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchDonor, setSearchDonor] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDonations();
  }, []);

  useEffect(() => {
    if (showAddModal) {
      loadDonors();
      loadItems();
    }
  }, [showAddModal]);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDonations();
      const donationsArray = Array.isArray(data) ? data : [];
      
      const sortedDonations = donationsArray.sort((a, b) => {
        const dateA = a.donationDate ? new Date(a.donationDate).getTime() : 0;
        const dateB = b.donationDate ? new Date(b.donationDate).getTime() : 0;
        return dateB - dateA;
      });
      
      setDonations(sortedDonations);
    } catch (err) {
      console.error("Erro ao carregar doações:", err);
      showNotification(err.message || "Erro ao carregar doações", "error");
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      action: async () => {
        try {
          await apiService.deleteDonation(id);
          showNotification("Doação excluída com sucesso!", "success");
          loadDonations();
        } catch (err) {
          console.error("Erro ao excluir doação:", err);
          showNotification(err.message || "Erro ao excluir doação", "error");
        } finally {
          setConfirmModal({ isOpen: false, action: null, message: "", title: "" });
        }
      },
      message: "Tem certeza que deseja excluir esta doação? Esta ação não pode ser desfeita.",
      title: "Confirmar Exclusão"
    });
  };

  const loadDonors = async () => {
    try {
      const data = await apiService.getDonors();
      const mapped = (data || []).map(mapDonorFromBackend);
      setDonors(mapped);
    } catch (err) {
      console.error("Erro ao carregar doadores:", err);
      showNotification("Erro ao carregar doadores", "error");
    }
  };

  const loadItems = async () => {
    try {
      const data = await apiService.getItems();
      const mapped = (data || []).map(mapItemFromBackend);
      setItems(mapped);
    } catch (err) {
      console.error("Erro ao carregar itens:", err);
      showNotification("Erro ao carregar itens", "error");
    }
  };

  const handleAdd = () => {
    setSelectedDonor(null);
    setSelectedItems([]);
    setSearchDonor("");
    setSearchItem("");
    setShowAddModal(true);
  };

  const filteredDonors = donors.filter(d =>
    d.nomeCompleto?.toLowerCase().includes(searchDonor.toLowerCase()) ||
    d.cpf?.includes(searchDonor)
  );

  const filteredItems = items.filter(item =>
    item.nome?.toLowerCase().includes(searchItem.toLowerCase()) ||
    item.descricao?.toLowerCase().includes(searchItem.toLowerCase())
  );

  const handleAddItem = (item) => {
    const existing = selectedItems.find(si => si.itemId === item.id);
    if (existing) {
      setSelectedItems(selectedItems.map(si =>
        si.itemId === item.id
          ? { ...si, quantity: si.quantity + 1 }
          : si
      ));
    } else {
      setSelectedItems([...selectedItems, { itemId: item.id, quantity: 1, item }]);
    }
  };

  const handleUpdateQuantity = (itemId, delta) => {
    setSelectedItems(selectedItems.map(si => {
      if (si.itemId === itemId) {
        const newQuantity = Math.max(1, si.quantity + delta);
        return { ...si, quantity: newQuantity };
      }
      return si;
    }));
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(selectedItems.filter(si => si.itemId !== itemId));
  };

  const handleSubmitDonation = async (e) => {
    e.preventDefault();
    
    if (!selectedDonor) {
      showNotification("Selecione um doador", "error");
      return;
    }

    if (selectedItems.length === 0) {
      showNotification("Adicione pelo menos um item", "error");
      return;
    }

    const user = authService.getUser();
    if (!user || !user.id) {
      showNotification("Usuário não autenticado. Por favor, faça login novamente.", "error");
      return;
    }

    const invalidItems = selectedItems.filter(si => !si.itemId || !si.quantity || si.quantity <= 0);
    if (invalidItems.length > 0) {
      showNotification("Alguns itens possuem quantidade inválida", "error");
      return;
    }

    try {
      setSubmitting(true);
      
      const donationData = {
        donationDate: new Date().toISOString().split('T')[0],
        receiverUserId: user.id,
        donorId: selectedDonor.id,
        items: selectedItems.map(si => ({
          itemId: si.itemId,
          quantity: si.quantity
        }))
      };

      await apiService.createDonation(donationData);
      showNotification("Doação registrada com sucesso!", "success");
      setShowAddModal(false);
      setSelectedDonor(null);
      setSelectedItems([]);
      setSearchDonor("");
      setSearchItem("");
      loadDonations();
    } catch (err) {
      console.error("Erro ao registrar doação:", err);
      showNotification(err.message || "Erro ao registrar doação", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (e) {
      console.error('Erro ao formatar data:', e);
      return 'N/A';
    }
  };

  const totalItems = selectedItems.reduce((sum, si) => sum + si.quantity, 0);

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}>
        <div className={styles.listContainer}>
          <h1 className={styles.titulo}>Doações Registradas</h1>
          <div className={styles.decoracao}></div>
          <div className={styles.actionsHeader}>
            <button
              className={styles.addButton}
              onClick={handleAdd}
              title="Registrar Nova Doação"
            >
              <FaPlus />
            </button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.beneficiariosTable}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Doador</th>
                  <th>Atendente</th>
                  <th>Itens</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.loadingMessage}>Carregando...</td>
                  </tr>
                ) : donations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.noDataMessage}>
                      Nenhuma doação registrada ainda.
                    </td>
                  </tr>
                ) : (
                  donations.map((donation) => (
                    <tr key={donation.donationId}>
                      <td>{formatDate(donation.donationDate)}</td>
                      <td>{donation.donor?.name || 'N/A'}</td>
                      <td>{donation.receiverUser?.name || 'N/A'}</td>
                      <td>
                        {donation.items && donation.items.length > 0 ? (
                          <div>
                            {donation.items.map((item, idx) => (
                              <span key={item.itemDonatedId || idx} style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>
                                {item.item?.description || item.item?.name || 'Item'} - Qtd: {item.quantity || 0}
                              </span>
                            ))}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(donation.donationId)}
                            title="Excluir"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Registrar Doação</h2>
            <form onSubmit={handleSubmitDonation}>
              <div className={styles.formSection}>
                <label>Doador *</label>
                <input
                  type="text"
                  placeholder="Buscar doador por nome ou CPF/CNPJ..."
                  value={searchDonor}
                  onChange={(e) => setSearchDonor(e.target.value)}
                  className={styles.searchInput}
                />
                {searchDonor && (
                  <div className={styles.dropdown}>
                    {filteredDonors.length === 0 ? (
                      <div className={styles.dropdownItem}>Nenhum doador encontrado</div>
                    ) : (
                      filteredDonors.map(donor => (
                        <div
                          key={donor.id}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setSelectedDonor(donor);
                            setSearchDonor(donor.nomeCompleto);
                          }}
                        >
                          <div><strong>{donor.nomeCompleto}</strong></div>
                          <div style={{ fontSize: '0.9rem', color: '#666' }}>CPF/CNPJ: {donor.cpf || 'N/A'}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {selectedDonor && (
                  <div className={styles.selectedInfo}>
                    <div><strong>Doador selecionado:</strong> {selectedDonor.nomeCompleto}</div>
                  </div>
                )}
              </div>

              <div className={styles.formSection}>
                <label>Itens *</label>
                <input
                  type="text"
                  placeholder="Buscar item por nome ou descrição..."
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  className={styles.searchInput}
                />
                {searchItem && (
                  <div className={styles.dropdown}>
                    {filteredItems.length === 0 ? (
                      <div className={styles.dropdownItem}>Nenhum item encontrado</div>
                    ) : (
                      filteredItems.map(item => (
                        <div
                          key={item.id}
                          className={styles.dropdownItem}
                          onClick={() => handleAddItem(item)}
                        >
                          <div><strong>{item.nome || item.descricao}</strong></div>
                          <div style={{ fontSize: '0.9rem', color: '#666' }}>
                            Categoria: {item.categoria || 'N/A'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {selectedItems.length > 0 && (
                  <div className={styles.selectedItemsContainer}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: '#333' }}>Itens Selecionados</h3>
                    {selectedItems.map(si => {
                      const item = items.find(i => i.id === si.itemId);
                      return (
                        <div key={si.itemId} className={styles.selectedItem}>
                          <div className={styles.itemInfo}>
                            <strong>{item?.nome || item?.descricao || 'Item'}</strong>
                          </div>
                          <div className={styles.itemControls}>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(si.itemId, -1)}
                              disabled={si.quantity <= 1}
                              className={styles.quantityButton}
                            >
                              −
                            </button>
                            <span className={styles.quantity}>{si.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(si.itemId, 1)}
                              className={styles.quantityButton}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(si.itemId)}
                              className={styles.removeButton}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <div className={styles.total}>
                      <strong>Total de itens: {totalItems}</strong>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={submitting || !selectedDonor || selectedItems.length === 0}
                >
                  {submitting ? "Registrando..." : "Registrar Doação"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, message: "", title: "" })}
        onConfirm={confirmModal.action}
        message={confirmModal.message}
        title={confirmModal.title}
      />
    </div>
  );
}
