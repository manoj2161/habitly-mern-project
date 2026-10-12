import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const EmailVerified = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center border border-orange-100 dark:border-orange-900/30">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <CheckCircle
                size={52}
                className="text-orange-500"
                strokeWidth={2}
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Email Verified!
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Your email address has been successfully verified. You can now log
            in to your Habitly account.
          </p>

          <Link
            to="/"
            className="inline-block w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 font-semibold transition-colors duration-200"
          >
            Click here to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
