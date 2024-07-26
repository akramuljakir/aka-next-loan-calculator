'use client';

import { useState, useEffect } from 'react';


// Utility function to sort ledger entries by date
const sortByDate = (entries) => {
    return entries.sort((a, b) => new Date(a.date) - new Date(b.date));
};


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
    const [amortizationSchedule, setAmortizationSchedule] = useState([]);
    let totalLoans = 0
    let balance = 0
    let emiToPay = 0
    let interest = 0
    const data = [
        { date: '2022-07-01', description: 'Opening Balance', principalpaid: 0, interest: 0, emiToPay: 0, balance: 0, totalLoans: totalLoans }
    ];



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

        setAmortizationSchedule(allSchedules);
    }, []);

    // const getMonthClass = (date) => {
    //     const month = new Date(date).getMonth();
    //     const colors = [
    //         'bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100',
    //         'bg-teal-100', 'bg-blue-100', 'bg-indigo-100', 'bg-purple-100',
    //         'bg-pink-100', 'bg-gray-100', 'bg-red-200', 'bg-orange-200'
    //     ];
    //     return colors[month % colors.length];
    // };

    // if (amortizationSchedule.length === 0) {
    //     return <div>Loading...</div>;
    // }



    loans.forEach(loan => {
        const creditAmount = parseFloat(loan.loanAmount);
        const debitAmount = 0
        const principalpaid = debitAmount - creditAmount;
        data.push({
            date: loan.loanStartDate,
            description: `New Loan: ${loan.loanName} Start`,
            principalpaid: principalpaid,
            emiToPay: 0,
            interest: 0,
            balance: creditAmount,
            totalLoans: totalLoans + creditAmount
        });

        totalLoans += creditAmount;
    });




    amortizationSchedule.forEach(transaction => {
        const debitAmount = parseFloat(transaction.emiToPay);
        const creditAmount = parseFloat(transaction.interest);
        const balance = parseFloat(transaction.balance);

        totalLoans -= debitAmount;
        totalLoans += creditAmount;
        const principalpaid = debitAmount - creditAmount;
        data.push({
            date: transaction.date,
            description: `${transaction.loanName} EMI`,
            principalpaid: principalpaid,
            emiToPay: debitAmount,
            interest: creditAmount,
            balance: balance,
            totalLoans: totalLoans

        });
    });




    console.log('data', data)

    const sortedData = sortByDate(data)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">All Loans Amortization Schedule</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Sl No</th>
                            <th className="px-4 py-2 border-b">Date</th>
                            <th className="px-4 py-2 border-b">Loan Name</th>
                            <th className="px-4 py-2 border-b">Principal Paid</th>
                            <th className="px-4 py-2 border-b">Interest</th>
                            <th className="px-4 py-2 border-b">EMI to Pay</th>
                            <th className="px-4 py-2 border-b">Loan Balance</th>
                            <th className="px-4 py-2 border-b">Total Loans</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((payment, index) => (
                            // <tr key={index} className={getMonthClass(payment.date)}>
                            <tr key={index} >
                                <td className="px-4 py-2 border-b">{index + 1}</td>
                                <td className="px-4 py-2 border-b">{payment.date}</td>
                                <td className="px-4 py-2 border-b">{payment.description}</td>
                                <td className="px-4 py-2 border-b">{payment.principalpaid.toFixed(2)}</td>
                                <td className="px-4 py-2 border-b">{payment.interest.toFixed(2)}</td>
                                <td className="px-4 py-2 border-b">{payment.emiToPay.toFixed(2)}</td>
                                <td className="px-4 py-2 border-b">{payment.balance.toFixed(2)}</td>
                                <td className="px-4 py-2 border-b">{payment.totalLoans.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default CombinedAmortizationPage;
