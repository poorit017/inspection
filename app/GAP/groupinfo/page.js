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
    fetch('/api/GAP/groups')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setGroups(data);
        setFilteredGroups(data);

        // Extract unique provinces and districts
        const uniqueProvinces = [...new Set(data.map(group => group.Group_province))];
        setProvinces(uniqueProvinces);

        const uniqueDistricts = [...new Set(data.map(group => group.Group_district))];
        setDistricts(uniqueDistricts);
        setFilteredDistricts(uniqueDistricts);
      })
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    let filtered = groups;

    // Filter groups based on selected province and district
    if (searchProvince) {
      filtered = filtered.filter(group => group.Group_province.toLowerCase().includes(searchProvince.toLowerCase()));

      if (searchDistrict) {
        filtered = filtered.filter(group => group.Group_district.toLowerCase().includes(searchDistrict.toLowerCase()));
      }
    }

    filtered = filtered.filter(group => 
      group.Group_name.toLowerCase().includes(searchName.toLowerCase()) &&
      searchSummary.includes(group.Summary)
    );

    setFilteredGroups(filtered);
  }, [searchName, searchProvince, searchDistrict, searchSummary, groups]);

  useEffect(() => {
    if (searchProvince) {
      // Filter districts based on selected province
      const filtered = [...new Set(groups
        .filter(group => group.Group_province === searchProvince)
        .map(group => group.Group_district))
      ];
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts(districts); // Reset district options if no province is selected
    }
    setSearchDistrict(''); // Reset district selection
  }, [searchProvince, districts, groups]);

  const handleSummaryChange = (e) => {
    const value = e.target.value;
    if (searchSummary.includes(value)) {
      setSearchSummary(searchSummary.filter(item => item !== value));
    } else {
      setSearchSummary([...searchSummary, value]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>ทะเบียนมาตรฐานข้าว GAP</h1>
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
          onChange={(e) => setSearchProvince(e.target.value)} 
          className={styles.searchInput}
        >
          <option value="">เลือกจังหวัด</option>
          {provinces.length > 0 && provinces.map((province, index) => (
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
            <th>จำนวนสมาชิก(คน)</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, index) => (
              <tr key={group.Group_id}>
                <td className={styles.centered}>{index + 1}</td>
                <td>
                  <Link href={`/GAP/groupinfo/${group.Group_id}`}>
                    <span className={styles.link}>{group.Group_name}</span>
                  </Link>
                </td>
                <td>{group.Group_district}</td>
                <td>{group.Group_province}</td>
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
