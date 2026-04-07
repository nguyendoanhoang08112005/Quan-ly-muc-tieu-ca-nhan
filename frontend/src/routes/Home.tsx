import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const activeScope = [
    'Dat va theo doi muc tieu ca nhan',
    'Quan ly viec can lam gan voi muc tieu',
    'Tong quan co ban sau khi dang nhap',
  ];

  const parkedScope = ['Projects', 'Subtasks cu', 'Habit', 'Report', 'Social follow'];

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="border-b-4 border-black bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 inline-flex border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-black">
            Buoc 1 dang don scope
          </div>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tight text-black md:text-6xl">
            Quan ly muc tieu ca nhan, khong phai project hub
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-gray-700">
            Repo nay dang duoc thu hep lai de chi con tap trung vao flow cot loi:
            dang nhap, xem muc tieu, va theo doi viec can lam gan voi muc tieu cua chinh ban.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="border-2 border-black bg-black px-8 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-gray-800"
              >
                Vao dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="border-2 border-black bg-black px-8 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-gray-800"
                >
                  Dang nhap
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-black px-8 py-3 text-sm font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white"
                >
                  Tao tai khoan
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="border-2 border-black bg-white p-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">Dang active</h2>
            <div className="mt-6 space-y-3">
              {activeScope.map((item) => (
                <div key={item} className="border-l-4 border-black pl-4 text-sm font-medium text-gray-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 border-black bg-white p-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">Tam bo qua</h2>
            <div className="mt-6 space-y-3">
              {parkedScope.map((item) => (
                <div key={item} className="border-l-4 border-gray-300 pl-4 text-sm font-medium text-gray-500">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
