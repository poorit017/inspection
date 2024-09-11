"use client"; // This marks the component as a Client Component

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../css/GroupInfo.module.css';

const GroupInfo = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchProvince, setSearchProvince] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchSummary, setSearchSummary] = useState(['ผ่าน', 'ไม่ผ่าน']);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/GAPSEED/groups');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGroups(data);
        setFilteredGroups(data);

        // Extract unique provinces and districts
        const uniqueProvinces = [...new Set(data.map(group => group.province))];
        setProvinces(uniqueProvinces);

        const uniqueDistricts = [...new Set(data.map(group => group.district))];
        setDistricts(uniqueDistricts);
        setFilteredDistricts(uniqueDistricts);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    // Filter groups based on search criteria
    const filtered = groups.filter((group) => {
      const isPassed = group.certification_code !== 'ไม่ผ่าน';
      const isFailed = group.certification_code === 'ไม่ผ่าน';
      return (
        group.group_name.toLowerCase().includes(searchName.toLowerCase()) &&
        (searchProvince === '' || group.province.toLowerCase().includes(searchProvince.toLowerCase())) &&
        (searchDistrict === '' || group.district.toLowerCase().includes(searchDistrict.toLowerCase())) &&
        ((searchSummary.includes('ผ่าน') && isPassed) || 
         (searchSummary.includes('ไม่ผ่าน') && isFailed))
      );
    });
    setFilteredGroups(filtered);
  }, [searchName, searchProvince, searchDistrict, searchSummary, groups]);

  useEffect(() => {
    if (searchProvince) {
      // Update districts based on the selected province
      const filtered = districts.filter(district =>
        groups.some(group => group.district === district && group.province === searchProvince)
      );
      setFilteredDistricts(filtered);
    } else {
      // Reset districts if no province is selected
      setFilteredDistricts(districts);
    }
  }, [searchProvince, districts, groups]);

  const handleProvinceChange = (e) => {
    setSearchProvince(e.target.value);
    setSearchDistrict(''); // Reset district when province changes
  };

  const handleSummaryChange = (e) => {
    const value = e.target.value;
    setSearchSummary(prevSummary =>
      prevSummary.includes(value)
        ? prevSummary.filter(item => item !== value)
        : [...prevSummary, value]
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>มาตรฐานเมล็ดพันธุ์ข้าว (GAPSEED)</h1>
        <Link href="/">
          <button className={styles.backButton}>กลับไปหน้าแรก</button>
        </Link>
      </div>
      
      {error && <p>Error: {error}</p>}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="ค้นหาชื่อกลุ่ม"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className={styles.searchInput}
        />
        <select 
          value={searchProvince} 
          onChange={handleProvinceChange} 
          className={styles.searchInput}
        >
          <option value="">เลือกจังหวัด</option>
          {provinces.map((province, index) => (
            <option key={index} value={province}>
              {province}
            </option>
          ))}
        </select>
        <select 
          value={searchDistrict} 
          onChange={(e) => setSearchDistrict(e.target.value)} 
          className={styles.searchInput}
          disabled={!searchProvince}  // Disable if no province is selected
        >
          <option value="">เลือกอำเภอ</option>
          {filteredDistricts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>
        <div className={styles.checkboxContainer}>
          <label>
            <input
              type="checkbox"
              value="ผ่าน"
              checked={searchSummary.includes("ผ่าน")}
              onChange={handleSummaryChange}
            />
            ผ่าน
          </label>
          <label>
            <input
              type="checkbox"
              value="ไม่ผ่าน"
              checked={searchSummary.includes("ไม่ผ่าน")}
              onChange={handleSummaryChange}
            />
            ไม่ผ่าน
          </label>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>ชื่อกลุ่ม</th>
            <th>อำเภอ</th>
            <th>จังหวัด</th>
            <th>จำนวนสมาชิก</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, index) => (
              <tr key={group.group_id}>
                <td className={styles.centered}>{index + 1}</td>
                <td>
                  <Link href={`/GAPSEED/groupinfo/${group.group_id}`}>
                    <span className={styles.link}>{group.group_name}</span>
                  </Link>
                </td>
                <td>{group.district}</td>
                <td>{group.province}</td>
                <td className={styles.centered}>{group.max_member_id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">ไม่มีข้อมูลที่ค้นหา</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GroupInfo;
