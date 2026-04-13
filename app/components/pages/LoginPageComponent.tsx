'use client';

import { signIn } from 'next-auth/react';
import { LoginForm } from './subcomponents/LoginForm';

export default function LoginPageComponent() {
  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/projects' });
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🧪</span>
          <h1 className="text-2xl font-bold text-white mt-2">EZTest</h1>
        </div>
        <LoginForm onGoogleSignIn={handleGoogleSignIn} />
      </div>
    </div>
  );
}
