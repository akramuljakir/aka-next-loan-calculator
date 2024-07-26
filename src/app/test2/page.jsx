'use client'
import React from 'react'

const page = () => {
    // Sample opening balance
    const opbal = { item1: 50, item2: 60 };
    const openingBalance = Object.values(opbal).reduce((sum, value) => sum + value, 0);

    // Sample transactions array
    const transactions = [
        { date: '2024-07-01', description: 'Transaction 1', debit: 30, credit: 0 },
        { date: '2024-07-02', description: 'Transaction 2', debit: 0, credit: 20 },
        { date: '2024-07-03', description: 'Transaction 3', debit: 40, credit: 0 },
        { date: '2024-07-04', description: 'Transaction 4', debit: 0, credit: 10 }
    ];

    // New transactions data
    const newTransactions = [
        {
            "date": "2024-07-01",
            "amount": "1.00",
            "interest": "1.00",
            "emiToPay": "2.00",
            "balance": "99.00",
            "loanName": "loan 1"
        },
        {
            "date": "2024-07-03",
            "amount": "2.00",
            "interest": "3.00",
            "emiToPay": "5.00",
            "balance": "198.00",
            "loanName": "loan 2"
        },
        {
            "date": "2024-08-01",
            "amount": "1.01",
            "interest": "0.99",
            "emiToPay": "2.00",
            "balance": "97.99",
            "loanName": "loan 1"
        },
        {
            "date": "2024-08-03",
            "amount": "2.03",
            "interest": "2.97",
            "emiToPay": "5.00",
            "balance": "195.97",
            "loanName": "loan 2"
        },
        {
            "date": "2024-09-01",
            "amount": "1.02",
            "interest": "0.98",
            "emiToPay": "2.00",
            "balance": "96.97",
            "loanName": "loan 1"
        },
        {
            "date": "2024-09-03",
            "amount": "2.06",
            "interest": "2.94",
            "emiToPay": "5.00",
            "balance": "193.91",
            "loanName": "loan 2"
        }
    ];

    // Initialize the ledger with the opening balance
    let balance = openingBalance;
    const ledger = [
        { date: '2024-07-01', description: 'Opening Balance', debit: 0, credit: 0, balance: balance }
    ];

    // Process initial transactions
    transactions.forEach(transaction => {
        balance -= transaction.debit;
        balance += transaction.credit;

        ledger.push({
            date: transaction.date,
            description: transaction.description,
            debit: transaction.debit,
            credit: transaction.credit,
            balance: balance
        });
    });

    // Add new transactions to ledger
    newTransactions.forEach(transaction => {
        const debitAmount = parseFloat(transaction.emiToPay);
        const creditAmount = parseFloat(transaction.interest);

        balance -= debitAmount;
        balance += creditAmount;

        ledger.push({
            date: transaction.date,
            description: `Loan: ${transaction.loanName}`,
            debit: debitAmount,
            credit: creditAmount,
            balance: balance
        });
    });

    // Output the ledger
    console.table(ledger);

    return (
        <div>page</div>
    )
}

export default page