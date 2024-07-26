'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const AllLoansPage = () => {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        const savedLoans = JSON.parse(localStorage.getItem('loans')) || [];
        setLoans(savedLoans);
    }, []);

    if (loans.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">All Loans</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Loan Name</th>
                            <th className="px-4 py-2 border-b">Loan Amount</th>
                            <th className="px-4 py-2 border-b">Interest Rate</th>
                            <th className="px-4 py-2 border-b">EMI Amount</th>
                            <th className="px-4 py-2 border-b">Start Date</th>
                            <th className="px-4 py-2 border-b">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 border-b">{loan.loanName}</td>
                                <td className="px-4 py-2 border-b">{loan.loanAmount}</td>
                                <td className="px-4 py-2 border-b">{loan.annualInterestRate}%</td>
                                <td className="px-4 py-2 border-b">{loan.emiAmount}</td>
                                <td className="px-4 py-2 border-b">{loan.loanStartDate}</td>
                                <td className="px-4 py-2 border-b">
                                    <Link href={`/loan/${index}`} className="text-blue-500 hover:underline">
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllLoansPage;
