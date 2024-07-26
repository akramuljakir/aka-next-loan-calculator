'use client';

import { useState, useEffect } from 'react';

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
            amount: principal.toFixed(2), // Adjusted to show principal paid
            interest: interest.toFixed(2),
            emiToPay: emiAmount.toFixed(2),
            balance: remainingBalance.toFixed(2),
            loanName: loan.loanName
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    console.log("parameter in calculateAmortization", loan);
    console.log("output of amortizationSchedule", amortizationSchedule);

    return amortizationSchedule;
};

const CombinedAmortizationPage = () => {
    const [loans, setLoans] = useState([]);
    const [combinedSchedule, setCombinedSchedule] = useState([]);

    useEffect(() => {
        const savedLoans = JSON.parse(localStorage.getItem('loans')) || [];
        setLoans(savedLoans);
        console.log("savedLoans", savedLoans);

        // Combine amortization schedules of all loans
        const allSchedules = savedLoans.reduce((acc, loan) => {
            return acc.concat(calculateAmortization(loan));
        }, []);

        console.log("all loan in single array", allSchedules);
        // Sort by date
        allSchedules.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate combined balance
        const combinedSchedule = [];
        const balanceTracker = {};

        allSchedules.forEach((payment, index) => {
            let combinedBalance = parseFloat(payment.balance);

            for (let i = 0; i < index; i++) {
                if (allSchedules[i].loanName !== payment.loanName) {
                    combinedBalance += parseFloat(allSchedules[i].balance);
                }
            }

            combinedSchedule.push({
                ...payment,
                combinedBalance: combinedBalance.toFixed(2)
            });
        });

        setCombinedSchedule(combinedSchedule);
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
                            <th className="px-4 py-2 border-b">Principal Paid</th>
                            <th className="px-4 py-2 border-b">Interest</th>
                            <th className="px-4 py-2 border-b">EMI to Pay</th>
                            <th className="px-4 py-2 border-b">Balance</th>
                            <th className="px-4 py-2 border-b">Combined Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedSchedule.map((payment, index) => (
                            <tr key={index} className={getMonthClass(payment.date)}>
                                <td className="px-4 py-2 border-b">{index + 1}</td>
                                <td className="px-4 py-2 border-b">{payment.loanName}</td>
                                <td className="px-4 py-2 border-b">{payment.date}</td>
                                <td className="px-4 py-2 border-b">{payment.amount}</td>
                                <td className="px-4 py-2 border-b">{payment.interest}</td>
                                <td className="px-4 py-2 border-b">{payment.emiToPay}</td>
                                <td className="px-4 py-2 border-b">{payment.balance}</td>
                                <td className="px-4 py-2 border-b">{payment.combinedBalance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CombinedAmortizationPage;
