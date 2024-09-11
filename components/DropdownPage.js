"use client";

import { useState } from 'react';
import styles from './DropdownPage.css'; // Adjust the path as needed

export default function DropdownPage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Animated Dropdown Menu</h1>
            
            <div className={styles.dropdown}>
                <button 
                    className={styles.dropbtn}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    ค้นหาผู้ที่ได้รับการรับรอง
                </button>
                <div 
                    className={styles.dropdownContent} 
                    style={{ display: isOpen ? 'block' : 'none' }}
                >
                    <button>Option 1</button>
                    <button>Option 2</button>
                    <button>Option 3</button>
                </div>
            </div>
        </div>
    );
}
