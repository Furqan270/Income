import React, { useState, useEffect } from "react";
import axios from "axios";

const InputForm = ({ onIncomeAdded, onExpenseAdded }) => {

    const [name, setName] = useState("")
    const [total, setTotal] = useState("")
    const [nextIncomeId, setNextIncomeId] = useState(1)
    const [nextExpenseId, setNextExpenseId] = useState(1)

    useEffect(() => {
        axios.get("http://localhost:3000/income")
            .then((res) => {
                const maxId = res.data.reduce((max, item) => {
                    const id = Number(item.id)
                    return Number.isFinite(id) ? Math.max(max, id) : max
                }, 0)
                setNextIncomeId(maxId + 1)
            })
            .catch((err) => {
                console.log(err)
            })

        axios.get("http://localhost:3000/expense")
            .then((res) => {
                const maxId = res.data.reduce((max, item) => {
                    const id = Number(item.id)
                    return Number.isFinite(id) ? Math.max(max, id) : max
                }, 0)
                setNextExpenseId(maxId + 1)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const incomeHandler = () => {
        if (!name.trim() || !total) return;
        const url = "http://localhost:3000";
        axios.post(url + "/income", {
            id: String(nextIncomeId),
            name: name,
            total: Number(total)
        })
            .then((res) => {
                console.log(res.data);
                setName("");
                setTotal("");
                setNextIncomeId((prev) => prev + 1);
                if (onIncomeAdded) {
                    onIncomeAdded();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const expenseHandler = () => {
        if (!name.trim() || !total) return;
        const url = "http://localhost:3000";
        axios.post(url + "/expense", {
            id: String(nextExpenseId),
            name: name,
            total: Number(total)
        })
            .then((res) => {
                console.log(res.data);
                setName("");
                setTotal("");
                setNextExpenseId((prev) => prev + 1);
                if (onExpenseAdded) {
                    onExpenseAdded();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="input-form">
            <div className="form-item">
                <label>Nama Transaksi : </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
            </div>
            <div className="form-item">
                <label>Total : </label>
                <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    placeholder="Total"
                />
            </div>
            <div className="submit-form">
                <button className="btn-income" onClick={() => incomeHandler()}>Add Income</button>
                <button className="btn-expense" onClick={() => expenseHandler()}>Add Expense</button>
            </div>
        </div>
    )
};

export default InputForm;

