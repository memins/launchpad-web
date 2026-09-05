import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 Not Found | LaunchPad Web',
  description: 'The page you are looking for could not be found.',
};

const RootNotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-muted-foreground">
          That route is not in this ship kit. Head back to the landing page.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Back to LaunchPad Web
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RootNotFound;
