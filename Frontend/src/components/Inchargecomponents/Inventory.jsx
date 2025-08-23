import React, { useEffect, useState } from "react";

export default function Inventory() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const staffId = localStorage.getItem("staffId"); // from your login

  // Map DB status → readable label
  const mapStatus = (dbStatus) => {
    const s = String(dbStatus ?? "");
    if (s === "0") return "active";
    if (s === "1") return "maintenance";
    if (s === "2") return "damaged";
    return "active";
  };

  // Fetch all equipment for this staff's lab
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/labs/equipment/by-staff/${staffId}`);
      if (!res.ok) throw new Error("Failed to fetch equipment");
      const data = await res.json();
      setEquipmentData(
        (data.items || []).map((item) => ({
          id: item.equipment_id,
          name: item.equipment_name,
          code: item.equipment_code,
          type: item.equipment_type,
          status: mapStatus(item.equipment_status),
          password: item.equipment_password,
          description: item.equipment_description,
        }))
      );
    } catch (err) {
      console.error(err);
      alert("Error loading equipment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffId) fetchEquipment();
  }, [staffId]);

  // Save equipment update
  const handleSaveEdit = async () => {
    if (!selectedItem) return;
    try {
      const updateData = {
        equipment_name: selectedItem.name,
        equipment_code: selectedItem.code,
        equipment_status:
          selectedItem.status === "active"
            ? "0"
            : selectedItem.status === "maintenance"
            ? "1"
            : "2",
        equipment_password: selectedItem.password || null,
        equipment_description: selectedItem.description || null,
      };

      const res = await fetch(
        `/api/labs/equipment/${staffId}/${selectedItem.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      await fetchEquipment(); // reload list
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error saving equipment");
    }
  };

  // Delete equipment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?"))
      return;
    try {
      const res = await fetch(`/api/labs/equipment/${staffId}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setEquipmentData((prev) => prev.filter((item) => item.id !== id));
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error deleting equipment");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Equipment Inventory</h1>
      {equipmentData.length === 0 ? (
        <p>No equipment found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Type</th>
              <th>Status</th>
              <th>Password</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipmentData.map((eq) => (
              <tr key={eq.id}>
                <td>{eq.name}</td>
                <td>{eq.code}</td>
                <td>{eq.type}</td>
                <td>{eq.status}</td>
                <td>{eq.password}</td>
                <td>{eq.description}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedItem(eq);
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(eq.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && selectedItem && (
        <div className="modal">
          <h2>Edit Equipment</h2>
          <label>
            Name:
            <input
              value={selectedItem.name}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, name: e.target.value })
              }
            />
          </label>
          <label>
            Code:
            <input
              value={selectedItem.code}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, code: e.target.value })
              }
            />
          </label>
          <label>
            Status:
            <select
              value={selectedItem.status}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="damaged">Damaged</option>
            </select>
          </label>
          <label>
            Password:
            <input
              value={selectedItem.password || ""}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, password: e.target.value })
              }
            />
          </label>
          <label>
            Description:
            <textarea
              value={selectedItem.description || ""}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  description: e.target.value,
                })
              }
            />
          </label>
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={() => handleDelete(selectedItem.id)}>Delete</button>
          <button onClick={() => setModalOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
