import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'gaporg'
    });

    const [groupRows] = await connection.execute(`
      SELECT 
        group_id,
        group_name,
        group_house_number, 
        group_address, 
        group_subdistrict,
        group_district, 
        group_province, 
        group_leader, 
        group_leader_phone
      FROM 
        \`groupinfo\` 
      WHERE 
        group_id = ?
    `, [id]);
    

    const [plotinfoRows] = await connection.execute(`
      SELECT 
        plot_id,
        member,
        plot,
        title,
        member_first_name,
        member_last_name,
        planting_area,
        rice_variety,
        coordinates_x,
        coordinates_y,
        ics_result,
        evaluation_passed,
        evaluation_failed
      FROM 
        \`plotinfo\` 
      WHERE 
        group_id = ?
    `, [id]);

    await connection.end();

    if (groupRows.length === 0) {
      return NextResponse.error({ status: 404, statusText: 'Group not found' });
    }

    return NextResponse.json({ group: groupRows[0], plotinfo: plotinfoRows });
  } catch (error) {
    console.error('Database connection or query error:', error);
    return NextResponse.error();
  }
}
