"use client";

import { useState, useEffect } from 'react';
import LoanForm from '@/components/LoanForm';
import Link from 'next/link';

const Home = () => {
  const [loans, setLoans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(null);

  useEffect(() => {
    const savedLoans = JSON.parse(localStorage.getItem('loans')) || [];
    setLoans(savedLoans);
    console.log(savedLoans);
  }, []);

  const openModal = (loan = null) => {
    setCurrentLoan(loan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentLoan(null);
  };

  const saveLoan = (loan) => {
    let updatedLoans = [];
    if (currentLoan) {
      updatedLoans = loans.map((item) =>
        item.loanName === currentLoan.loanName ? loan : item
      );
    } else {
      updatedLoans = [...loans, loan];
    }
    setLoans(updatedLoans);
    localStorage.setItem('loans', JSON.stringify(updatedLoans));
  };

  const editLoan = (index) => {
    openModal(loans[index]);
  };

  const deleteLoan = (index) => {
    const updatedLoans = loans.filter((_, i) => i !== index);
    setLoans(updatedLoans);
    localStorage.setItem('loans', JSON.stringify(updatedLoans));
  };

  return (
    <div className="flex flex-col items-center p-2">
      <div className="w-full max-w-full overflow-x-auto">
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Add Loan
        </button>

        <h2 className="text-2xl font-bold mb-4">Loan List</h2>
        <div className="">
          <table className="min-w-full bg-white border text-sm">
            <thead>
              <tr>
                <th className="border px-4 py-2 w-56">Loan Name</th>
                <th className="border px-4 py-2 w-30">Loan Amount</th>
                <th className="border px-4 py-2">Interest Rate</th>
                <th className="border px-4 py-2">EMI Amount</th>
                <th className="border px-4 py-2">Current Balance</th>
                <th className="border px-4 py-2">Months Left</th>
                <th className="border px-4 py-2">Start Date</th>
                <th className="border px-4 py-2 w-44">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <Link href={`/loan/${index}`}>
                      {loan.loanName}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{loan.loanAmount}</td>
                  <td className="border px-4 py-2">{loan.annualInterestRate}</td>
                  <td className="border px-4 py-2">{loan.emiAmount}</td>
                  <td className="border px-4 py-2">{loan.currentBalance}</td>
                  <td className="border px-4 py-2">{loan.monthsLeft}</td>
                  <td className="border px-4 py-2">{loan.loanStartDate}</td>
                  <td className="border px-4 py-2 w-36 ">
                    <button
                      onClick={() => editLoan(index)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2 w-14"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteLoan(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md w-14"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <LoanForm
          loan={currentLoan}
          onSave={saveLoan}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Home;
