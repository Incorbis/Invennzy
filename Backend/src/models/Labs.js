const { pool } = require('../server');

class Lab {
  static async findAll() {
    try {
      const result = await pool.query(`
        SELECT 
          l.*,
          json_build_object(
            'monitors', e.monitors,
            'projectors', e.projectors,
            'switch_boards', e.switch_boards,
            'fans', e.fans,
            'wifi', e.wifi
          ) as equipment,
          json_build_object(
            'incharge_name', s.incharge_name,
            'incharge_email', s.incharge_email,
            'incharge_phone', s.incharge_phone,
            'assistant_name', s.assistant_name,
            'assistant_email', s.assistant_email,
            'assistant_phone', s.assistant_phone
          ) as staff
        FROM labs l
        LEFT JOIN equipment e ON l.id = e.lab_id
        LEFT JOIN staff s ON l.id = s.lab_id
        ORDER BY l.lab_no
      `);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(`
        SELECT 
          l.*,
          json_build_object(
            'monitors', e.monitors,
            'projectors', e.projectors,
            'switch_boards', e.switch_boards,
            'fans', e.fans,
            'wifi', e.wifi
          ) as equipment,
          json_build_object(
            'incharge_name', s.incharge_name,
            'incharge_email', s.incharge_email,
            'incharge_phone', s.incharge_phone,
            'assistant_name', s.assistant_name,
            'assistant_email', s.assistant_email,
            'assistant_phone', s.assistant_phone
          ) as staff
        FROM labs l
        LEFT JOIN equipment e ON l.id = e.lab_id
        LEFT JOIN staff s ON l.id = s.lab_id
        WHERE l.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(labData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert lab
      const labResult = await client.query(`
        INSERT INTO labs (lab_no, lab_name, building, floor, capacity, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        labData.labNo,
        labData.labName,
        labData.building,
        labData.floor,
        labData.capacity,
        labData.status
      ]);

      const labId = labResult.rows[0].id;

      // Insert equipment
      await client.query(`
        INSERT INTO equipment (lab_id, monitors, projectors, switch_boards, fans, wifi)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        labId,
        labData.monitors,
        labData.projectors,
        labData.switchBoards,
        labData.fans,
        labData.wifi
      ]);

      // Insert staff
      await client.query(`
        INSERT INTO staff (lab_id, incharge_name, incharge_email, incharge_phone, 
                          assistant_name, assistant_email, assistant_phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        labId,
        labData.inchargeName,
        labData.inchargeEmail,
        labData.inchargePhone,
        labData.assistantName,
        labData.assistantEmail,
        labData.assistantPhone
      ]);

      await client.query('COMMIT');
      return labResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id, labData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update lab
      await client.query(`
        UPDATE labs 
        SET lab_no = $1, lab_name = $2, building = $3, floor = $4, 
            capacity = $5, status = $6, last_updated = CURRENT_TIMESTAMP
        WHERE id = $7
      `, [
        labData.labNo,
        labData.labName,
        labData.building,
        labData.floor,
        labData.capacity,
        labData.status,
        id
      ]);

      // Update equipment
      await client.query(`
        UPDATE equipment 
        SET monitors = $1, projectors = $2, switch_boards = $3, fans = $4, wifi = $5
        WHERE lab_id = $6
      `, [
        labData.monitors,
        labData.projectors,
        labData.switchBoards,
        labData.fans,
        labData.wifi,
        id
      ]);

      // Update staff
      await client.query(`
        UPDATE staff 
        SET incharge_name = $1, incharge_email = $2, incharge_phone = $3,
            assistant_name = $4, assistant_email = $5, assistant_phone = $6
        WHERE lab_id = $7
      `, [
        labData.inchargeName,
        labData.inchargeEmail,
        labData.inchargePhone,
        labData.assistantName,
        labData.assistantEmail,
        labData.assistantPhone,
        id
      ]);

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      await client.query('DELETE FROM staff WHERE lab_id = $1', [id]);
      await client.query('DELETE FROM equipment WHERE lab_id = $1', [id]);
      await client.query('DELETE FROM labs WHERE id = $1', [id]);
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Lab;
