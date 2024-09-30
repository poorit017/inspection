'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../../css/GroupDetails.module.css';


const GroupPage = ({ params }) => {
  const [groupinfo, setGroupinfo] = useState(null);
  const [plotinfo, setPlotinfo] = useState([]);
  const [error, setError] = useState(null);
  const { id } = params;

  useEffect(() => {
    fetch(`/api/GAPSEED/groups/${id}`)
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
        setError('Failed to fetch group data.');
      });
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!groupinfo) return
  <div className={styles.heading}>Loading...</div>;


  const totalPlantedArea = plotinfo.reduce((total, member) => total + parseFloat(member.area || 0), 0);


  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>ชื่อกลุ่ม: {groupinfo.group_name}</h1>
      <div className={styles.subhead}>
        <div className={styles.infoSection}>
          <p>บ้านเลขที่: {groupinfo.group_no}</p>
          <p>หมู่บ้าน: {groupinfo.moo}</p>
          <p>ตำบล: {groupinfo.sub_district}</p>
          <p>อำเภอ: {groupinfo.district}</p>
          <p>จังหวัด: {groupinfo.province}</p>
          <p>หัวหน้ากลุ่ม: {groupinfo.titie} {groupinfo.first_name} {groupinfo.last_name}</p>
          <p>เบอร์โทรหัวหน้ากลุ่ม: {groupinfo.phone}</p>
        </div>
        <div className={styles.certificationSection}>
          <p>สถานะการรับรอง: {groupinfo.certification_code === "ไม่ผ่าน" ? "ไม่ผ่านการรับรอง" : "ผ่านการรับรอง"}</p>
          {groupinfo.certification_code !== "ไม่ผ่าน" && (
            <p>รหัสรับรอง: {groupinfo.certification_code}</p>
          )}
        </div>
      </div>
      {groupinfo.Certification_file && (
        <a
          href={`/GAPSEED/Certification_file/${(groupinfo.Certification_file)}`}
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
            <th>ชื่อเมล็ดพันธุ์ข้าว</th>
            <th>จำนวนที่แปลง(ไร่)</th>
            <th>ผลตรวจแปลง</th>
            <th>หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          {plotinfo.map((member, index) => (
            <tr key={member.plot_id}>
              <td className={styles.centered}>{index + 1}</td>
              <td className={styles.centered}>{member.member}</td>
              <td className={styles.centered}>{member.plot}</td>
              <td>{member.title}</td>
              <td>{member.first_name}</td>
              <td>{member.last_name}</td>
              <td>{member.rice_variety}</td>
              <td className={styles.centered}>{parseFloat(member.area,).toFixed(2)}</td>
              <td>{member.summary}</td>
              <td>{member.note}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="7"><strong>รวม</strong></td>
            <td className={styles.centered}><strong>{totalPlantedArea.toFixed(2)}</strong></td>
            <td colSpan="2"></td>
          </tr>
        </tbody>
      </table>
      <Link href="/GAPSEED/groupinfo" className={styles.backButton}>
        ไปหน้ากลุ่ม
      </Link>
      <Link href="/GAPSEED/gapseedsum" className={styles.backButton}>
        ไปหน้าสรุปทะเบียน
      </Link>
    </div>
  );
};

export default GroupPage;
