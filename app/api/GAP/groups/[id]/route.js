import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'gap2566(group)'
    });

    const [groupRows] = await connection.execute(`
      SELECT 
        Group_id,
        Group_name,
        Group_house_number, 
        Group_village, 
        Group_sub_district,
        Group_district, 
        Group_province, 
        Group_postal_code,
        Group_leader, 
        Group_leader_phone,
        Certification_code1,
        Certification_code2,
        Summary,
        Certification_file
      FROM 
        \`group\` 
      WHERE 
        Group_id = ?  
    `, [id]);
    

    const [plotMemberRows] = await connection.execute(`
      SELECT 
        Plotmember_id,
        Member_id,
        Plot_id,
        Title,
        Member_name,
        Member_surname,
        Planted_area,
        Rice_variety,
        Plot_coordinates_x,
        Plot_coordinates_y,
        Plot_inspection_result,
        Failure_reason
      FROM 
        \`plotmember\` 
      WHERE 
        Group_id = ?
    `, [id]);

    await connection.end();

    if (groupRows.length === 0) {
      return NextResponse.error({ status: 404, statusText: 'Group not found' });
    }

    return NextResponse.json({ group: groupRows[0], plotMembers: plotMemberRows });
  } catch (error) {
    console.error('Database connection or query error:', error);
    return NextResponse.error();
  }
}
