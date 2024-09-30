import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'gapseed',
    });

    const [rows] = await connection.execute(`
      SELECT 
        g.group_id,
        g.group_name, 
        g.district, 
        g.province, 
        MAX(p.member) AS max_member_id,
        g.certification_code,
        g.Certification_file
      FROM 
        \`group_info\` g
      LEFT JOIN 
        \`plot_info\` p ON g.group_id = p.group_id  
      GROUP BY 
        g.group_id,
        g.group_name,   
        g.district, 
        g.province
    `);
    
    

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database connection or query error:', error);
    return NextResponse.error();
  }
}
