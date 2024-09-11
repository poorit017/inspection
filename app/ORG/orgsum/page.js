'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../css/GroupSummary.module.css';

const GroupSummary = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/ORG/orgsums')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setSummaryData(data))
            .catch((error) => setError(error.message));
    }, []);

    // Calculate the totals for each column
    const totalMemberCount = summaryData.reduce((total, group) => total + group.member_count, 0);
    const totalPlots = summaryData.reduce((total, group) => total + group.total_plots, 0);
    const totalAcres = summaryData.reduce((total, group) => total + parseFloat(group.total_acres), 0);
    const totalPassedGroup = summaryData.reduce((total, group) => total + group.passed_group, 0);
    const totalPassedMembers = summaryData.reduce((total, group) => total + group.passed_members, 0);
    const totalPassedPlots = summaryData.reduce((total, group) => total + group.passed_plots, 0);
    const totalPassedAcres = summaryData.reduce((total, group) => total + parseFloat(group.passed_acres), 0);
    const totalFailedGroup = summaryData.reduce((total, group) => total + group.failed_group, 0);
    const totalFailedMembers = summaryData.reduce((total, group) => total + group.failed_members, 0);
    const totalFailedPlots = summaryData.reduce((total, group) => total + group.failed_plots, 0);
    const totalFailedAcres = summaryData.reduce((total, group) => total + parseFloat(group.failed_acres), 0);
    const totalRows = summaryData.length;
    

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>สรุปข้อมูลทะเบียนผู้ที่ได้รับการรับรองมาตรฐานข้าวอินทรีย์</h1>
            {error && <p className={styles.error}>Error: {error}</p>}
            <table className={`${styles.table} table table-bordered`}>
    <thead>
        <tr>
            <th></th>
            <th>กลุ่ม</th>
            <th>ราย</th>
            <th>แปลง</th>
            <th>ไร่</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th className={styles.centered}>เป้าหมาย</th>
            <td className={styles.centered}>{totalRows.toLocaleString()}</td>
            <td className={styles.centered}>{totalMemberCount.toLocaleString()}</td>
            <td className={styles.centered}>{totalPlots.toLocaleString()}</td>
            <td className={styles.centered}>{totalAcres.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr>
            <th className={styles.centered}>ผ่าน</th>
            <td className={styles.centered}>{totalPassedGroup.toLocaleString()}</td>
            <td className={styles.centered}>{totalPassedMembers.toLocaleString()}</td>
            <td className={styles.centered}>{totalPassedPlots.toLocaleString()}</td>
            <td className={styles.centered}>{totalPassedAcres.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr>
            <th className={styles.centered}>ไม่ผ่าน</th>
            <td className={styles.centered}>{totalFailedGroup.toLocaleString()}</td>
            <td className={styles.centered}>{totalFailedMembers.toLocaleString()}</td>
            <td className={styles.centered}>{totalFailedPlots.toLocaleString()}</td>
            <td className={styles.centered}>{totalFailedAcres.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
    </tbody>
</table>    
            <Link href="/">
                <button className={styles.backButton}>กลับไปหน้าแรก</button>
            </Link>
            <table className={`${styles.tableSticky} table table-bordered`}>
                <thead>
                    <tr>
                        <th rowSpan="2" className={styles.centered}>ลำดับ</th>
                        <th rowSpan="2" className={styles.centered}>ชื่อกลุ่ม</th>
                        <th rowSpan="2" className={styles.centered}>อำเภอ</th>
                        <th rowSpan="2" className={styles.centered}>จังหวัด</th>
                        <th colSpan="4" className={styles.centered}>เป้าหมาย</th>
                        <th colSpan="4" className={styles.centered}>ข้อมูลทะเบียนที่ผ่าน</th>
                        <th colSpan="4" className={styles.centered}>ข้อมูลทะเบียนไม่ผ่าน</th>
                    </tr>
                    <tr>
                        <th>กลุ่ม</th>
                        <th>ราย</th>
                        <th>แปลง</th>
                        <th>ไร่</th>
                        <th>กลุ่ม</th>
                        <th>ราย</th>
                        <th>แปลง</th>
                        <th>ไร่</th>
                        <th>กลุ่ม</th>
                        <th>ราย</th>
                        <th>แปลง</th>
                        <th>ไร่</th>
                    </tr>
                </thead>
                <tbody>
                    {summaryData.map((group, index) => (
                        <tr key={group.group_id}>
                            <td className={styles.centered}>{index + 1}</td>
                            <td>
                                <Link href={`/ORG/groupinfo/${group.group_id}`} passHref>
                                    <span className={styles.link}>{group.group_name}</span>
                                </Link>
                            </td>
                            <td className={styles.centered}>{group.group_district}</td>
                            <td className={styles.centered}>{group.group_province}</td>
                            <td className={styles.centered}>{1}</td>
                            <td className={styles.centered}>{group.member_count.toLocaleString()}</td>
                            <td className={styles.centered}>{group.total_plots.toLocaleString()}</td>
                            <td className={styles.centered}>{group.total_acres.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className={styles.centered}>{group.passed_group.toLocaleString()}</td>
                            <td className={styles.centered}>{group.passed_members.toLocaleString()}</td>
                            <td className={styles.centered}>{group.passed_plots.toLocaleString()}</td>
                            <td className={styles.centered}>{group.passed_acres.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className={styles.centered}>{group.failed_group.toLocaleString()}</td>
                            <td className={styles.centered}>{group.failed_members.toLocaleString()}</td>
                            <td className={styles.centered}>{group.failed_plots.toLocaleString()}</td>
                            <td className={styles.centered}>{group.failed_acres.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                    ))}

                    {/* Summary Row */}
                    <tr className={styles.summaryRow}>
                        <td rowSpan="2" colSpan="4" className={styles.totalLabel}>รวม</td>
                        <td>{totalRows.toLocaleString()}</td>
                        <td>{totalMemberCount.toLocaleString()}</td>
                        <td>{totalPlots.toLocaleString()}</td>
                        <td>{totalAcres.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{totalPassedGroup.toLocaleString()}</td>
                        <td>{totalPassedMembers.toLocaleString()}</td>
                        <td>{totalPassedPlots.toLocaleString()}</td>
                        <td>{totalPassedAcres.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{totalFailedGroup.toLocaleString()}</td>
                        <td>{totalFailedMembers.toLocaleString()}</td>
                        <td>{totalFailedPlots.toLocaleString()}</td>
                        <td>{totalFailedAcres.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default GroupSummary;
