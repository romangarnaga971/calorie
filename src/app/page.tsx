import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 text-center animate-in">
      <div className="w-16 h-16 bg-(--accent) text-(--accent-foreground) rounded-2xl flex items-center justify-center mb-6 shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-3">AI Calorie Tracker</h1>
      <p className="text-(--foreground) opacity-70 mb-8 max-w-[280px]">
        Відстежуй свої калорії за допомогою штучного інтелекту, просто фотографуючи їжу.
      </p>
      
      <div className="w-full space-y-3 mt-auto mb-8">
        <Link href="/login" className="w-full bg-(--accent) text-(--accent-foreground) py-4 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity flex justify-center">
          Увійти
        </Link>
        <Link href="/login?mode=signup" className="w-full bg-(--input) text-(--foreground) py-4 rounded-xl font-medium hover:opacity-90 transition-opacity flex justify-center">
          Створити акаунт
        </Link>
      </div>
    </div>
  );
}
