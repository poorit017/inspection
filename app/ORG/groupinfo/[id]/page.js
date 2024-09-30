'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../../css/GroupDetails.module.css';

const GroupPage = ({ params }) => {
  const [groupinfo, setGroupinfo] = useState(null);
  const [plotinfo, setPlotinfo] = useState([]);
  const { id } = params;

  useEffect(() => {
    fetch(`/api/ORG/groups/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setGroupinfo(data.group);
        setPlotinfo(data.plotinfo);
      })
      .catch((error) => {
        console.error('Failed to fetch group data:', error);
      });
  }, [id]);

  if (!groupinfo) return <div className={styles.heading}>Loading...</div>;

  const totalPlantedArea = plotinfo.reduce((total, member) => total + parseFloat(member.planting_area || 0), 0);
  const totalEvaluationPassed = plotinfo.reduce((total, member) => total + parseFloat(member.evaluation_passed || 0), 0);
  const totalEvaluationFailed = plotinfo.reduce((total, member) => total + parseFloat(member.evaluation_failed || 0), 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>ชื่อกลุ่ม: {groupinfo.group_name}</h1>
      <div className={styles.subhead}>
        <div className={styles.infoSection}>
          <p>บ้านเลขที่: {groupinfo.group_house_number}</p>
          <p>หมู่บ้าน: {groupinfo.group_address}</p>
          <p>ตำบล: {groupinfo.group_subdistrict}</p>
          <p>อำเภอ: {groupinfo.group_district}</p>
          <p>จังหวัด: {groupinfo.group_province}</p>
          <p>หัวหน้ากลุ่ม: {groupinfo.group_leader}</p>
          <p>เบอร์โทรหัวหน้ากลุ่ม: {groupinfo.group_leader_phone}</p>
          </div>
        <div className={styles.certificationSection}>
          <p>สถานะการรับรอง: {groupinfo.certification_code === "-" ? "ไม่ผ่านการรับรอง" : "ผ่านการรับรอง"}</p>
          {groupinfo.certification_code !== "-" && (
            <p>รหัสรับรอง: {groupinfo.certification_code}</p>
          )}
        </div>
      </div>
      {groupinfo.Certification_file && (
        <a
          href={`/ORG/Certification_file/${(groupinfo.Certification_file)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.backButton}
        >
          ดูไฟล์การรับรอง
        </a>
      )}
      <h2 className={styles.subhead}>สมาชิกในกลุ่ม</h2>
      <table className={styles.table}>

        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>ราย</th>
            <th>แปลง</th>
            <th>คำนำหน้า</th>
            <th>ชื่อ</th>
            <th>นามสกุล</th>
            <th>พื้นที่ปลูก</th>
            <th>ชื่อพันธุ์ข้าว</th>
            <th>ผลตรวจแปลง</th>
            <th>จำนวนที่แปลงผ่าน(ไร่)</th>
            <th>จำนวนที่แปลงไม่ผ่าน(ไร่)</th>
          </tr>
        </thead>
        <tbody>
          {plotinfo.map((member, index) => (
            <tr key={member.plot_id}>
              <td className={styles.centered}>{index + 1}</td>
              <td className={styles.centered}>{member.member}</td>
              <td className={styles.centered}>{member.plot}</td>
              <td>{member.title}</td>
              <td>{member.member_first_name}</td>
              <td>{member.member_last_name}</td>
              <td className={styles.centered}>{parseFloat(member.planting_area).toFixed(2)}</td>
              <td>{member.rice_variety}</td>
              <td>{member.ics_result}</td>
              <td>{parseFloat(member.evaluation_passed).toFixed(2)}</td>
              <td>{parseFloat(member.evaluation_failed).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="6"><strong>รวม</strong></td>
            <td className={styles.centered}><strong>{totalPlantedArea.toFixed(2)}</strong></td>
            <td></td>
            <td></td>
            <td className={styles.centered}><strong>{totalEvaluationPassed.toFixed(2)}</strong></td>
            <td className={styles.centered}><strong>{totalEvaluationFailed.toFixed(2)}</strong></td>

          </tr>
        </tbody>
      </table>
      <Link href="/ORG/groupinfo" className={styles.backButton}>
        ไปหน้ากลุ่ม
      </Link>
      <Link href="/ORG/orgsum" className={styles.backButton}>
        ไปหน้าสรุปทะเบียน
      </Link>
    </div>
  );
};

export default GroupPage;
