// src/app/ledger/page.js

import React from 'react';

// Utility function to sort ledger entries by date
const sortByDate = (entries) => {
    return entries.sort((a, b) => new Date(a.date) - new Date(b.date));
};

const LedgerPage = () => {
    // Sample opening balance
    // const opbal = { item1: 0, item2: 0 };
    // const openingBalance = Object.values(opbal).reduce((sum, value) => sum + value, 0);

    // Initial transactions array
    const transactions = [
        // { date: '2024-07-01', description: 'Transaction 1', debit: 30, credit: 0 },
        // { date: '2024-07-02', description: 'Transaction 2', debit: 0, credit: 20 },
        // { date: '2024-07-03', description: 'Transaction 3', debit: 40, credit: 0 },
        // { date: '2024-07-04', description: 'Transaction 4', debit: 0, credit: 10 }
    ];

    // New transactions data
    const newTransactions = [
        { date: '2024-07-01', amount: '1.00', interest: '1.00', emiToPay: '2.00', balance: '99.00', loanName: 'loan 1' },
        { date: '2024-07-03', amount: '2.00', interest: '3.00', emiToPay: '5.00', balance: '198.00', loanName: 'loan 2' },
        { date: '2024-08-01', amount: '1.01', interest: '0.99', emiToPay: '2.00', balance: '97.99', loanName: 'loan 1' },
        { date: '2024-08-03', amount: '2.03', interest: '2.97', emiToPay: '5.00', balance: '195.97', loanName: 'loan 2' },
        { date: '2024-09-01', amount: '1.02', interest: '0.98', emiToPay: '2.00', balance: '96.97', loanName: 'loan 1' },
        { date: '2024-09-03', amount: '2.06', interest: '2.94', emiToPay: '5.00', balance: '193.91', loanName: 'loan 2' }
    ];

    // Loan data
    const loans = [
        {
            "loanName": "loan 2",
            "loanAmount": "200",
            "annualInterestRate": "18",
            "emiAmount": "5",
            "monthlyEmiDay": "",
            "loanType": "reducing",
            "loanStartDate": "2024-07-03",
            "processingCharges": ""
        },
        {
            "loanName": "loan 1",
            "loanAmount": "100",
            "annualInterestRate": "12",
            "emiAmount": "2",
            "monthlyEmiDay": "",
            "loanType": "reducing",
            "loanStartDate": "2024-07-01",
            "processingCharges": ""
        }
    ];

    // Initialize the ledger with the opening balance
    // let balance =  openingBalance;
    let balance = 0

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
            description: `${transaction.loanName} EMI`,
            debit: debitAmount,
            credit: creditAmount,
            balance: balance
        });
    });

    // Add loan data to ledger
    loans.forEach(loan => {
        const creditAmount = parseFloat(loan.loanAmount);

        ledger.push({
            date: loan.loanStartDate,
            description: `New Loan: ${loan.loanName} Start`,
            debit: 0,
            credit: creditAmount,
            balance: balance + creditAmount
        });

        balance += creditAmount;
    });

    // Sort ledger entries by date
    const sortedLedger = sortByDate(ledger);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Ledger</h1>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedLedger.map((entry, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.debit.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.credit.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.balance.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LedgerPage;
