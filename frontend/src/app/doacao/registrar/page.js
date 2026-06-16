"use client";
import React, { useState, useEffect } from "react";
import MenuBar from "../../components/menubar/menubar";
import Navigation from "../../components/navegation/navegation";
import { useRouter } from "next/navigation";
import styles from "./registrar.module.css";
import apiService from "../../../services/api";
import authService from "../../../services/authService";
import { useNotification } from "../../../components/notifications/NotificationProvider";
import { mapDonorFromBackend, mapItemFromBackend } from "../../../services/dataMapper";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

export default function RegistrarDoacaoPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [donors, setDonors] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchDonor, setSearchDonor] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDonors();
    loadItems();
  }, []);

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

  const handleSubmit = async (e) => {
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
      setLoading(true);
      
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
      
      setTimeout(() => {
        router.push("/doacao/lista");
      }, 1000);
    } catch (err) {
      console.error("Erro ao registrar doação:", err);
      showNotification(err.message || "Erro ao registrar doação", "error");
    } finally {
      setLoading(false);
    }
  };

  const totalItems = selectedItems.reduce((sum, si) => sum + si.quantity, 0);

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.titulo}>Registrar Doação</h1>
          <div className={styles.decoracao}></div>

          <form onSubmit={handleSubmit}>
            <div className={styles.section}>
              <h2>Doador</h2>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Buscar doador por nome ou CPF/CNPJ..."
                  value={searchDonor}
                  onChange={(e) => setSearchDonor(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
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
                <div className={styles.selectedDonor}>
                  <div>
                    <strong>Doador selecionado:</strong> {selectedDonor.nomeCompleto}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.section}>
              <h2>Itens</h2>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Buscar item por nome ou descrição..."
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
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
                <div className={styles.selectedItems}>
                  <h3>Itens Selecionados</h3>
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
                            <FaMinus />
                          </button>
                          <span className={styles.quantity}>{si.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(si.itemId, 1)}
                            className={styles.quantityButton}
                          >
                            <FaPlus />
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

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => router.push("/doacao")}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !selectedDonor || selectedItems.length === 0}
                className={styles.submitButton}
              >
                {loading ? "Registrando..." : "Registrar Doação"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
