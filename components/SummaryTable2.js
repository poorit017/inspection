"use client";

import React, { useEffect, useState } from "react";
import "./SummaryTable1.css";

const SummaryTable2 = () => {
    const [data, setData] = useState({
        gap2566_results: {},
        org2566_results: {},
        gapseed2566_results: {},
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/testapi");
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const result = await response.json();

                // เนื่องจากข้อมูลอยู่ใน array ให้ดึง item แรกออกมาใช้
                setData({
                    gap2566_results: result.gap2566_results[0] || {},
                    org2566_results: result.org2566_results[0] || {},
                    gapseed2566_results: result.gapseed2566_results[0] || {},
                });
            } catch (error) {
                console.error("Error fetching summary data:", error);
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
                <div className="header">ปีงบประมาณ 2566 test api tidb</div>
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
                            <td className="cell">{formatNumber(data.gap2566_results.total_passed_groups)}</td>
                            <td className="cell">{formatNumber(data.gap2566_results.total_passed_members)}</td>
                            <td className="cell">{formatNumber(data.gap2566_results.total_passed_plots)}</td>
                            <td className="cell">{formatNumber(data.gap2566_results.total_passed_acres, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <th className="rowHeader">ORG</th>
                            <td className="cell">{formatNumber(data.org2566_results.total_passed_groups)}</td>
                            <td className="cell">{formatNumber(data.org2566_results.total_passed_members)}</td>
                            <td className="cell">{formatNumber(data.org2566_results.total_passed_plots)}</td>
                            <td className="cell">{formatNumber(data.org2566_results.total_passed_acres, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <th className="rowHeader">SEED</th>
                            <td className="cell">{formatNumber(data.gapseed2566_results.total_passed_groups)}</td>
                            <td className="cell">{formatNumber(data.gapseed2566_results.total_passed_members)}</td>
                            <td className="cell">{formatNumber(data.gapseed2566_results.total_passed_plots)}</td>
                            <td className="cell">{formatNumber(data.gapseed2566_results.total_passed_acres, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
                            <th className="rowHeader">ข้าวพันธุ์แท้</th>
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

export default SummaryTable2;
