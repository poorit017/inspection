// app/api/groups/[id]/route.js

import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'gapseed',
    });

    // Fetch group info based on group_id
    const [groupInfo] = await connection.execute(`
      SELECT 
        group_id, 
        group_name, 
        group_no, 
        moo, 
        sub_district 
        district, 
        province, 
        titie,
        first_name, 
        last_name, 
        phone,
        Certification_file
      FROM 
        group_info 
      WHERE 
        group_id = ?
    `, [id]);

    // Fetch plot info based on group_id
    const [plotInfo] = await connection.execute(`
      SELECT 
        idplot, 
        group_id, 
        member, 
        plot, 
        title, 
        first_name, 
        last_name, 
        area, 
        rice_variety, 
        seed_class, 
        ics_evaluation_result, 
        summary, 
        note 
      FROM 
        plot_info 
      WHERE 
        group_id = ?
    `, [id]);

    await connection.end();

    return NextResponse.json({
      group: groupInfo[0] || null,
      plotinfo: plotInfo,
    });
  } catch (error) {
    console.error('Database connection or query error:', error);
    return NextResponse.error();
  }
}
