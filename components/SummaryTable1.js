"use client";

import React, { useEffect, useState } from 'react';
import './SummaryTable1.css'; // Import the CSS file

const SummaryTable1 = () => {
    const [data, setData] = useState({
        gap2566_group_results: {
            total_passed_groups: 0,
            total_passed_members: 0,
            total_passed_plots: 0,
            total_passed_acres: 0,
        },
        gaporg_results: {
            total_passed_groups: 0,
            total_passed_members: 0,
            total_passed_plots: 0,
            total_passed_acres: 0,
        },
        gapseed_results: {
            total_passed_groups: 0,
            total_passed_members: 0,
            total_passed_plots: 0,
            total_passed_acres: 0,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/summary');
                const result = await response.json();
                setData({
                    gap2566_group_results: result.gap2566_group_results,
                    gaporg_results: result.gaporg_results,
                    gapseed_results: result.gapseed_results,
                });
            } catch (error) {
                console.error('Error fetching summary data:', error);
            }
        };

        fetchData();
    }, []);

    const formatNumber = (number, options = { minimumFractionDigits: 0, maximumFractionDigits: 0 }) => {
        return parseFloat(number).toLocaleString(undefined, options);
    };
    
    
    return (
        <div className="container">
            <h3>
                <div className="header">ปีงบประมาณ 2566</div>
            </h3>
            <div className="col-md-12">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="headerCell">มาตรฐาน</th>
                            <th className="headerCell">กลุ่ม</th>
                            <th className="headerCell">ราย</th>
                            <th className="headerCell">แปลง</th>
                            <th className="headerCell">ไร่</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th className="rowHeader">GAP</th>
                            <td className="cell">{formatNumber(data.gap2566_group_results.total_passed_groups)}</td>
                            <td className="cell">{formatNumber(data.gap2566_group_results.total_passed_members)}</td>
                            <td className="cell">{formatNumber(data.gap2566_group_results.total_passed_plots)}</td>
                            <td className="cell">{formatNumber(data.gap2566_group_results.total_passed_acres, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <th className="rowHeader">ORG</th>
                            <td className="cell">{formatNumber(data.gaporg_results.total_passed_groups)}</td>
                            <td className="cell">{formatNumber(data.gaporg_results.total_passed_members)}</td>
                            <td className="cell">{formatNumber(data.gaporg_results.total_passed_plots)}</td>
                            <td className="cell">{formatNumber(data.gaporg_results.total_passed_acres, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <th className="rowHeader">SEED</th>
                            <td className="cell">{formatNumber(data.gapseed_results.total_passed_groups)}</td>
                            <td className="cell">{formatNumber(data.gapseed_results.total_passed_members)}</td>
                            <td className="cell">{formatNumber(data.gapseed_results.total_passed_plots)}</td>
                            <td className="cell">{formatNumber(data.gapseed_results.total_passed_acres, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <th className="rowHeader">GMP</th>
                            <td className="cell">0</td>
                            <td className="cell">0</td>
                            <td className="cell">0</td>
                            <td className="cell">0.00</td>
                        </tr>
                        <tr>
                            <th className="rowHeader">Q</th>
                            <td className="cell">0</td>
                            <td className="cell">0</td>
                            <td className="cell">0</td>
                            <td className="cell">0.00</td>
                        </tr>
                        <tr>
                            <th className="rowHeader">ข้าวพันธ์ุแท้</th>
                            <td className="cell">0</td>
                            <td className="cell">0</td>
                            <td className="cell">0</td>
                            <td className="cell">0.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SummaryTable1;
