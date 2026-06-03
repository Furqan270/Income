import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Title, InputForm, Income, Expense } from './components';

function App() {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const getIncomes = () => {
    axios.get("http://localhost:3000/income")
      .then((res) => {
        setIncomes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getExpenses = () => {
    axios.get("http://localhost:3000/expense")
      .then((res) => {
        setExpenses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);

  return (
    <div className="App">
      <Title />
      <InputForm onIncomeAdded={getIncomes} onExpenseAdded={getExpenses} />

      <div className="transaction-list">
        <hr />
        <div className="transaction-heading">
          <h3>transaction List</h3>
        </div>
        <div className="transactions">
          <Income incomes={incomes} refreshIncomes={getIncomes} />
          <Expense expenses={expenses} refreshExpenses={getExpenses} />
        </div>
      </div>
    </div>
  );
}


export default App;

