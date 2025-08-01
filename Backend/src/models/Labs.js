const db = require('../db'); // should export a mysql2/promise connection or pool

class Lab {
  static async findByAdminId(adminId) {
  const [rows] = await db.query("SELECT * FROM labs WHERE admin_id = ?", [adminId]);
  return rows;
}

  static async findAll() {
    const [rows] = await db.query(`
      SELECT 
        l.*, 
        e.monitors, e.projectors, e.switch_boards, e.fans, e.wifi,
        s.incharge_name, s.incharge_email, s.incharge_phone,
        s.assistant_name, s.assistant_email, s.assistant_phone
      FROM labs l
      LEFT JOIN equipment e ON l.id = e.lab_id
      LEFT JOIN staff s ON l.id = s.lab_id
      ORDER BY l.lab_no
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(`
      SELECT 
        l.*, 
        e.monitors, e.projectors, e.switch_boards, e.fans, e.wifi,
        s.incharge_name, s.incharge_email, s.incharge_phone,
        s.assistant_name, s.assistant_email, s.assistant_phone
      FROM labs l
      LEFT JOIN equipment e ON l.id = e.lab_id
      LEFT JOIN staff s ON l.id = s.lab_id
      WHERE l.id = ?
    `, [id]);
    return rows[0];
  }

static async create(labData) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // ✅ INSERT into labs with admin_id
    const [labResult] = await conn.query(`
      INSERT INTO labs (lab_no, lab_name, building, floor, capacity, status, admin_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      labData.labNo,
      labData.labName,
      labData.building,
      labData.floor,
      labData.capacity,
      labData.status,
      labData.adminId // ✅ Added this
    ]);

    const labId = labResult.insertId;

    // Insert into equipment
    await conn.query(`
      INSERT INTO equipment (lab_id, monitors, projectors, switch_boards, fans, wifi)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      labId,
      labData.monitors,
      labData.projectors,
      labData.switchBoards,
      labData.fans,
      labData.wifi
    ]);

    // Insert into staff
    await conn.query(`
      INSERT INTO staff (lab_id, incharge_name, incharge_email, incharge_phone, 
                        assistant_name, assistant_email, assistant_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      labId,
      labData.inchargeName,
      labData.inchargeEmail,
      labData.inchargePhone,
      labData.assistantName,
      labData.assistantEmail,
      labData.assistantPhone
    ]);

    await conn.commit();
    return { id: labId, ...labData };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

  static async update(id, labData) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(`
        UPDATE labs 
        SET lab_no = ?, lab_name = ?, building = ?, floor = ?, 
            capacity = ?, status = ?, last_updated = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        labData.labNo,
        labData.labName,
        labData.building,
        labData.floor,
        labData.capacity,
        labData.status,
        id
      ]);

      await conn.query(`
        UPDATE equipment 
        SET monitors = ?, projectors = ?, switch_boards = ?, fans = ?, wifi = ?
        WHERE lab_id = ?
      `, [
        labData.monitors,
        labData.projectors,
        labData.switchBoards,
        labData.fans,
        labData.wifi,
        id
      ]);

      await conn.query(`
        UPDATE staff 
        SET incharge_name = ?, incharge_email = ?, incharge_phone = ?,
            assistant_name = ?, assistant_email = ?, assistant_phone = ?
        WHERE lab_id = ?
      `, [
        labData.inchargeName,
        labData.inchargeEmail,
        labData.inchargePhone,
        labData.assistantName,
        labData.assistantEmail,
        labData.assistantPhone,
        id
      ]);

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query('DELETE FROM staff WHERE lab_id = ?', [id]);
      await conn.query('DELETE FROM equipment WHERE lab_id = ?', [id]);
      await conn.query('DELETE FROM labs WHERE id = ?', [id]);

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}

module.exports = Lab;
