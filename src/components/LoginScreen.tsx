import React, { useState } from 'react';
import { Info, RefreshCw, Phone, MessageSquare, ChevronLeft } from 'lucide-react';
import { Button, Input, Card } from '../App';

interface LoginScreenProps {
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithPhone: (phone: string, containerId: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  confirmationResult: any;
  navigate: (screen: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  isLoading,
  error,
  loginWithGoogle,
  loginWithEmail,
  loginWithPhone,
  verifyOtp,
  confirmationResult,
  navigate
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [authMethod, setAuthMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      loginWithEmail(email, password);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      // Ensure phone is in E.164 format (+967...)
      const formattedPhone = phone.startsWith('+') ? phone : `+967${phone.replace(/^0+/, '')}`;
      loginWithPhone(formattedPhone, 'recaptcha-container');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp) {
      verifyOtp(otp);
    }
  };

  if (confirmationResult) {
    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white p-6 justify-center">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gov-green/10 rounded-full mx-auto mb-4 flex items-center justify-center text-gov-green">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gov-green">تحقق من الرمز</h1>
          <p className="text-gov-text-secondary">أدخل الرمز المرسل إلى {phone}</p>
        </div>

        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <Input 
            label="رمز التحقق (OTP)" 
            type="text" 
            placeholder="000000" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="text-center tracking-[1em] font-bold text-xl"
            maxLength={6}
          />
          
          {error && (
            <p className="text-xs text-gov-error text-center bg-red-50 p-2 rounded-lg">{error}</p>
          )}

          <Button 
            type="submit"
            className="w-full py-4 bg-gov-green text-white font-bold shadow-lg" 
            disabled={isLoading}
          >
            {isLoading ? <RefreshCw size={20} className="animate-spin" /> : 'تأكيد الرمز'}
          </Button>

          <button 
            type="button"
            onClick={() => window.location.reload()}
            className="w-full text-center text-sm text-gov-text-secondary hover:underline py-2"
          >
            إعادة المحاولة / تغيير الرقم
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white p-6 justify-center">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-gov-green/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <img src="https://picsum.photos/seed/yemen-logo/200/200" alt="Authority Logo" className="w-16 h-16 object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-gov-green">الهيئة العامة للتأمينات والمعاشات</h1>
        <p className="text-gov-text-secondary">فرع تَعِز - الجمهورية اليمنية</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setAuthMethod('EMAIL')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMethod === 'EMAIL' ? 'bg-white text-gov-green shadow-sm' : 'text-gray-500'}`}
        >
          البريد الإلكتروني
        </button>
        <button 
          onClick={() => setAuthMethod('PHONE')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMethod === 'PHONE' ? 'bg-white text-gov-green shadow-sm' : 'text-gray-500'}`}
        >
          رقم الهاتف
        </button>
      </div>

      {authMethod === 'EMAIL' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <Input 
            label="البريد الإلكتروني" 
            type="email" 
            placeholder="example@mail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="كلمة المرور" 
            type="password" 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && (
            <p className="text-xs text-gov-error text-center bg-red-50 p-2 rounded-lg">{error}</p>
          )}

          <Button 
            type="submit"
            className="w-full py-4 bg-gov-green text-white font-bold shadow-lg" 
            disabled={isLoading}
          >
            {isLoading ? <RefreshCw size={20} className="animate-spin" /> : 'تسجيل الدخول'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <Input 
            label="رقم الهاتف" 
            type="tel" 
            placeholder="77XXXXXXX" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <p className="text-[10px] text-gov-text-secondary text-right">سيتم إرسال رمز التحقق عبر رسالة SMS</p>
          
          {error && (
            <p className="text-xs text-gov-error text-center bg-red-50 p-2 rounded-lg">{error}</p>
          )}

          <div id="recaptcha-container"></div>

          <Button 
            type="submit"
            className="w-full py-4 bg-gov-green text-white font-bold shadow-lg" 
            disabled={isLoading}
          >
            {isLoading ? <RefreshCw size={20} className="animate-spin" /> : 'إرسال الرمز'}
          </Button>
        </form>
      )}

      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">أو</span></div>
      </div>

      <Button 
        type="button"
        className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50 shadow-sm" 
        onClick={loginWithGoogle} 
        disabled={isLoading}
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
        تسجيل الدخول بواسطة جوجل
      </Button>

      <div className="text-center pt-6">
        <p className="text-sm text-gov-text-secondary">
          ليس لديك حساب؟{' '}
          <button type="button" onClick={() => navigate('REGISTER')} className="text-gov-link font-bold hover:underline">إنشاء حساب جديد</button>
        </p>
      </div>

      <div className="mt-10 text-center">
        <button onClick={() => navigate('ABOUT')} className="text-gov-text-secondary text-sm flex items-center justify-center gap-1 mx-auto">
          <Info size={16} /> عن الهيئة
        </button>
      </div>
    </div>
  );
};
