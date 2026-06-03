import React, { useState, useEffect } from "react";
import axios from "axios";

const Income = ({ incomes, refreshIncomes }) => {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editTotal, setEditTotal] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const totalPages = Math.ceil((incomes ? incomes.length : 0) / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedIncomes = incomes ? incomes.slice(startIndex, startIndex + ITEMS_PER_PAGE) : [];

    useEffect(() => {
        const maxPage = Math.ceil((incomes ? incomes.length : 0) / ITEMS_PER_PAGE) || 1;
        if (currentPage > maxPage) {
            setCurrentPage(maxPage);
        }
    }, [incomes, currentPage]);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/income/${id}`)
            .then(() => {
                refreshIncomes();
            })
            .catch((err) => {
                console.log("Error deleting income:", err);
            });
    };

    const startEdit = (income) => {
        setEditingId(income.id);
        setEditName(income.name);
        setEditTotal(income.total);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
        setEditTotal("");
    };

    const handleSave = (id) => {
        if (!editName.trim() || !editTotal) return;
        axios.put(`http://localhost:3000/income/${id}`, {
            id: String(id),
            name: editName,
            total: Number(editTotal)
        })
            .then(() => {
                refreshIncomes();
                cancelEdit();
            })
            .catch((err) => {
                console.log("Error updating income:", err);
            });
    };

    return (
        <div className="income-list" >
            <div className="income-heading">
                <h5>Income</h5>
            </div>
            <div className="income-items">
                {
                    paginatedIncomes.length !== 0 ?
                        paginatedIncomes.map((income) => {
                            const isEditing = income.id === editingId;
                            return (
                                <div key={income.id} className="card-item">
                                    {isEditing ? (
                                        <div className="item-edit-mode">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                placeholder="Name"
                                            />
                                            <input
                                                type="number"
                                                value={editTotal}
                                                onChange={(e) => setEditTotal(e.target.value)}
                                                placeholder="Total"
                                            />
                                            <div className="edit-actions">
                                                <button className="btn-save" onClick={() => handleSave(income.id)}>Save</button>
                                                <button className="btn-cancel" onClick={cancelEdit}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="item-left">
                                                <h5>{income.name}</h5>
                                                <p>Rp. {income.total}</p>
                                            </div>
                                            <div className="item-right">
                                                <button className="btn-edit" onClick={() => startEdit(income)}>Edit</button>
                                                <button className="btn-delete" onClick={() => handleDelete(income.id)}>Delete</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )
                        }) :
                        <p className="no-data">gaada income</p>
                }
            </div>

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="btn-page"
                    >
                        &larr; Prev
                    </button>
                    <span className="page-indicator">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="btn-page"
                    >
                        Next &rarr;
                    </button>
                </div>
            )}
        </div>
    )
}

export default Income;

