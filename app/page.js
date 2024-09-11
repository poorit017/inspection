import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import SummaryTable1 from '../components/SummaryTable1';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div>
      <Head>
        <title>ทะเบียนผู้ที่ได้รับการรับรอง</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Full-width section with container-fluid */}
      <div className="container">
        {/* Header Section */}
        <h2 className="text-center">
          <div className="headerleft">ผลการรับรองมาตรฐานข้าวคุณภาพ</div>
        </h2>
      </div>

      {/* Summary Table Section - Limited width with container */}
      <div className="container">
        <div className="col-md-12">
          <SummaryTable1 />
        </div>
      </div>

      {/* Group Certification Section */}
      <div className="container">
        <h2 className="text-center">
          <div className="header">ทะเบียนผู้ที่ได้รับการรับรอง</div>
        </h2>

        <div className="row">
          {/* GAP Certification Card */}
          <div className="col-md-6">
            <div className="card">
              <Image className="card-img-top" src="/img/GAP.png" alt="GAP Image" width={500} height={300} />
              <div className="card-body">
                <h3 className="card-title">มาตรฐานข้าว GAP</h3>
                <Link href="/GAP/groupinfo" className="btn btn-primary">ค้นหาผู้ที่ได้รับการรับรอง</Link>
                <Link href="/GAP/gapsum" className="btn btn-info">สรุปทะเบียนได้รับการรับรอง</Link>
              </div>
            </div>
          </div>

          {/* Organic Rice Certification Card */}
          <div className="col-md-6">
            <div className="card">
              <Image className="card-img-top" src="/img/ORG.png" alt="Organic Rice Image" width={500} height={300} />
              <div className="card-body">
                <h3 className="card-title">มาตรฐานข้าวอินทรีย์</h3>
                <Link href="/ORG/groupinfo" className="btn btn-primary">ค้นหาผู้ที่ได้รับการรับรอง</Link>
                <Link href="/ORG/orgsum" className="btn btn-info">สรุปทะเบียนได้รับการรับรอง</Link>
              </div>
            </div>
          </div>

          {/* GAPSEED Certification Card */}
          <div className="col-md-6">
            <div className="card">
              <Image className="card-img-top" src="/img/GAPSEED.jpg" alt="GAPSEED Image" width={500} height={300} />
              <div className="card-body">
                <h3 className="card-title">มาตรฐานเมล็ดพันธุ์ข้าว (GAPSEED)</h3>
                <Link href="/GAPSEED/groupinfo" className="btn btn-primary">ค้นหาผู้ที่ได้รับการรับรอง</Link>
                <Link href="/GAPSEED/gapseedsum" className="btn btn-info">สรุปทะเบียนได้รับการรับรอง</Link>
              </div>
            </div>
          </div>

          {/* GMP Certification Card */}
          <div className="col-md-6">
            <div className="card">
              <Image className="card-img-top" src="/img/GMP.png" alt="GMP Image" width={500} height={300} />
              <div className="card-body">
                <h3 className="card-title">มาตรฐานโรงสีข้าว GMP</h3>
                <Link href="#" className="btn btn-primary">ค้นหาผู้ที่ได้รับการรับรอง</Link>
                <Link href="#" className="btn btn-info">สรุปทะเบียนได้รับการรับรอง</Link>
              </div>
            </div>
          </div>

          {/* Q Certification Card */}
          <div className="col-md-6">
            <div className="card">
              <Image className="card-img-top" src="/img/Q.png" alt="Q Image" width={500} height={300} />
              <div className="card-body">
                <h3 className="card-title">มาตรฐานสินค้าข้าว Q</h3>
                <Link href="#" className="btn btn-primary">ค้นหาผู้ที่ได้รับการรับรอง</Link>
                <Link href="#" className="btn btn-info">สรุปทะเบียนได้รับการรับรอง</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Footer */}
      <div className="container-fluid p-0">
        <Footer />
      </div>
    </div>
  );
}
