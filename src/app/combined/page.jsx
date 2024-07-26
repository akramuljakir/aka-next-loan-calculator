'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const calculateAmortization = (loan) => {
    const amortizationSchedule = [];
    const monthlyInterestRate = parseFloat(loan.annualInterestRate) / 12 / 100;
    let remainingBalance = parseFloat(loan.loanAmount);
    const emiAmount = parseFloat(loan.emiAmount);
    const startDate = new Date(loan.loanStartDate);
    let currentDate = new Date(startDate);

    while (remainingBalance > 0) {
        const interest = remainingBalance * monthlyInterestRate;
        const principal = emiAmount - interest;
        remainingBalance -= principal;
        if (remainingBalance < 0) remainingBalance = 0;

        amortizationSchedule.push({
            date: currentDate.toISOString().split('T')[0],
            amount: emiAmount.toFixed(2),
            interest: interest.toFixed(2),
            capitalPaid: principal.toFixed(2),
            emiToPay: emiAmount.toFixed(2),
            balance: remainingBalance.toFixed(2),
            loanName: loan.loanName
        });

        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return amortizationSchedule;
};

const Combined = () => {
    const [loans, setLoans] = useState([]);
    const [combinedSchedule, setCombinedSchedule] = useState([]);
    const [combinedBalances, setCombinedBalances] = useState([]);

    useEffect(() => {
        const savedLoans = JSON.parse(localStorage.getItem('loans')) || [];
        setLoans(savedLoans);

        // Combine amortization schedules of all loans
        const allSchedules = savedLoans.reduce((acc, loan) => {
            return acc.concat(calculateAmortization(loan));
        }, []);

        // Sort by date
        allSchedules.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate combined balances
        const balances = {};
        allSchedules.forEach(payment => {
            if (!balances[payment.date]) {
                balances[payment.date] = 0;
            }
            balances[payment.date] += parseFloat(payment.balance);
        });

        const combinedBalancesArray = Object.entries(balances).map(([date, balance]) => ({
            date,
            balance: balance.toFixed(2)
        }));

        setCombinedSchedule(allSchedules);
        setCombinedBalances(combinedBalancesArray);
    }, []);

    const getMonthClass = (date) => {
        const month = new Date(date).getMonth();
        const colors = [
            'bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100',
            'bg-teal-100', 'bg-blue-100', 'bg-indigo-100', 'bg-purple-100',
            'bg-pink-100', 'bg-gray-100', 'bg-red-200', 'bg-orange-200'
        ];
        return colors[month % colors.length];
    };

    if (combinedSchedule.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">All Loans Amortization Schedule</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Sl No</th>
                            <th className="px-4 py-2 border-b">Loan Name</th>
                            <th className="px-4 py-2 border-b">Date</th>
                            <th className="px-4 py-2 border-b">Capital Paid</th>
                            <th className="px-4 py-2 border-b">Amount</th>
                            <th className="px-4 py-2 border-b">Interest</th>
                            <th className="px-4 py-2 border-b">EMI to Pay</th>
                            <th className="px-4 py-2 border-b">Balance</th>
                            <th className="px-4 py-2 border-b">Combined Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedSchedule.map((payment, index) => {
                            const combinedBalance = combinedBalances.find(b => b.date === payment.date)?.balance || '0.00';
                            return (
                                <tr key={index} className={getMonthClass(payment.date)}>
                                    <td className="px-4 py-2 border-b">{index + 1}</td>
                                    <td className="px-4 py-2 border-b">{payment.loanName}</td>
                                    <td className="px-4 py-2 border-b">{payment.date}</td>
                                    <td className="px-4 py-2 border-b">{payment.capitalPaid}</td>
                                    <td className="px-4 py-2 border-b">{payment.amount}</td>
                                    <td className="px-4 py-2 border-b">{payment.interest}</td>
                                    <td className="px-4 py-2 border-b">{payment.emiToPay}</td>
                                    <td className="px-4 py-2 border-b">{payment.balance}</td>
                                    <td className="px-4 py-2 border-b">{combinedBalance}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Combined;
