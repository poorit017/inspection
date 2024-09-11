import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
    let connection1, connection2, connection3;
    try {
        connection1 = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gap2566(group)'
        });

        const [rows1] = await connection1.execute(`
            SELECT 
                total_passed_groups,
                total_passed_members,
                total_passed_plots,
                total_passed_acres
            FROM (
                SELECT 
                    SUM(passed_members_per_group) AS total_passed_members
                FROM (
                    SELECT 
                        COUNT(DISTINCT CASE WHEN pm.Plot_inspection_result = 'ผ่าน' AND g.Summary = 'ผ่าน' THEN pm.Member_id ELSE NULL END) AS passed_members_per_group
                    FROM 
                        plotmember pm
                    JOIN 
                        \`group\` g  
                    ON 
                        pm.Group_id = g.Group_id
                    GROUP BY 
                        g.Group_id
                ) AS group_summary
            ) AS passed_members_summary,

            (
                SELECT 
                    COUNT(DISTINCT CASE WHEN g.Summary = 'ผ่าน' THEN g.Group_id ELSE NULL END) AS total_passed_groups
                FROM 
                    \`group\` g
            ) AS passed_groups_summary,

            (
                SELECT 
                    COUNT(CASE WHEN pm.Plot_inspection_result = 'ผ่าน' AND g.Summary = 'ผ่าน' THEN pm.Plot_id ELSE NULL END) AS total_passed_plots
                FROM 
                    plotmember pm
                JOIN 
                    \`group\` g  
                ON 
                    pm.Group_id = g.Group_id
            ) AS passed_plots_summary,

            (
                SELECT 
                    SUM(CASE WHEN pm.Plot_inspection_result = 'ผ่าน' AND g.Summary = 'ผ่าน' THEN pm.Planted_area ELSE 0 END) AS total_passed_acres
                FROM 
                    plotmember pm
                JOIN 
                    \`group\` g  
                ON 
                    pm.Group_id = g.Group_id
            ) AS passed_acres_summary;
        `);

        // Connect to the second database
        connection2 = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gaporg' // Second database
        });

        const [rows2] = await connection2.execute(`
             WITH GroupAggregates AS (
                SELECT
                    COUNT(DISTINCT CASE WHEN g.certification_code != '-' THEN g.group_id ELSE NULL END) AS passed_group,
                    COUNT(DISTINCT CASE WHEN p.ics_result = 'ผ่าน' AND g.certification_code != '-' THEN p.member ELSE NULL END) AS passed_members,
                    COUNT(CASE WHEN p.ics_result = 'ผ่าน' AND g.certification_code != '-' THEN p.plot ELSE NULL END) AS passed_plots,
                    SUM(CASE WHEN p.ics_result = 'ผ่าน' AND g.certification_code != '-' THEN p.evaluation_passed ELSE 0 END) AS passed_acres
                FROM 
                    plotinfo p
                JOIN 
                    groupinfo g 
                ON 
                    p.group_id = g.group_id
                GROUP BY 
                    g.group_id
            )
            SELECT
                SUM(passed_group) AS total_passed_groups,
                SUM(passed_members) AS total_passed_members,
                SUM(passed_plots) AS total_passed_plots,
                SUM(passed_acres) AS total_passed_acres
            FROM GroupAggregates;
        `);

        // Connect to the third database
        connection3 = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gapseed' // Third database
        });

        const [rows3] = await connection3.execute(`
            WITH AggregatedData AS (
                SELECT
                    COUNT(DISTINCT CASE WHEN g.certification_code != 'ไม่ผ่าน' THEN g.group_id ELSE NULL END) AS passed_group,
                    COUNT(CASE WHEN p.summary = 'ผ่าน' AND g.certification_code != 'ไม่ผ่าน' THEN p.plot ELSE NULL END) AS passed_plots,
                    SUM(CASE WHEN p.summary = 'ผ่าน' AND g.certification_code != 'ไม่ผ่าน' THEN p.area ELSE 0 END) AS passed_acres
                FROM 
                    plot_info p
                JOIN 
                    group_info g 
                ON 
                    p.group_id = g.group_id
            ),
            GroupAggregates AS (
                SELECT
                    COUNT(DISTINCT CASE WHEN p.summary = 'ผ่าน' AND g.certification_code != 'ไม่ผ่าน' THEN p.member ELSE NULL END) AS passed_members_per_group
                FROM 
                    plot_info p
                JOIN 
                    group_info g 
                ON 
                    p.group_id = g.group_id
                GROUP BY 
                    g.group_id
            )

            SELECT
                (SELECT SUM(passed_group) FROM AggregatedData) AS total_passed_groups,
                (SELECT SUM(passed_members_per_group) FROM GroupAggregates) AS total_passed_members,
                (SELECT SUM(passed_plots) FROM AggregatedData) AS total_passed_plots,
                (SELECT SUM(passed_acres) FROM AggregatedData) AS total_passed_acres;
        `);

        // Close the database connections
        await connection1.end();
        await connection2.end();
        await connection3.end();

        // Combine the results from all three queries into a single response
        return NextResponse.json({
            gap2566_group_results: rows1[0],
            gaporg_results: rows2[0],
            gapseed_results: rows3[0]
        });
    } catch (error) {
        console.error('Database connection or query error:', error);
        if (connection1) await connection1.end();
        if (connection2) await connection2.end();
        if (connection3) await connection3.end();
        return NextResponse.error();
    }
}
