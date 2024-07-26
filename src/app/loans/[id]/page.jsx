'use client';

import { useState, useEffect } from 'react';
import Amortization from '@/components/Amortization';

const Page = ({ params }) => {
    console.log(params);
    const [loans, setLoans] = useState([]);
    const [loan, setLoan] = useState(null);
    const [currentBalance, setCurrentBalance] = useState(null);
    const [monthsLeft, setMonthsLeft] = useState(null);

    useEffect(() => {
        const savedLoans = JSON.parse(localStorage.getItem('loans')) || [];
        setLoans(savedLoans);
        setLoan(savedLoans[params.id]);
    }, [params.id]);

    useEffect(() => {
        if (loan) {
            calculateCurrentBalance();
            calculateMonthsLeft();
        }
    }, [loan]);

    const handleChange = (event) => {
        const selectedLoanIndex = event.target.value;
        setLoan(loans[selectedLoanIndex]);
    };

    const calculateCurrentBalance = () => {
        const monthlyInterestRate = parseFloat(loan.annualInterestRate) / 12 / 100;
        const emiAmount = parseFloat(loan.emiAmount);
        const loanStartDate = new Date(loan.loanStartDate);
        const currentDate = new Date();
        const monthsElapsed = Math.floor((currentDate - loanStartDate) / (1000 * 60 * 60 * 24 * 30));

        let remainingBalance = parseFloat(loan.loanAmount);
        for (let i = 0; i < monthsElapsed; i++) {
            const interest = remainingBalance * monthlyInterestRate;
            const principal = emiAmount - interest;
            remainingBalance -= principal;
        }

        setCurrentBalance(remainingBalance.toFixed(2));
    };

    const calculateMonthsLeft = () => {
        const monthlyInterestRate = parseFloat(loan.annualInterestRate) / 12 / 100;
        const emiAmount = parseFloat(loan.emiAmount);
        let remainingBalance = parseFloat(loan.loanAmount);
        let monthsLeft = 0;

        while (remainingBalance > emiAmount) {
            const interest = remainingBalance * monthlyInterestRate;
            const principal = emiAmount - interest;
            remainingBalance -= principal;
            monthsLeft++;
        }

        if (remainingBalance > 0) {
            monthsLeft++;
        }

        setMonthsLeft(monthsLeft);
    };

    if (!loan) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{loan.loanName}</h1>
            <div className="mb-4">
                <label htmlFor="loanSelect" className="mr-2">Change Loan:</label>
                <select id="loanSelect" onChange={handleChange} className="p-2 border rounded">
                    {loans.map((loan, index) => (
                        <option key={index} value={index}>{loan.loanName}</option>
                    ))}
                </select>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex gap-10">
                <div>
                    <p><strong>Loan Amount:</strong> {loan.loanAmount}</p>
                    <p><strong>Interest Rate:</strong> {loan.annualInterestRate}%</p>
                    <p><strong>EMI Amount:</strong> {loan.emiAmount}</p>
                </div>
                <div>
                    <p><strong>Current Balance:</strong> {currentBalance || 'Calculating...'}</p>
                    <p><strong>Months Left:</strong> {monthsLeft !== null ? monthsLeft : 'Calculating...'}</p>
                    <p><strong>Start Date:</strong> {loan.loanStartDate}</p>
                </div>
            </div>
            <div>
                <Amortization loan={loan} />
            </div>
        </div>
    );
};

export default Page;
