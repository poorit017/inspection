'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../../css/GroupDetails.module.css';

const GroupPage = ({ params }) => {
  const [group, setGroup] = useState(null);
  const [plotMembers, setPlotMembers] = useState([]);
  const { id } = params;

  useEffect(() => {
    fetch(`/api/GAP/groups/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setGroup(data.group);
        setPlotMembers(data.plotMembers);
      })
      .catch((error) => {
        console.error('Failed to fetch group data:', error);
      });
  }, [id]);

  if (!group) return <div className={styles.heading}>Loading...</div>;

  const totalPlantedArea = plotMembers.reduce((total, member) => total + parseFloat(member.Planted_area || 0), 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>ชื่อกลุ่ม: {group.Group_name}</h1>
      <div className={styles.subhead}>
      <p >บ้านเลขที่: {group.Group_house_number}</p>
      <p>หมู่บ้าน: {group.Group_village}</p>
      <p>ตำบล: {group.Group_sub_district}</p>
      <p>อำเภอ: {group.Group_district}</p>
      <p>จังหวัด: {group.Group_province}</p>
      <p>หัวหน้ากลุ่ม: {group.Group_leader}</p>
      <p>เบอร์โทรหัวหน้ากลุ่ม: {group.Group_leader_phone}</p>
      </div>
      {group.Certification_file && (
        <a
          href={`/GAP/Certification_file/${(group.Certification_file)}`}
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
            <th>หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          {plotMembers.map((member, index) => (
            <tr key={member.Plotmember_id}>
              <td className={styles.centered}>{index + 1}</td>
              <td className={styles.centered}>{member.Member_id}</td>
              <td className={styles.centered}>{member.Plot_id}</td>
              <td>{member.Title}</td>
              <td>{member.Member_name}</td>
              <td>{member.Member_surname}</td>
              <td className={styles.centered}>{parseFloat(member.Planted_area).toFixed(2)}</td>
              <td>{member.Rice_variety}</td>
              <td>{member.Plot_inspection_result}</td>
              <td>{member.Failure_reason || ''}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="6"><strong>รวม</strong></td>
            <td className={styles.centered}><strong>{totalPlantedArea.toFixed(2)}</strong></td>
            <td colSpan="5"></td>
          </tr>
        </tbody>
      </table>
      <Link href="/GAP/groupinfo" className={styles.backButton}>
        ไปหน้ากลุ่ม
      </Link>
      <Link href="/GAP/gapsum" className={styles.backButton}>
        ไปหน้าสรุปทะเบียน
      </Link>
    </div>
  );
};

export default GroupPage;
