import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Expense = ({ expenses, refreshExpenses }) => {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editTotal, setEditTotal] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const totalPages = Math.ceil((expenses ? expenses.length : 0) / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedExpenses = expenses ? expenses.slice(startIndex, startIndex + ITEMS_PER_PAGE) : [];

    // Ensure we don't display an empty page after items are deleted
    useEffect(() => {
        const maxPage = Math.ceil((expenses ? expenses.length : 0) / ITEMS_PER_PAGE) || 1;
        if (currentPage > maxPage) {
            setCurrentPage(maxPage);
        }
    }, [expenses, currentPage]);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/expense/${id}`)
            .then(() => {
                refreshExpenses();
            })
            .catch((err) => {
                console.log("Error deleting expense:", err);
            });
    };

    const startEdit = (expense) => {
        setEditingId(expense.id);
        setEditName(expense.name);
        setEditTotal(expense.total);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
        setEditTotal("");
    };

    const handleSave = (id) => {
        if (!editName.trim() || !editTotal) return;
        axios.put(`http://localhost:3000/expense/${id}`, {
            id: String(id),
            name: editName,
            total: Number(editTotal)
        })
            .then(() => {
                refreshExpenses();
                cancelEdit();
            })
            .catch((err) => {
                console.log("Error updating expense:", err);
            });
    };

    return (
        <div className="expense-list" >
            <div className="expense-heading">
                <h5>Expense</h5>
            </div>
            <div className="expense-items">
                {
                    paginatedExpenses.length !== 0 ?
                        paginatedExpenses.map((expense) => {
                            const isEditing = expense.id === editingId;
                            return (
                                <div key={expense.id} className="card-item">
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
                                                <button className="btn-save" onClick={() => handleSave(expense.id)}>Save</button>
                                                <button className="btn-cancel" onClick={cancelEdit}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="item-left">
                                                <h5>{expense.name}</h5>
                                                <p>Rp. {expense.total}</p>
                                            </div>
                                            <div className="item-right">
                                                <button className="btn-edit" onClick={() => startEdit(expense)}>Edit</button>
                                                <button className="btn-delete" onClick={() => handleDelete(expense.id)}>Delete</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )
                        }) :
                        <p className="no-data">gaada expense</p>
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

export default Expense;

