
import './styles.css';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">Help & Support</h1>
      <p className="mb-2">
        Welcome to the Help page! Here you can find information on how to use the app.
      </p>
      <ul className="list-disc list-inside">
        <li>Use the "Make Post" button to submit your content.</li>
        <li>Use the "Profile" button to view your account info.</li>
        <li>Contact support at <a href="mailto:support@example.com" className="underline">support@example.com</a>.</li>
      </ul>

      <Link href="/" passHref>
        <button className="page-button">← Return Home</button>
      </Link>
    </div>
  );
}

