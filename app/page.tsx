'use client'

import React, { useState } from 'react';

interface RowData {
  amount: string;
  names: string[];
  isDrinking?: boolean; // 술 관련 항목인지 표시
}

interface Result {
  name: string;
  amount: number;
  drinkingAmount: number; // 술값 정산 금액
  foodAmount: number; // 식사 정산 금액
}

export default function Home() {
  // 상태 관리
  const [section1, setSection1] = useState<RowData[]>([{ amount: '', names: [''], isDrinking: false }]);
  const [results, setResults] = useState<Result[]>([]);
  const [cardOwner, setCardOwner] = useState<string>('');

  // 행 추가 함수
  const addRow = () => {
    setSection1([...section1, { amount: '', names: [''], isDrinking: false }]);
  };

  // 행 삭제 함수
  const removeRow = (index: number) => {
    if (section1.length > 1) {
      const newSection = [...section1];
      newSection.splice(index, 1);
      setSection1(newSection);
    }
  };

  // 금액 업데이트 함수
  const updateAmount = (index: number, value: string) => {
    const newSection = [...section1];
    newSection[index].amount = value;
    setSection1(newSection);
  };

  // 술 항목 토글 함수
  const toggleDrinking = (index: number) => {
    const newSection = [...section1];
    newSection[index].isDrinking = !newSection[index].isDrinking;
    setSection1(newSection);
  };

  // 이름 추가 함수
  const addName = (rowIndex: number) => {
    const newSection = [...section1];
    newSection[rowIndex].names.push('');
    setSection1(newSection);
  };

  // 이름 삭제 함수
  const removeName = (rowIndex: number, nameIndex: number) => {
    if (section1[rowIndex].names.length > 1) {
      const newSection = [...section1];
      newSection[rowIndex].names.splice(nameIndex, 1);
      setSection1(newSection);
    }
  };

  // 이름 업데이트 함수
  const updateName = (rowIndex: number, nameIndex: number, value: string) => {
    const newSection = [...section1];
    newSection[rowIndex].names[nameIndex] = value;
    setSection1(newSection);
  };

  // 정산 계산 함수
  const calculate = () => {
    const allExpenses: Record<string, { total: number, drinking: number, food: number }> = {};
    
    // 지출 처리
    section1.forEach(row => {
      const amount = parseFloat(row.amount) || 0;
      const validNames = row.names.filter(name => name.trim() !== '');
      const namesCount = validNames.length;
      
      if (amount > 0 && namesCount > 0) {
        const amountPerPerson = amount / namesCount;
        
        validNames.forEach(name => {
          if (!allExpenses[name]) {
            allExpenses[name] = { total: 0, drinking: 0, food: 0 };
          }
          
          allExpenses[name].total += amountPerPerson;
          
          // 술값인지 식사값인지 구분
          if (row.isDrinking) {
            allExpenses[name].drinking += amountPerPerson;
          } else {
            allExpenses[name].food += amountPerPerson;
          }
        });
      }
    });
    
    // 결과 계산
    const calculatedResults = Object.entries(allExpenses).map(([name, amounts]) => ({
      name,
      amount: amounts.total,
      drinkingAmount: amounts.drinking,
      foodAmount: amounts.food
    }));
    
    setResults(calculatedResults);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        marginBottom: '20px',
        backgroundColor: '#f2f2f2',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          backgroundColor: '#757575', 
          color: 'white', 
          padding: '5px 15px',
          fontWeight: 'bold'
        }}>
          Ver.J001
        </div>
        <div style={{ 
          display: 'flex',
          borderBottom: '1px solid #ddd'
        }}>
          <div style={{ 
            padding: '5px 15px', 
            backgroundColor: '#757575', 
            color: 'white', 
            flex: '0 0 80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            카드 주인
          </div>
          <div style={{ 
            flex: 1, 
            padding: '5px 15px',
            backgroundColor: '#ffff00'
          }}>
            <input
              type="text"
              placeholder="카드 주인 이름 입력"
              value={cardOwner}
              onChange={(e) => setCardOwner(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ 
            padding: '5px 15px', 
            backgroundColor: '#757575', 
            color: 'white', 
            flex: '0 0 80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            만든이
          </div>
          <div style={{ 
            flex: 1, 
            padding: '5px 15px' 
          }}>
            Jin_nek
          </div>
        </div>
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>우리 정산해요</h1>
      
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ marginBottom: '15px' }}>지출 항목</h2>
        {section1.map((row, rowIndex) => (
          <div key={`section1-${rowIndex}`} style={{ 
            marginBottom: '15px',
            padding: '15px',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            backgroundColor: 'white'
          }}>
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="금액"
                  value={row.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    updateAmount(rowIndex, e.target.value)
                  }
                  style={{ 
                    width: '150px',
                    padding: '8px',
                    marginRight: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <span>원</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={row.isDrinking}
                    onChange={() => toggleDrinking(rowIndex)}
                    style={{ marginRight: '5px' }}
                  />
                  술값
                </label>
                <button 
                  onClick={() => removeRow(rowIndex)}
                  style={{ 
                    padding: '5px 10px',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
            <div>
              {row.names.map((name, nameIndex) => (
                <div key={`section1-${rowIndex}-name-${nameIndex}`} style={{ 
                  marginBottom: '8px', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <input
                    placeholder="이름"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateName(rowIndex, nameIndex, e.target.value)
                    }
                    style={{ 
                      flex: 1,
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <button 
                    onClick={() => removeName(rowIndex, nameIndex)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addName(rowIndex)}
                style={{ 
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                + 이름 추가
              </button>
            </div>
          </div>
        ))}
        <button 
          onClick={addRow}
          style={{ 
            width: '100%',
            padding: '10px',
            backgroundColor: '#e0e0e0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          + 항목 추가
        </button>
      </div>
      
      <button 
        onClick={calculate}
        style={{ 
          width: '100%',
          padding: '12px',
          backgroundColor: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        정산 계산하기
      </button>
      
      {results.length > 0 && (
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ marginBottom: '15px' }}>정산 결과</h2>
          <div>
          {results.map((result, index) => (
  <div key={`result-${index}`} style={{ 
    padding: '15px',
    marginBottom: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    backgroundColor: 'white'
  }}>
    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '16px' }}>
      {result.name}
    </p>
    <div style={{ marginLeft: '15px' }}>
      <p style={{ margin: '5px 0' }}>
        <strong>총:</strong> {result.amount > 0 
          ? `${Math.abs(result.amount).toFixed(0)}원 (정산금)` 
          : `${Math.abs(result.amount).toFixed(0)}원`}
      </p>
      {result.drinkingAmount !== 0 && (
        <p style={{ margin: '5px 0' }}>
          <strong>술값:</strong> {Math.abs(result.drinkingAmount).toFixed(0)}원
        </p>
      )}
      {result.foodAmount !== 0 && (
        <p style={{ margin: '5px 0' }}>
          <strong>식사:</strong> {Math.abs(result.foodAmount).toFixed(0)}원
        </p>
      )}
    </div>
  </div>
))}
          </div>
        </div>
      )}
    </div>
  );
}