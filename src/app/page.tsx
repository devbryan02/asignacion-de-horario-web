
import Link from "next/link";
export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Link href="/dashboard" className="btn btn-primary">Ver dashboard</Link>
      </div>
    </>
  );
}
