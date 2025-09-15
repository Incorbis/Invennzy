import React, { useState } from 'react';
import { Plus, Trash2, Download, Calculator, Send, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from "axios";

function deadreport() {
  const [equipmentCount, setEquipmentCount] = useState(1);
  const [equipment, setEquipment] = useState([]);
  const [isTableGenerated, setIsTableGenerated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [manuallyChangedYears, setManuallyChangedYears] = useState(new Set());
  const [importStatus, setImportStatus] = useState('');

  // Get financial year string
  const getFinancialYear = (year) => {
    return `${year}-${(year + 1).toString().slice(-2)}`;
  };

  // Generate unique DRS number
  const generateDRSNumber = (purchaseYear, userInput) => {
    if (!purchaseYear) {
      return `PCCOER/COMP//`;
    }
    if (!userInput) {
      return `PCCOER/COMP/${purchaseYear}/`;
    }

    return `PCCOER/COMP/${purchaseYear}/${userInput}`;
  };

  // Initialize equipment array
  const generateEquipmentTable = () => {
    const currentYear = new Date().getFullYear();
    const newEquipment = Array.from({ length: equipmentCount }, (_, index) => {
      const fy = getFinancialYear(currentYear);
      return {
        id: `eq_${index + 1}_${Date.now()}`,
        poNoAndDate: '',
        purchaseYear: fy,
        name: '',
        drsUserInput: `EQ${index + 1}`,
        drsNo: generateDRSNumber(fy, `EQ${index + 1}`),
        quantity: 1,
        unitRate: 0,
        cost: 0,
        remarks: ''
      };
    });
    setEquipment(newEquipment);
    setIsTableGenerated(true);
  };

  // Import from Excel
  const importFromExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportStatus('Importing...');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          setImportStatus('Error: Excel file must contain headers and data');
          setTimeout(() => setImportStatus(''), 3000);
          return;
        }

        const headers = jsonData[0].map(h => h?.toString().toLowerCase().trim());
        const rows = jsonData.slice(1);

        // Map Excel columns to our fields (flexible matching)
        const columnMap = {
          poNoAndDate: findColumn(headers, ['po no', 'po number', 'po', 'purchase order', 'po no & date']),
          purchaseYear: findColumn(headers, ['purchase year', 'year', 'financial year', 'fy']),
          name: findColumn(headers, ['name', 'equipment name', 'equipment', 'item name', 'description']),
          drsUserInput: findColumn(headers, ['drs input', 'drs user input', 'equipment id', 'eq id']),
          quantity: findColumn(headers, ['quantity', 'qty', 'count']),
          unitRate: findColumn(headers, ['rate', 'unit rate', 'price', 'unit price', 'cost per unit']),
          cost: findColumn(headers, ['cost', 'total cost', 'amount', 'total amount']),
          remarks: findColumn(headers, ['remarks', 'notes', 'comments', 'description'])
        };

        const importedEquipment = rows
          .filter(row => row.some(cell => cell !== undefined && cell !== ''))
          .map((row, index) => {
            const currentYear = new Date().getFullYear();
            const defaultFY = getFinancialYear(currentYear);
            
            // Extract data from Excel row
            const poNoAndDate = getValue(row, columnMap.poNoAndDate) || '';
            const purchaseYear = getValue(row, columnMap.purchaseYear) || defaultFY;
            const name = getValue(row, columnMap.name) || '';
            const drsUserInput = getValue(row, columnMap.drsUserInput) || `EQ${index + 1}`;
            const quantity = parseInt(getValue(row, columnMap.quantity)) || 1;
            const unitRate = parseFloat(getValue(row, columnMap.unitRate)) || 0;
            const providedCost = parseFloat(getValue(row, columnMap.cost));
            const remarks = getValue(row, columnMap.remarks) || '';

            // Calculate cost (Excel data takes priority if provided)
            const calculatedCost = quantity * unitRate;
            const cost = !isNaN(providedCost) ? providedCost : calculatedCost;

            return {
              id: `eq_${index + 1}_${Date.now()}`,
              poNoAndDate,
              purchaseYear,
              name,
              drsUserInput,
              drsNo: generateDRSNumber(purchaseYear, drsUserInput),
              quantity,
              unitRate,
              cost,
              remarks
            };
          });

        if (importedEquipment.length === 0) {
          setImportStatus('Error: No valid data found in Excel file');
          setTimeout(() => setImportStatus(''), 3000);
          return;
        }

        setEquipment(importedEquipment);
        setIsTableGenerated(true);
        setImportStatus(`Successfully imported ${importedEquipment.length} equipment items`);
        setTimeout(() => setImportStatus(''), 3000);

      } catch (error) {
        setImportStatus('Error: Failed to read Excel file. Please check the format.');
        setTimeout(() => setImportStatus(''), 3000);
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = ''; // Reset file input
  };

  // Helper function to find column index by multiple possible names
  const findColumn = (headers, possibleNames) => {
    for (const name of possibleNames) {
      const index = headers.findIndex(h => h?.includes(name));
      if (index !== -1) return index;
    }
    return -1;
  };

  // Helper function to get value from row
  const getValue = (row, columnIndex) => {
    if (columnIndex === -1 || !row[columnIndex]) return '';
    return row[columnIndex].toString().trim();
  };

  // Update equipment field
  const updateEquipment = (id, field, value) => {
    setEquipment(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Auto-calculate cost when quantity or unit rate changes
        if (field === 'quantity' || field === 'unitRate') {
          updatedItem.cost = Number(updatedItem.quantity) * Number(updatedItem.unitRate);
        }
        // Update DRS number when purchase year or user input changes
        if (field === 'purchaseYear' || field === 'drsUserInput') {
          updatedItem.drsNo = generateDRSNumber(
            field === 'purchaseYear' ? value : updatedItem.purchaseYear,
            field === 'drsUserInput' ? value : updatedItem.drsUserInput
          );
        }
        return updatedItem;
      }
      return item;
    }));

    // Handle purchase year cascading
    if (field === 'purchaseYear') {
      // Mark this item's year as manually changed
      setManuallyChangedYears(prev => new Set([...prev, id]));
      
      // Find the index of the current item
      const currentIndex = equipment.findIndex(item => item.id === id);
      
      // Update all subsequent items that haven't been manually changed
      setEquipment(prev => prev.map((item, index) => {
        if (index > currentIndex && !manuallyChangedYears.has(item.id)) {
          return { 
            ...item, 
            purchaseYear: value,
            drsNo: generateDRSNumber(value, item.drsUserInput)
          };
        }
        return item;
      }));
    }
  };

  // Add new equipment row
  const addEquipmentRow = () => {
    const currentYear = new Date().getFullYear();
    const fy = getFinancialYear(currentYear);

    const newItem = {
      id: `eq_${equipment.length + 1}_${Date.now()}`,
      poNoAndDate: '',
      purchaseYear: fy,
      name: '',
      drsUserInput: `EQ${equipment.length + 1}`,
      drsNo: generateDRSNumber(fy, `EQ${equipment.length + 1}`),
      quantity: 1,
      unitRate: 0,
      cost: 0,
      remarks: ''
    };
    setEquipment(prev => [...prev, newItem]);
  };

  // Remove equipment row
  const removeEquipmentRow = (id) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
    setManuallyChangedYears(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  // Handle Enter key navigation
  const handleKeyDown = (e, currentRowIndex, currentField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const fields = ['poNoAndDate', 'purchaseYear', 'name', 'drsUserInput', 'quantity', 'unitRate', 'remarks'];
      const currentFieldIndex = fields.indexOf(currentField);
      
      if (currentFieldIndex < fields.length - 1) {
        // Move to next column in same row
        const nextField = fields[currentFieldIndex + 1];
        const nextInput = document.querySelector(`input[data-row="${currentRowIndex}"][data-field="${nextField}"]`);
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        // Last column - move to first column of next row or create new row
        if (currentRowIndex < equipment.length - 1) {
          const nextRowInput = document.querySelector(`input[data-row="${currentRowIndex + 1}"][data-field="poNoAndDate"]`);
          if (nextRowInput) {
            nextRowInput.focus();
          }
        } else {
          // Create new row and focus on it
          addEquipmentRow();
          setTimeout(() => {
            const newRowInput = document.querySelector(`input[data-row="${equipment.length}"][data-field="poNoAndDate"]`);
            if (newRowInput) {
              newRowInput.focus();
            }
          }, 50);
        }
      }
    }
  };

  // Calculate total cost
  const totalCost = equipment.reduce((sum, item) => sum + item.cost, 0);
  
const submitResponse = async () => {
  try {
    // reset state before submission
    setIsSubmitted(false);

    // Generate a unique deadstock_id for this batch
   const deadstockId = Math.floor(100000 + Math.random() * 900000);
   const staff_id = localStorage.getItem("staffId");

    for (const item of equipment) {
      await axios.post("/api/deadstock", {
        po_no: item.poNoAndDate || null,
        purchase_year: item.purchaseYear,
        equipment_name: item.name,
        ds_number: item.drsNo,
        quantity: item.quantity,
        unit_rate: item.unitRate,
        cost: item.cost,
        remark: item.remarks || null,
        staff_id,
        deadstock_id: deadstockId // ✅ keep track of which set it belongs to
      });
    }

    setIsSubmitted(true); // ✅ mark as submitted only if all requests succeed
    alert("Equipment data submitted successfully!");
  } catch (error) {
    console.error("Error submitting equipment data:", error);
    setIsSubmitted(false); // ❌ failed submission
    alert("Failed to submit equipment data.");
  }
};

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Sr No', 'PO No & Date', 'Purchase Year', 'Name of Equipment', 'DRS User Input', 'DRS No', 'Quantity', 'Per Unit Rate', 'Cost', 'Remarks'];
    const csvContent = [
      headers.join(','),
      ...equipment.map((item, index) => [
        index + 1,
        `"${item.poNoAndDate}"`,
        item.purchaseYear,
        `"${item.name}"`,
        `"${item.drsUserInput}"`,
        item.drsNo,
        item.quantity,
        item.unitRate,
        item.cost.toFixed(2),
        `"${item.remarks}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equipment_list_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Equipment Management System</h1>
          <p className="text-slate-600">Manage your equipment inventory with automated DRS generation</p>
        </div>

        {/* Import Status Message */}
        {importStatus && (
          <div className={`border rounded-xl p-4 mb-6 ${
            importStatus.includes('Error') 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${
                importStatus.includes('Error') ? 'bg-red-500' : 'bg-green-500'
              }`}></div>
              <span className="font-medium">{importStatus}</span>
            </div>
          </div>
        )}

        {/* Submission Success Message */}
        {isSubmitted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-green-800 font-medium">Equipment data submitted successfully!</span>
            </div>
          </div>
        )}

        {/* Initial Setup Form */}
        {!isTableGenerated && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-slate-800">Setup Equipment List</h2>
            </div>
            
            {/* Manual Entry Option */}
            <div className="flex flex-col sm:flex-row gap-4 items-end mb-6">
              <div className="flex-1">
                <label htmlFor="equipmentCount" className="block text-sm font-medium text-slate-700 mb-2">
                  Number of Equipment to Add Manually
                </label>
                <input
                  type="number"
                  id="equipmentCount"
                  min="1"
                  max="100"
                  value={equipmentCount}
                  onChange={(e) => setEquipmentCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter number of equipment"
                />
              </div>
              <button
                onClick={generateEquipmentTable}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Generate Table
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-slate-300"></div>
              <span className="text-slate-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-300"></div>
            </div>

            {/* Excel Import Option */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">Import from Excel</h3>
              <p className="text-slate-500 mb-4">Upload an Excel file to automatically populate the equipment table</p>
              
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium cursor-pointer">
                <Upload className="w-5 h-5" />
                Import Excel File
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={importFromExcel}
                  className="hidden"
                />
              </label>
              
              <div className="mt-4 text-xs text-slate-500">
                <p>Supported columns: PO No, Purchase Year, Equipment Name, DRS Input, Quantity, Unit Rate, Cost, Remarks</p>
                <p>Excel data will override calculated values where provided</p>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Table */}
        {isTableGenerated && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">Equipment Details</h2>
                  <p className="text-slate-600">{equipment.length} equipment items • Total Cost: ₹{totalCost.toFixed(2)}</p>
                </div>
                <div className="flex gap-3">
                  <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import Excel
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={importFromExcel}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={addEquipmentRow}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Row
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 transition-all duration-200 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                  <button
                    onClick={submitResponse}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setIsTableGenerated(false);
                      setEquipment([]);
                      setIsSubmitted(false);
                      setManuallyChangedYears(new Set());
                      setImportStatus('');
                    }}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 focus:ring-2 focus:ring-slate-500 transition-all duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-700 border-b border-slate-200 w-12">Sr</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-700 border-b border-slate-200 w-32">PO No & Date</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-700 border-b border-slate-200 w-20">Year</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-700 border-b border-slate-200 w-40">Equipment Name</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-700 border-b border-slate-200 w-20">DSR Input</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-700 border-b border-slate-200 w-44">DSR No</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-700 border-b border-slate-200 w-16">Qty</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-700 border-b border-slate-200 w-20">Rate (₹)</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-700 border-b border-slate-200 w-24">Cost (₹)</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-700 border-b border-slate-200 w-32">Remarks</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-700 border-b border-slate-200 w-16">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-2 py-3 text-xs text-slate-700 border-b border-slate-100">
                        {index + 1}
                      </td>
                      <td className="px-2 py-3 border-b border-slate-100">
                        <input
                          type="text"
                          value={item.poNoAndDate}
                          onChange={(e) => updateEquipment(item.id, 'poNoAndDate', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index, 'poNoAndDate')}
                          data-row={index}
                          data-field="poNoAndDate"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="PO No & Date"
                        />
                      </td>
                      <td className="px-2 py-3 border-b border-slate-100">
                        <input
                          type="text"
                          value={item.purchaseYear}
                          onChange={(e) => updateEquipment(item.id, 'purchaseYear', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index, 'purchaseYear')}
                          data-row={index}
                          data-field="purchaseYear"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="2024-25"
                        />
                      </td>
                      <td className="px-2 py-3 border-b border-slate-100">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateEquipment(item.id, 'name', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index, 'name')}
                          data-row={index}
                          data-field="name"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Equipment name"
                        />
                      </td>
                      <td className="px-2 py-3 border-b border-slate-100">
                        <input
                          type="text"
                          value={item.drsUserInput}
                          onChange={(e) => updateEquipment(item.id, 'drsUserInput', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index, 'drsUserInput')}
                          data-row={index}
                          data-field="drsUserInput"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="EQ1"
                        />
                      </td>
                      <td className="px-2 py-3 text-xs text-slate-700 border-b border-slate-100">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono">
                          {item.drsNo}
                        </span>
                      </td>
                      <td className="px-2 py-3 border-b border-slate-100">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateEquipment(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          onKeyDown={(e) => handleKeyDown(e, index, 'quantity')}
                          data-row={index}
                          data-field="quantity"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-2 py-3 border-b border-slate-100">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitRate}
                          onChange={(e) => updateEquipment(item.id, 'unitRate', parseFloat(e.target.value) || 0)}
                          onKeyDown={(e) => handleKeyDown(e, index, 'unitRate')}
                          data-row={index}
                          data-field="unitRate"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-2 py-3 text-xs font-semibold text-slate-800 border-b border-slate-100">
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                          ₹{item.cost.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-2 py-3 border-b border-slate-100">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateEquipment(item.id, 'remarks', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index, 'remarks')}
                          data-row={index}
                          data-field="remarks"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Remarks"
                        />
                      </td>
                      <td className="px-2 py-3 border-b border-slate-100">
                        <button
                          onClick={() => removeEquipmentRow(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-all duration-200 focus:ring-1 focus:ring-red-500"
                          title="Remove equipment"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Total Cost Row */}
                  {equipment.length > 0 && (
                    <tr className="bg-slate-100 font-semibold">
                      <td colSpan="8" className="px-2 py-3 text-right text-slate-800 border-b border-slate-300 text-sm">
                        <span>Total Cost:</span>
                      </td>
                      <td className="px-2 py-3 text-slate-800 border-b border-slate-300">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-bold">
                          ₹{totalCost.toFixed(2)}
                        </span>
                      </td>
                      <td colSpan="2" className="px-2 py-3 border-b border-slate-300"></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Action Buttons Footer */}
            {equipment.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Total Equipment:</span> {equipment.length} items
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={submitResponse}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex items-center gap-2 font-medium"
                    >
                      <Send className="w-5 h-5" />
                      Submit Response
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!isTableGenerated && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">How to use:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Manual Entry:</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    Enter number of equipment items
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    Click "Generate Table" to create form
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    Fill in equipment details manually
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Excel Import:</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    Prepare Excel with equipment data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    Click "Import Excel File" to auto-populate
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    Excel data overrides calculated values
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-xs text-blue-800">
                <span className="font-medium">Note:</span> DSR numbers auto-generate as PCCOER/COMP/[Year]/[Input]. 
                Cost auto-calculates from quantity × rate unless provided in Excel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default deadreport;
