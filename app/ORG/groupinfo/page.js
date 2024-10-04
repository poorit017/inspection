"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from '../../css/GroupInfo.module.css';

const GroupInfo = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchProvince, setSearchProvince] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchSummary, setSearchSummary] = useState(["ผ่าน", "ไม่ผ่าน"]);

  useEffect(() => {
    // Fetch group data
    fetch("/api/ORG/groups")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setGroups(data);
        setFilteredGroups(data);

        // Extract unique provinces and districts
        const uniqueProvinces = [...new Set(data.map((group) => group.group_province))];
        setProvinces(uniqueProvinces);

        const uniqueDistricts = [...new Set(data.map((group) => group.group_district))];
        setDistricts(uniqueDistricts);
        setFilteredDistricts(uniqueDistricts);
      })
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    // Filter groups based on search criteria
    const filtered = groups.filter((group) => {
      const groupName = group.group_name ? group.group_name.toLowerCase() : "";
      const groupProvince = group.group_province ? group.group_province.toLowerCase() : "";
      const groupDistrict = group.group_district ? group.group_district.toLowerCase() : "";
      const isPassed = group.certification_code !== "-";
      const isFailed = group.certification_code === "-";

      return (
        groupName.includes(searchName.toLowerCase()) &&
        (searchProvince === "" || groupProvince.includes(searchProvince.toLowerCase())) &&
        (searchDistrict === "" || groupDistrict.includes(searchDistrict.toLowerCase())) &&
        ((searchSummary.includes("ผ่าน") && isPassed) || (searchSummary.includes("ไม่ผ่าน") && isFailed))
      );
    });
    setFilteredGroups(filtered);
  }, [searchName, searchProvince, searchDistrict, searchSummary, groups]);

  useEffect(() => {
    if (searchProvince) {
      const filtered = districts.filter((district) =>
        groups.some((group) => group.group_district === district && group.group_province === searchProvince)
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts(districts);
    }
  }, [searchProvince, districts, groups]);

  const handleProvinceChange = (e) => {
    setSearchProvince(e.target.value);
    setSearchDistrict(""); // Reset district when province changes
  };

  const handleSummaryChange = (e) => {
    const value = e.target.value;
    setSearchSummary((prevSummary) =>
      prevSummary.includes(value) ? prevSummary.filter((item) => item !== value) : [...prevSummary, value]
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>ทะเบียนมาตรฐานข้าวอินทรีย์</h1>
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
        <select value={searchProvince} onChange={handleProvinceChange} className={styles.searchInput}>
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
          disabled={!searchProvince} // Disable if no province is selected
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
          </tr>
        </thead>
        <tbody>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, index) => (
              <tr key={group.group_id}>
                <td className={styles.centered}>{index + 1}</td>
                <td>
                  <Link href={`/ORG/groupinfo/${group.group_id}`}>
                    <span className={styles.link}>
                      {group.group_name}
                      {group.Certification_file && group.Certification_file.trim() !== "-" && (
                        <>
                          {group.certification_code !== '-' && (
                            <span className={styles.certIcon} title="มีใบประกาศ">
                              <img src="../img/certification.png" alt="มีใบประกาศ" className={styles.iconSmall} />
                            </span>
                          )}
                          {group.certification_code === '-' && (
                            <span className={styles.certIcon} title="มีใบประกาศแต่ไม่ผ่านการรับรอง">
                              <img src="../img/noncert.png" alt="มีใบประกาศแต่ไม่ผ่านการรับรอง" className={styles.iconSmall} />
                            </span>
                          )}
                        </>
                      )}
                    </span>
                  </Link>
                </td>
                <td>{group.group_district}</td>
                <td>{group.group_province}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className={styles.noData}>ไม่มีข้อมูลที่ค้นหา</td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
};

export default GroupInfo;
