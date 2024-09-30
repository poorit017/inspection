import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'gap2566(group)'
    });

    const [rows] = await connection.execute(`
      SELECT 
      g.Group_id,
      g.Group_name, 
      g.Group_district, 
      g.Group_province, 
      MAX(p.Member_id) AS max_member_id,
      g.Summary,
      Certification_code1,
      Certification_code2,
      g.Certification_file 
    FROM 
      \`group\` g
    LEFT JOIN 
      \`plotmember\` p ON g.Group_id = p.Group_id
    GROUP BY 
      g.Group_id,
      g.Group_name, 
      g.Group_district, 
      g.Group_province;
    
    `);

    await connection.end();
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database connection or query error:', error);
    return NextResponse.error();
  }
}
