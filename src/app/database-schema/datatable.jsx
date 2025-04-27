import React, { useState, useMemo } from "react";

// Sample Data with Nested Notes
const data = [
    {
        id: 1,
        name: "Users",
        aiNotes: "AI-generated summary here...",
        manualNotes: "User-added notes...",
        subRows: [
            { id: 101, name: "Column 1", aiNotes: "AI Note 1", manualNotes: "Manual Note 1" },
            { id: 102, name: "Column 2", aiNotes: "AI Note 2", manualNotes: "Manual Note 2" },
        ],
    },
    {
        id: 2,
        name: "Orders",
        aiNotes: "Another AI-generated summary...",
        manualNotes: "Another user note...",
        subRows: [
            { id: 201, name: "Column 1", aiNotes: "AI Note A", manualNotes: "Manual Note A" },
            { id: 202, name: "Column 2", aiNotes: "AI Note B", manualNotes: "Manual Note B" },
        ],
    },
];

const NestedDataTable = () => {
    const [expandedRows, setExpandedRows] = useState(() =>
        data.reduce((acc, row) => ({ ...acc, [row.id]: true }), {})
    );

    const [selectedRows, setSelectedRows] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [editingSubRow, setEditingSubRow] = useState(null);
    const [notes, setNotes] = useState(() =>
        data.reduce((acc, row) => ({
            ...acc,
            [row.id]: { aiNotes: row.aiNotes, manualNotes: row.manualNotes },
        }), {})
    );

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const toggleRow = (id) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleRowSelect = (id) => {
        setSelectedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        const newSelectedRows = {};
        if (newSelectAll) {
            data.forEach((row) => newSelectedRows[row.id] = true);
        }
        setSelectedRows(newSelectedRows);
    };

    const handleSelectAllSubRows = (rowId, checked) => {
        const newSelectedRows = { ...selectedRows };
        data.forEach((row) => {
            if (row.id === rowId) {
                row.subRows.forEach((subRow) => {
                    newSelectedRows[subRow.id] = checked;
                });
            }
        });
        setSelectedRows(newSelectedRows);
    };

    const handleEditClick = (id) => {
        setEditingRow(id);
    };

    const handleEditSubRowClick = (subRowId) => {
        setEditingSubRow(subRowId);
    };

    const handleNotesChange = (id, field, newText) => {
        setNotes((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: newText,
            },
        }));
    };

    const handleSave = (id) => {
        setEditingRow(null);
    };

    const handleSubRowSave = () => {
        setEditingSubRow(null);
    };

    const renderToggleIcon = (expanded) => {
        if (expanded) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    id="Capa_1"
                    width="14"
                    height="14"
                    x="0"
                    y="0"
                    version="1.1"
                    viewBox="0 0 121.805 121.804"
                >
                    <path d="M7.308 68.211h107.188a7.31 7.31 0 0 0 7.309-7.31 7.31 7.31 0 0 0-7.309-7.309H7.308a7.31 7.31 0 0 0 0 14.619"></path>
                </svg>
            );
        } else {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
            );
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null && sortConfig.key !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    return (
        <div style={{ width: "100%" }}>
            <div className="bg-white p-8 px-0 flex justify-between">
                <h1 className="text-2xl font-bold text-[#f58533]">Tables & Meta Data</h1>
                <div style={{
                    border: '1px solid #f58533',
                    color: '#f58533',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: "flex",
                    alignContent: "center"
                }}>
                    AI Generated Text
                </div>
            </div>

            {/* Main Table Structure */}
            <table className="border border-gray-200" style={{ width: "100%", borderCollapse: "collapse", borderRadius: "10px", overflow: "hidden", display: "block" }}>
                <thead>
                    <tr style={{ background: "#fff", borderBottom: "2px solid #ebe6e7", textAlign: "left", fontWeight: "normal" }}>
                        <th style={{ width: "80px", padding: "16px", textAlign: "right" }}>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                style={{ transform: "scale(1.3)", cursor: "pointer" }}
                            />
                        </th>
                        <th style={{ padding: "16px", fontWeight: "500", cursor: 'pointer' }} onClick={() => requestSort('name')}>
                            Table Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                        </th>
                        <th style={{ padding: "16px", fontWeight: "500" }}>AI Notes</th>
                        <th style={{ padding: "16px", fontWeight: "500" }}>Manual Notes</th>
                        <th style={{ width: "150px", padding: "16px", fontWeight: "500" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row) => (
                        <React.Fragment key={row.id}>
                            {/* Main Row */}
                            <tr style={{ borderTop: "1px solid #ebe6e7", textAlign: "left", fontWeight: "500" }}>
                                <td style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                                    <button
                                        className="cursor-pointer plus-minus-icon"
                                        onClick={() => toggleRow(row.id)}
                                        style={{
                                            cursor: "pointer",
                                            background: "rgb(244, 244, 244)",
                                            border: "none",
                                            fontSize: "16px",
                                            padding: "6px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            borderRadius: "50%",
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = "#f58533";
                                            e.currentTarget.querySelector('svg path').style.fill = "#fff";
                                            e.currentTarget.querySelector('svg').style.fill = "#fff";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = "rgb(244, 244, 244)";
                                            e.currentTarget.querySelector('svg path').style.fill = "";
                                            e.currentTarget.querySelector('svg').style.fill = "";
                                        }}
                                    >
                                        {renderToggleIcon(expandedRows[row.id])}
                                    </button>
                                    <input
                                        type="checkbox"
                                        checked={!!selectedRows[row.id]}
                                        onChange={() => handleRowSelect(row.id)}
                                        style={{ transform: "scale(1.3)", cursor: "pointer" }}
                                    />
                                </td>
                                <td style={{ padding: "16px", verticalAlign: "middle" }}>{row.name}</td>
                                <td style={{ padding: "16px", verticalAlign: "middle" }}>
                                    {editingRow === row.id ? (
                                        <textarea
                                            value={notes[row.id].aiNotes}
                                            onChange={(e) => handleNotesChange(row.id, "aiNotes", e.target.value)}
                                            style={{
                                                width: "100%",
                                                height: "60px",
                                                border: "1px solid",
                                                borderColor: editingRow === row.id ? "#ececec" : "transparent",
                                                outline: "none",
                                                padding: "12px",
                                                borderRadius: "10px",
                                                resize: "none",
                                            }}
                                        />
                                    ) : (
                                        notes[row.id].aiNotes
                                    )}
                                </td>
                                <td style={{ padding: "16px", verticalAlign: "middle" }}>
                                    {editingRow === row.id ? (
                                        <textarea
                                            value={notes[row.id].manualNotes}
                                            onChange={(e) => handleNotesChange(row.id, "manualNotes", e.target.value)}
                                            style={{
                                                width: "100%",
                                                height: "60px",
                                                border: "1px solid",
                                                borderColor: editingRow === row.id ? "#ececec" : "transparent",
                                                outline: "none",
                                                padding: "12px",
                                                borderRadius: "10px",
                                                resize: "none",
                                            }}
                                        />
                                    ) : (
                                        notes[row.id].manualNotes
                                    )}
                                </td>
                                <td style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px", verticalAlign: "middle" }}>
                                    {editingRow === row.id ? (
                                        <button className="cursor-pointer" onClick={() => handleSave(row.id)}
                                            style={{
                                                padding: "8px 16px",
                                                backgroundColor: "transparent",
                                                border: "1px solid #f58533",
                                                color: "#f58533",
                                                borderRadius: "4px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                textTransform: "uppercase",
                                                cursor: "pointer",
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.backgroundColor = '#f58533';
                                                e.target.style.color = '#fff';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = '#f58533';
                                            }}
                                        >Save</button>
                                    ) : (
                                        <button className="cursor-pointer" onClick={() => handleEditClick(row.id)} style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            backgroundColor: "#f4f4f4",
                                            borderRadius: "50%",
                                            padding: "6px",
                                            border: "none",
                                        }}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlSpace="preserve"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                className="edit-button"
                                            >
                                                <path
                                                    fill="#f58533"
                                                    d="m14.46 3.26.88-.88c1.04-1.04 2.85-1.04 3.89 0l.71.71a2.73 2.73 0 0 1 0 3.88l-.88.88-4.6-4.6zM13.4 4.32l-9.11 9.11c-.29.29-.47.67-.5 1.08l-.27 2.93c-.03.37.1.73.36 1 .24.24.55.37.88.37h.11l2.93-.27c.41-.04.79-.22 1.08-.51l9.11-9.11-4.6-4.6zM22.75 22c0-.41-.34-.75-.75-.75H2c-.41 0-.75.34-.75.75s.34.75.75h20c.41 0 .75-.34.75-.75"
                                                    data-original="#000000"
                                                ></path>
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            </tr>

                            {/* Nested Table */}
                            {expandedRows[row.id] && row.subRows && row.subRows.length > 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: "16px", paddingLeft: "50px" }}>
                                        <table className="border border-gray-200" style={{ width: "100%", borderCollapse: "collapse", borderRadius: "50px" }}>
                                            <thead>
                                                <tr style={{ background: "#f4f3ee", borderBottom: "1px solid #ebe6e7", textAlign: "left", fontWeight: "normal" }}>
                                                    <th style={{ width: "50px", padding: "16px" }}>
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => handleSelectAllSubRows(row.id, e.target.checked)}
                                                            checked={row.subRows.every((sub) => selectedRows[sub.id])}
                                                            style={{ transform: "scale(1.3)", cursor: "pointer" }}
                                                        />
                                                    </th>
                                                    <th style={{ padding: "16px", fontWeight: "500" }}>Select columns</th>
                                                    <th style={{ padding: "16px", fontWeight: "500" }}></th>
                                                    <th style={{ padding: "16px", fontWeight: "500" }}></th>
                                                    <th style={{ width: "150px", padding: "16px", fontWeight: "500" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {row.subRows.map((sub) => (
                                                    <tr key={sub.id} style={{ borderBottom: "1px solid #ebe6e7", textAlign: "left" }}>
                                                        <td style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selectedRows[sub.id]}
                                                                onChange={() => {
                                                                    setSelectedRows((prev) => ({
                                                                        ...prev,
                                                                        [sub.id]: !prev[sub.id],
                                                                    }));
                                                                }}
                                                                style={{ transform: "scale(1.3)", cursor: "pointer" }}
                                                            />
                                                        </td>
                                                        <td style={{ padding: "16px" }}>
                                                            {editingSubRow === sub.id ? (
                                                                <input
                                                                    value={sub.name}
                                                                    onChange={(e) => {
                                                                        sub.name = e.target.value;
                                                                    }}
                                                                />
                                                            ) : (
                                                                sub.name
                                                            )}
                                                        </td>
                                                        <td style={{ padding: "16px", color: "#6b6b6b" }}>
                                                            {editingSubRow === sub.id ? (
                                                                <textarea
                                                                    value={sub.aiNotes}
                                                                    onChange={(e) => {
                                                                        sub.aiNotes = e.target.value;
                                                                    }}
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "60px",
                                                                        border: "1px solid",
                                                                        borderColor: editingSubRow === sub.id ? "#ececec" : "transparent",
                                                                        outline: "none",
                                                                        padding: "12px",
                                                                        borderRadius: "10px",
                                                                        resize: "none",
                                                                    }}
                                                                />
                                                            ) : (
                                                                sub.aiNotes
                                                            )}
                                                        </td>
                                                        <td style={{ padding: "16px", color: "#6b6b6b" }}>
                                                            {editingSubRow === sub.id ? (
                                                                <textarea
                                                                    value={sub.manualNotes}
                                                                    onChange={(e) => {
                                                                        sub.manualNotes = e.target.value;
                                                                    }}
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "60px",
                                                                        border: "1px solid",
                                                                        borderColor: editingSubRow === sub.id ? "#ececec" : "transparent",
                                                                        outline: "none",
                                                                        padding: "12px",
                                                                        borderRadius: "10px",
                                                                        resize: "none",
                                                                    }}
                                                                />
                                                            ) : (
                                                                sub.manualNotes
                                                            )}
                                                        </td>
                                                        <td style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                                                            {editingSubRow === sub.id ? (
                                                                <button className="cursor-pointer" onClick={handleSubRowSave}
                                                                    style={{
                                                                        padding: "8px 16px",
                                                                        backgroundColor: "transparent",
                                                                        border: "1px solid #f58533",
                                                                        color: "#f58533",
                                                                        borderRadius: "4px",
                                                                        fontSize: "14px",
                                                                        fontWeight: "500",
                                                                        textTransform: "uppercase",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onMouseOver={(e) => {
                                                                        e.target.style.backgroundColor = '#f58533';
                                                                        e.target.style.color = '#fff';
                                                                    }}
                                                                    onMouseOut={(e) => {
                                                                        e.target.style.backgroundColor = 'transparent';
                                                                        e.target.style.color = '#f58533';
                                                                    }}
                                                                >Save</button>
                                                            ) : (
                                                                <button className="cursor-pointer" onClick={() => handleEditSubRowClick(sub.id)} style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "8px",
                                                                    backgroundColor: "#f4f4f4",
                                                                    borderRadius: "50%",
                                                                    padding: "6px",
                                                                    border: "none",
                                                                }}>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        xmlSpace="preserve"
                                                                        width="18"
                                                                        height="18"
                                                                        viewBox="0 0 24 24"
                                                                        className="edit-button"
                                                                    >
                                                                        <path
                                                                            fill="#f58533"
                                                                            d="m14.46 3.26.88-.88c1.04-1.04 2.85-1.04 3.89 0l.71.71a2.73 2.73 0 0 1 0 3.88l-.88.88-4.6-4.6zM13.4 4.32l-9.11 9.11c-.29.29-.47.67-.5 1.08l-.27 2.93c-.03.37.1.73.36 1 .24.24.55.37.88.37h.11l2.93-.27c.41-.04.79-.22 1.08-.51l9.11-9.11-4.6-4.6zM22.75 22c0-.41-.34-.75-.75-.75H2c-.41 0-.75.34-.75.75s.34.75.75h20c.41 0 .75-.34.75-.75"
                                                                            data-original="#000000"
                                                                        ></path>
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NestedDataTable;